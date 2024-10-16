import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";

import { Doctor } from "./doctor.schema";
import { User } from "src/user/user.schema";

import { UpdateDoctorDto } from "./dto/update-doctor.dto";
import { GetAllDoctorsDto } from "./dto/get-all-doctors.dto";
import { CreateNewDoctorDto } from "./dto/create-new-doctor.dto";

import { hashPassword } from "utils/hash-password";
import { generateEmail } from "utils/generate-email";
import { normalizeString } from "utils/normalize-string";
import { generatePassword } from "utils/generate-password";
import { convertImageToBase64 } from "utils/convert-to-base64";

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>
  ) { }

  async createNewDoctor(
    createNewDoctorDto: CreateNewDoctorDto,
    image: Express.Multer.File
  ): Promise<Doctor> {
    const newDoctor = new this.doctorModel({
      ...createNewDoctorDto,
      image: convertImageToBase64(image),
      medical_fee: Number(createNewDoctorDto.medical_fee),
      normalizedFullname: normalizeString(createNewDoctorDto.fullname)
    });

    const doctor = await newDoctor.save();

    const email = generateEmail(doctor.fullname);
    const password = generatePassword(doctor.fullname);
    const hashedPassword = await hashPassword(password);

    const newUser = new this.userModel({
      email,
      role: "doctor",
      password: hashedPassword,
      fullname: doctor.fullname
    });

    newUser.set("isVerified", undefined, { strict: false });
    await newUser.save();

    return doctor;
  }

  async updateDoctor(
    id: string,
    updateDoctorDto: UpdateDoctorDto,
    image?: Express.Multer.File
  ): Promise<Doctor> {
    const doctor = await this.doctorModel.findById(id).exec();
    if (!doctor) {
      throw new NotFoundException({
        errorCode: "DOCTOR_NOT_FOUND",
        message: "Doctor not found!"
      });
    }

    if (updateDoctorDto.fullname) {
      doctor.fullname = updateDoctorDto.fullname;
      doctor.normalizedFullname = normalizeString(updateDoctorDto.fullname);
    }

    if (updateDoctorDto.clinic_id) {
      doctor.clinic_id = updateDoctorDto.clinic_id;
    }

    if (updateDoctorDto.specialty_id) {
      doctor.specialty_id = updateDoctorDto.specialty_id;
    }

    if (updateDoctorDto.desc) {
      doctor.desc = updateDoctorDto.desc;
    }

    if (updateDoctorDto.province) {
      doctor.province = updateDoctorDto.province;
    }

    if (updateDoctorDto.medical_fee) {
      doctor.medical_fee = updateDoctorDto.medical_fee;
    }

    if (updateDoctorDto.imageName) {
      doctor.imageName = updateDoctorDto.imageName;
    }

    if (image) {
      doctor.image = convertImageToBase64(image);
    }

    return doctor.save();
  }

  async deleteDoctor(id: string): Promise<{ message: string }> {
    const doctor = await this.doctorModel.findByIdAndDelete(id).exec();
    if (!doctor) {
      throw new NotFoundException("Doctor not found!");
    }

    return { message: "Doctor deleted successfully!" };
  }

  async getAllDoctors({ page,
    limit,
    query,
    clinic,
    province,
    specialty
  }: GetAllDoctorsDto): Promise<{
    doctors: Doctor[];
    total: number;
  }> {
    const skip = (page - 1) * limit;
    const normalizedSearchTerm = normalizeString(query || "");

    const filter: any = {};

    if (normalizedSearchTerm) {
      filter.normalizedFullname = { $regex: new RegExp(normalizedSearchTerm, "i") };
    }

    if (province && province !== "all") {
      filter.province = province;
    }

    if (clinic && clinic !== "all") {
      filter.clinic_id = clinic;
    }

    if (specialty && specialty !== "all") {
      filter.specialty_id = specialty;
    }

    const [doctors, total] = await Promise.all([
      this.doctorModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .select("-imageName")
        .populate({
          path: "specialty_id",
          select: "-image -imageName -normalizedName -desc"
        })
        .populate({
          path: "clinic_id",
          select: "-avatar -avatarName -banner -bannerName -normalizedName -desc"
        })
        .exec(),
      this.doctorModel.countDocuments(filter).exec(),
    ]);

    return { doctors, total };
  }

  async getDoctorById(id: string): Promise<Doctor> {
    const doctor = await this.doctorModel
      .findById(id)
      .populate({
        path: "specialty_id",
        select: "-image -imageName -normalizedName -desc"
      })
      .populate({
        path: "clinic_id",
        select: "-avatar -avatarName -banner -bannerName -normalizedName -desc"
      })
      .exec();

    if (!doctor) {
      throw new NotFoundException("Doctor not found!");
    }

    return doctor;
  }
};