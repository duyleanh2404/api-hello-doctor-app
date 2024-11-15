import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";

import { Clinic } from "./clinic.schema";

import { normalizeString } from "utils/normalize-string";
import { createProjection } from "utils/create-projection";
import { convertImageToBase64 } from "utils/convert-to-base64";

import { EditClinicDto } from "./dto/edit-clinic.dto";
import { CreateClinicDto } from "./dto/create-clinic.dto";
import { GetAllClinicsDto } from "./dto/get-all-clinics.dto";

@Injectable()
export class ClinicService {
  constructor(@InjectModel(Clinic.name) private clinicModel: Model<Clinic>) { }

  async createClinic(
    dto: CreateClinicDto, avatar: Express.Multer.File, banner: Express.Multer.File
  ): Promise<Clinic> {
    const existingClinic = await this.clinicModel.findOne({ name: dto.name }).exec();
    if (existingClinic) {
      throw new ConflictException("Clinic already exists!");
    }

    const addressParts = dto.address.split(",").map((part) => part.trim());

    const clinic = new this.clinicModel({
      ...dto,
      normalizedName: normalizeString(dto.name),
      province: addressParts[addressParts.length - 1],
      avatar: convertImageToBase64(avatar),
      banner: convertImageToBase64(banner)
    });

    return await clinic.save();
  }

  async editClinic(
    id: string, dto: EditClinicDto, avatar?: Express.Multer.File, banner?: Express.Multer.File
  ): Promise<Clinic> {
    const clinic = await this.clinicModel.findById(id).exec();
    if (!clinic) {
      throw new NotFoundException("Clinic not found!");
    }

    if (dto.name) {
      clinic.normalizedName = normalizeString(dto.name);
    }
    if (avatar) {
      clinic.avatar = convertImageToBase64(avatar);
    }
    if (banner) {
      clinic.banner = convertImageToBase64(banner);
    }

    Object.entries(dto).forEach(([key, value]) => {
      if (value && key !== "avatar" && key !== "banner") {
        clinic[key] = value;
      }
    });

    return await clinic.save();
  }

  async deleteClinic(id: string) {
    const clinic = await this.clinicModel.findByIdAndDelete(id).exec();
    if (!clinic) {
      throw new NotFoundException("Clinic not found!");
    }
  }

  async getAllClinics({
    page = 1, limit = 10, query, exclude, province = "all"
  }: GetAllClinicsDto): Promise<{ clinics: Clinic[]; total: number }> {
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (query) {
      filter.normalizedName = { $regex: new RegExp(normalizeString(query), "i") };
    }
    if (province !== "all") {
      filter.province = province;
    }

    const defaultFields = ["name", "address", "desc", "avatar", "banner"];
    const projection = createProjection(defaultFields, exclude);

    const [clinics, total] = await Promise.all([
      this.clinicModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .select(projection)
        .sort({ createdAt: -1 })
        .exec(),
      this.clinicModel.countDocuments(filter).exec()
    ]);

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