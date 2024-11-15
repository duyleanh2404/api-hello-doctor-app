import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";

import { Schedule } from "./schedule.schema";
import { Doctor } from "src/doctor/doctor.schema";

import { convertToUTC } from "utils/convert-to-utc";
import { normalizeString } from "utils/normalize-string";
import { createProjection } from "utils/create-projection";

import { GetScheduleDto } from "./dto/get-schedule.dto";
import { EditScheduleDto } from "./dto/edit-schedule.dto";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { GetAllSchedulesDto } from "./dto/get-all-schedules.dto";
import { GetScheduleRangeDto } from "./dto/get-schedule-range.dto";

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>
  ) { }

  async createSchedule(dto: CreateScheduleDto): Promise<Schedule> {
    const { doctor_id, date } = dto;
    const existingSchedule = await this.scheduleModel.findOne({ doctor_id, date: convertToUTC(date) }).exec();

    if (existingSchedule) {
      throw new ConflictException(`A schedule already exists for doctor with ID ${doctor_id} on ${date}!`);
    }

    const newSchedule = new this.scheduleModel({ ...dto, date: convertToUTC(date) });
    return await newSchedule.save();
  }

  async editSchedule(id: string, dto: EditScheduleDto): Promise<Schedule> {
    const editedSchedule = await this.scheduleModel.findByIdAndUpdate(id, dto, { new: true });
    if (!editedSchedule) {
      throw new NotFoundException("Schedule not found!");
    }

    return editedSchedule;
  }

  async deleteSchedule(id: string) {
    const schedule = await this.scheduleModel.findByIdAndDelete(id).exec();

    if (!schedule) {
      throw new NotFoundException("Schedule not found!");
    }
  }

  async getAllSchedules({ page = 1, limit = 10, query, exclude, date }: GetAllSchedulesDto): Promise<{
    schedules: Schedule[]; total: number;
  }> {
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (query) {
      const doctorIds = await this.doctorModel
        .find({ normalizedFullname: { $regex: new RegExp(normalizeString(query), "i") } })
        .select("_id");

      if (doctorIds.length) filter.doctor_id = { $in: doctorIds.map(doc => doc._id) };
    }

    if (date) {
      filter.date = convertToUTC(date);
    }

    const defaultFields = ["date", "timeSlots"];
    const projection = createProjection(defaultFields, exclude);

    const [schedules, total] = await Promise.all([
      this.scheduleModel
        .find(filter)
        .populate({
          path: "doctor_id",
          select: "fullname clinic_id specialty_id",
          populate: [
            { path: "clinic_id", select: "name address" },
            { path: "specialty_id", select: "name" }
          ]
        })
        .skip(skip)
        .limit(limit)
        .select(projection)
        .sort({ date: -1 })
        .exec(),
      this.scheduleModel.countDocuments(filter).exec()
    ]);

    return { schedules, total };
  }

  async getSchedulesByRange({ doctor_id, startDate, endDate }: GetScheduleRangeDto): Promise<Schedule[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const schedules = await this.scheduleModel.find({
      doctor_id, date: { $gte: start, $lte: end }
    }).exec();

    return schedules;
  }

  async getSchedule({ doctor_id, schedule_id, date }: GetScheduleDto): Promise<Schedule> {
    const filter = {
      ...(doctor_id && { doctor_id }),
      ...(schedule_id && { _id: schedule_id }),
      ...(date && { date: convertToUTC(date) })
    };

    const schedule = await this.scheduleModel
      .findOne(filter)
      .populate({
        path: "doctor_id",
        select: "clinic_id specialty_id fullname medicalFee image",
        populate: [
          { path: "clinic_id", select: "name address" },
          { path: "specialty_id", select: "name" }
        ]
      })
      .exec();

    if (!schedule) {
      throw new NotFoundException("Schedule not found!");
    }

    return schedule;
  }
};