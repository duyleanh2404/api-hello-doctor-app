import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";

import { Clinic } from "./clinic.schema";
import { normalizeString } from "utils/normalize-string";
import { UpdateClinicDto } from "./dto/update-clinic.dto";
import { GetAllClinicsDto } from "./dto/get-all-clinics.dto";
import { convertImageToBase64 } from "utils/convert-to-base64";
import { CreateNewClinicDto } from "./dto/create-new-clinic.dto";

@Injectable()
export class ClinicService {
  constructor(@InjectModel(Clinic.name) private clinicModel: Model<Clinic>) { }

  async create(
    createNewClinicDto: CreateNewClinicDto,
    avatar: Express.Multer.File,
    banner: Express.Multer.File
  ): Promise<Clinic> {
    const existingClinic = await this.clinicModel.findOne({ name: createNewClinicDto.name }).exec();
    if (existingClinic) {
      throw new ConflictException({
        errorCode: "CLINIC_ALREADY_EXISTS",
        message: "Clinic already exists!"
      });
    }

    createNewClinicDto.avatar = convertImageToBase64(avatar);
    createNewClinicDto.banner = convertImageToBase64(banner);
    createNewClinicDto.normalizedName = normalizeString(createNewClinicDto.name);

    const addressParts = createNewClinicDto.address.split(",").map((part) => part.trim());
    createNewClinicDto.province = addressParts[addressParts.length - 1];

    const clinic = new this.clinicModel(createNewClinicDto);

    return await clinic.save();
  }

  async updateClinic(
    id: string,
    updateClinicDto: UpdateClinicDto,
    avatar?: Express.Multer.File,
    banner?: Express.Multer.File
  ): Promise<Clinic> {
    const { name, desc, address } = updateClinicDto;

    const clinic = await this.clinicModel.findById(id).exec();
    if (!clinic) {
      throw new NotFoundException({
        errorCode: "CLINIC_NOT_FOUND",
        message: "Clinic not found!"
      });
    }

    if (name) {
      const existingClinic = await this.clinicModel.findOne({
        name,
        _id: { $ne: id }
      }).exec();

      if (existingClinic) {
        throw new ConflictException({
          errorCode: "CLINIC_ALREADY_EXISTS",
          message: "Clinic already exists!"
        });
      }

      clinic.name = name;
      clinic.normalizedName = normalizeString(name);
    }

    if (desc) {
      clinic.desc = desc;
    }
    if (address) {
      clinic.address = address;
    }
    if (avatar) {
      clinic.avatar = convertImageToBase64(avatar);
    }
    if (banner) {
      clinic.banner = convertImageToBase64(banner);
    }

    return await clinic.save();
  }

  async deleteClinic(id: string): Promise<{ message: string }> {
    const clinic = await this.clinicModel.findByIdAndDelete(id).exec();
    if (!clinic) {
      throw new NotFoundException("Clinic not found!");
    }

    return { message: "Clinic deleted successfully!" };
  }

  async getAllClinics(getAllClinicsDto: GetAllClinicsDto): Promise<{ clinics: Clinic[]; total: number }> {
    const { page = 1, limit = 10, query = "", province } = getAllClinicsDto;

    const skip = (page - 1) * limit;
    const normalizedSearchTerm = normalizeString(query);

    const filter: any = {};

    if (normalizedSearchTerm) {
      filter.normalizedName = { $regex: new RegExp(normalizedSearchTerm, "i") };
    }

    if (province && province !== "all") {
      filter.province = province;
    }

    const clinicsPromise = this.clinicModel.find(filter).skip(skip).limit(limit).exec();
    const totalPromise = this.clinicModel.countDocuments(filter).exec();

    const [clinics, total] = await Promise.all([clinicsPromise, totalPromise]);

    return { clinics, total };
  }

  async getClinicById(id: string): Promise<Clinic> {
    const clinic = await this.clinicModel.findById(id).exec();
    if (!clinic) {
      throw new NotFoundException("Clinic not found!");
    }

    return clinic;
  }
};