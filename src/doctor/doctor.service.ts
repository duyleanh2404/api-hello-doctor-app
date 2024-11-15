import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";

import { Doctor } from "./doctor.schema";
import { User } from "src/user/user.schema";

import { hashPassword } from "utils/hash-password";
import { normalizeString } from "utils/normalize-string";
import { convertImageToBase64 } from "utils/convert-to-base64";

import { EditDoctorDto } from "./dto/edit-doctor.dto";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
import { GetAllDoctorsDto } from "./dto/get-all-doctors.dto";

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>
  ) { }

  async createDoctor(dto: CreateDoctorDto, image: Express.Multer.File): Promise<Doctor> {
    const newDoctor = new this.doctorModel({
      ...dto,
      image: convertImageToBase64(image),
      medicalFee: Number(dto.medicalFee),
      normalizedFullname: normalizeString(dto.fullname),
    });

    const doctor = await newDoctor.save();

    const normalizedFullname = normalizeString(dto.fullname);
    const normalizedFullnameNoSpace = normalizedFullname.replace(/\s+/g, "");
    const email = `${normalizedFullnameNoSpace}${Math.floor(1000 + Math.random() * 9000)}@gmail.com`;
    const password = `${normalizedFullnameNoSpace}123A@`;
    const hashedPassword = await hashPassword(password);

    const newUser = new this.userModel({
      doctor_id: doctor._id,
      email,
      fullname: doctor.fullname,
      password: hashedPassword,
      normalizedFullname,
      image: convertImageToBase64(image),
      role: "doctor",
      isVerified: true
    });

    await newUser.save();

    return doctor;
  }

  async editDoctor(id: string, dto: EditDoctorDto, image?: Express.Multer.File): Promise<Doctor> {
    const doctor = await this.doctorModel.findById(id).exec();
    if (!doctor) {
      throw new NotFoundException("Doctor not found!");
    }

    if (dto.fullname) {
      doctor.normalizedFullname = normalizeString(dto.fullname);
    }
    if (image) {
      doctor.image = convertImageToBase64(image);
    }

    Object.entries(dto).forEach(([key, value]) => {
      if (key != "normalizedFullname" && key !== "image") doctor[key] = value;
    });

    return await doctor.save();
  }

  async deleteDoctor(id: string) {
    const doctor = await this.doctorModel.findByIdAndDelete(id).exec();
    if (!doctor) {
      throw new NotFoundException("Doctor not found!");
    }
  }

  async getAllDoctors({
    page, limit, clinic_id, specialty_id, query, exclude, province = "all"
  }: GetAllDoctorsDto): Promise<{ doctors: Doctor[]; total: number; }> {
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {
      ...(query && { normalizedFullname: { $regex: new RegExp(normalizeString(query), "i") } }),
      ...(clinic_id && clinic_id !== "all" && { clinic_id }),
      ...(specialty_id && specialty_id !== "all" && { specialty_id }),
      ...(province && province !== "all" && { province })
    };

    let projection: Record<string, number> = {};
    let excludeFields: string[] = [];
    const defaultFields = ["desc", "image", "fullname"];

    if (exclude) {
      excludeFields = exclude.split(",").map((field) => field.trim());
    }

    defaultFields.forEach((field) => {
      if (!excludeFields.includes(field)) projection[field] = 1;
    });

    const queryBuilder = this.doctorModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .select(projection)
      .sort({ createdAt: -1 });

    if (!excludeFields.includes("specialty_id")) {
      queryBuilder.populate({
        path: "specialty_id",
        select: "-image -imageName -normalizedName -desc -createdAt -updatedAt -__v"
      });
    }

    if (!excludeFields.includes("clinic_id")) {
      queryBuilder.populate({
        path: "clinic_id",
        select: "-avatar -avatarName -banner -bannerName -normalizedName -province -desc -createdAt -updatedAt -__v"
      });
    }

    const [doctors, total] = await Promise.all([
      queryBuilder.exec(),
      this.doctorModel.countDocuments(filter).exec()
    ]);

    return { doctors, total };
  }

  async getDoctorById(id: string): Promise<Doctor> {
    const doctor = await this.doctorModel
      .findById(id)
      .populate({
        path: "specialty_id",
        select: "-imageName -normalizedName -desc"
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