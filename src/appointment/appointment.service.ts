import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";

import { Buffer } from "buffer";
import { format } from "date-fns";
import { toDate } from "date-fns-tz";

import { normalizeString } from "utils/normalize-string";

import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { GetAllAppointmentsDto } from "./dto/get-all-appointments.dto";

import { User } from "src/user/user.schema";
import { Doctor } from "src/doctor/doctor.schema";
import { Clinic } from "src/clinic/clinic.schema";
import { Appointment } from "./appointment.schema";
import { Schedule } from "src/schedule/schedule.schema";
import { Specialty } from "src/specialty/specialty.schema";
import { convertToUTC } from "utils/convert-to-utc";

@Injectable()
export class AppointmentService {
  constructor(
    private mailerService: MailerService,
    @InjectModel("User") private userModel: Model<User>,
    @InjectModel("Doctor") private doctorModel: Model<Doctor>,
    @InjectModel("Clinic") private clinicModel: Model<Clinic>,
    @InjectModel("Schedule") private scheduleModel: Model<Schedule>,
    @InjectModel("Specialty") private specialtyModel: Model<Specialty>,
    @InjectModel("Appointment") private appointmentModel: Model<Appointment>
  ) { }

  async createAppointment({
    user_id, doctor_id, date, time, zaloPhone, address, payment, reasons, newPatients
  }: CreateAppointmentDto) {
    const appointmentExisting = await this.appointmentModel.findOne({
      user_id, doctor_id, date, time
    });

    if (appointmentExisting) {
      throw new ConflictException("Appointment has been booked!");
    }

    const userData = await this.userModel.findById(user_id);
    if (!userData) {
      throw new NotFoundException("User not found!");
    }

    const doctorData = await this.doctorModel.findById(doctor_id);
    if (!doctorData) {
      throw new NotFoundException("Doctor not found!");
    }

    const clinicData = await this.clinicModel.findById(doctorData.clinic_id);
    if (!clinicData) {
      throw new NotFoundException("Clinic not found!");
    }

    const specialtyData = await this.specialtyModel.findById(doctorData.specialty_id);
    if (!specialtyData) {
      throw new NotFoundException("Specialty not found!");
    }

    const appointmentInfo = { doctor_id, date, time };
    let newAppointment: any;

    switch (payment) {
      case "COD":
        const token = Buffer.from(JSON.stringify(appointmentInfo)).toString("base64");

        await this.mailerService.sendMail({
          from: "Hello Bacsi <hellodoctor.app.healthcare@gmail.com>",
          to: userData.email,
          subject: "Xác nhận đơn đặt lịch khám",
          template: "./verify-booking",
          context: {
            token,
            appointmentTime: time,
            appointmentDate: format(date, "dd/MM/yyyy"),
            clinicName: clinicData?.name,
            location: clinicData?.address,
            specialty: specialtyData?.name,
            patientsName: userData.fullname,
            doctorName: doctorData.fullname
          }
        });

        newAppointment = await this.appointmentModel.create({
          user_id, doctor_id, date: convertToUTC(date), time, newPatients, zaloPhone,
          address, reasons, token, payment, isFinished: false, isVerified: false
        });
        break;

      case "ATM":
        newAppointment = await this.appointmentModel.create({
          user_id, doctor_id, date: convertToUTC(date), time, newPatients,
          zaloPhone, address, reasons, payment, isFinished: false, isVerified: true
        });

        await this.scheduleModel.findOneAndUpdate(
          { doctor_id, date: convertToUTC(date), "timeSlots.timeline": time },
          { $set: { "timeSlots.$.isBooked": true } },
          { new: true }
        );

        await this.mailerService.sendMail({
          from: "Hello Bacsi <hellodoctor.app.healthcare@gmail.com>",
          to: userData.email,
          subject: "Thông tin đơn đặt lịch khám",
          template: "./details-appointment",
          context: {
            appointmentTime: time,
            appointmentDate: format(date, "dd/MM/yyyy"),
            clinicName: clinicData?.name,
            location: clinicData?.address,
            specialty: specialtyData?.name,
            patientsName: userData.fullname,
            doctorName: doctorData.fullname
          }
        });
        break;
    }

    return newAppointment;
  }

  async updateStatusAppointment(token: string) {
    const appointment = await this.appointmentModel.findOne({ token });
    if (!appointment) {
      throw new NotFoundException("Appointment not found!");
    }

    const decodedToken = Buffer.from(token, "base64").toString("utf8");
    const { doctor_id, date, time } = JSON.parse(decodedToken);

    await this.scheduleModel.findOneAndUpdate(
      {
        doctor_id,
        date: convertToUTC(date),
        "timeSlots.timeline": time,
      },
      { $set: { "timeSlots.$.isBooked": true } },
      { new: true }
    );

    appointment.isVerified = true;
    appointment.set("token", undefined, { strict: false });
    await appointment.save();
  }

  async getAllAppointments({
    page = 1, limit = 10, user_id, doctor_id, query, date
  }: GetAllAppointmentsDto): Promise<{ appointments: Appointment[]; total: number }> {
    const skip = (page - 1) * limit;
    const filter: any = {};

    let userIds: string[] = [];
    if (query) {
      const normalizedSearchTerm = normalizeString(query);
      const users = await this.userModel
        .find({ normalizedFullname: { $regex: new RegExp(normalizedSearchTerm, "i") } })
        .select("_id")
        .lean()
        .exec();

      userIds = users.map((user: { _id: any }) => String(user._id));
    }

    if (userIds.length === 0 && query) {
      return { appointments: [], total: 0 };
    }

    if (user_id) {
      filter.user_id = user_id;
    } else if (userIds.length) {
      filter.user_id = { $in: userIds };
    }
    if (doctor_id) {
      filter.doctor_id = doctor_id;
    }
    if (date) {
      filter.date = date;
    }

    const [appointments, total] = await Promise.all([
      this.appointmentModel
        .find({ ...filter, isFinished: false })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate({ path: "user_id", select: "-image" })
        .populate({
          path: "doctor_id",
          select: "-desc",
          populate: [
            { path: "clinic_id", select: "avatar address name" },
            { path: "specialty_id", select: "name" }
          ]
        })
        .exec(),
      this.appointmentModel
        .countDocuments({ ...filter, isFinished: false })
        .exec()
    ]);

    return { appointments, total };
  }

  async deleteAppointment(id: string) {
    const appointment = await this.appointmentModel.findByIdAndDelete(id).exec();
    if (!appointment) {
      throw new NotFoundException("Appointment not found!");
    }
  }
};