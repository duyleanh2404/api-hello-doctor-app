import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Schedules } from "./schedule.schema";
import { CreateScheduleDto } from "./dto/create-new-schedule";
import { GetAllSchedulesDto } from "./dto/get-all-schedules.dto";
import { normalizeString } from "utils/normalize-string";
import { Doctor } from "src/doctor/doctor.schema";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedules.name) private scheduleModel: Model<Schedules>,
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>
  ) { }

  async createSchedule(createScheduleDto: CreateScheduleDto): Promise<Schedules> {
    const { doctor_id, date } = createScheduleDto;

    const existingSchedule = await this.scheduleModel.findOne({ doctor_id, date }).exec();

    if (existingSchedule) {
      throw new ConflictException(
        `A schedule already exists for doctor with ID ${doctor_id} on ${date}!`
      );
    }

    const newSchedule = new this.scheduleModel(createScheduleDto);
    return await newSchedule.save();
  }

  async updateSchedule(id: string, updateScheduleDto: UpdateScheduleDto): Promise<Schedules> {
    const schedule = await this.scheduleModel.findById(id);

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    if (updateScheduleDto.doctor_id) {
      schedule.doctor_id = updateScheduleDto.doctor_id;
    }
    if (updateScheduleDto.date) {
      schedule.date = updateScheduleDto.date;
    }
    if (updateScheduleDto.timeSlots) {
      schedule.timeSlots = updateScheduleDto.timeSlots;
    }

    await schedule.save();
    return schedule;
  }

  async deleteSchedule(id: string): Promise<{ message: string }> {
    const schedule = await this.scheduleModel.findByIdAndDelete(id).exec();
    if (!schedule) {
      throw new NotFoundException("Schedule not found!");
    }

    return { message: "Schedule deleted successfully!" };
  }

  async getAllSchedules({
    page,
    limit,
    query,
    date
  }: GetAllSchedulesDto): Promise<{
    schedules: Schedules[];
    total: number;
  }> {
    const skip = (page - 1) * limit;
    const normalizedSearchTerm = normalizeString(query || "");

    const filter: any = {};

    if (normalizedSearchTerm) {
      const doctorIds = await this.doctorModel
        .find({
          normalizedFullname: { $regex: new RegExp(normalizedSearchTerm, "i") }
        })
        .select("_id");

      if (doctorIds.length > 0) {
        filter.doctor_id = { $in: doctorIds.map(doc => doc._id) };
      }
    }

    if (date) {
      filter.date = date;
    }

    const [schedules, total] = await Promise.all([
      this.scheduleModel
        .find(filter)
        .populate({
          path: "doctor_id",
          select: "fullname clinic_id specialty_id",
          populate: [
            { path: "clinic_id", select: "name location" },
            { path: "specialty_id", select: "name" }
          ]
        })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.scheduleModel.countDocuments(filter).exec(),
    ]);

    return { schedules, total };
  }

  async getScheduleById(id: string): Promise<Schedules> {
    const schedule = await this.scheduleModel
      .findById(id)
      .populate("doctor_id", "fullname")
      .exec();

    if (!schedule) {
      throw new NotFoundException("Schedule not found!");
    }

    return schedule;
  }
};