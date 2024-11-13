import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";

import { Specialty } from "./specialty.schema";

import { normalizeString } from "utils/normalize-string";
import { convertImageToBase64 } from "utils/convert-to-base64";

import { EditSpecialtyDto } from "./dto/edit-specialty.dto";
import { CreateSpecialtyDto } from "./dto/create-specialty.dto";
import { GetAllSpecialtiesDto } from "./dto/get-all-specialties.dto";

@Injectable()
export class SpecialtyService {
  constructor(@InjectModel(Specialty.name) private readonly specialtyModel: Model<Specialty>) { }

  async createSpecialty(dto: CreateSpecialtyDto, image: Express.Multer.File): Promise<Specialty> {
    const existingSpecialty = await this.specialtyModel.findOne({ name: dto.name }).exec();

    if (existingSpecialty) {
      throw new ConflictException("Specialty with this name already exists!");
    }

    const specialty = new this.specialtyModel({
      ...dto,
      image: convertImageToBase64(image),
      normalizedName: normalizeString(dto.name)
    });

    return await specialty.save();
  }

  async editSpecialty(
    id: string, dto: EditSpecialtyDto, image?: Express.Multer.File
  ): Promise<Specialty> {
    const specialty = await this.specialtyModel.findById(id).exec();
    if (!specialty) {
      throw new NotFoundException("Specialty not found!");
    }

    if (dto.name) {
      specialty.normalizedName = normalizeString(dto.name);
    }
    if (image) {
      specialty.image = convertImageToBase64(image);
    }

    Object.entries(dto).forEach(([key, value]) => {
      if (value !== undefined && key != "image") {
        specialty[key] = value;
      }
    });

    return await specialty.save();
  }

  async deleteSpecialty(id: string) {
    const specialty = await this.specialtyModel.findByIdAndDelete(id).exec();
    if (!specialty) {
      throw new NotFoundException("Specialty not found!");
    }
  }

  async getAllSpecialties({ page, limit, query, exclude }: GetAllSpecialtiesDto): Promise<{
    specialties: Specialty[]; total: number;
  }> {
    const skip = (page - 1) * limit;
    let filter: {};

    if (query) {
      const normalizedSearchTerm = normalizeString(query);

      filter = normalizedSearchTerm
        ? { normalizedName: { $regex: new RegExp(normalizedSearchTerm, "i") } } : {};
    }

    let projection: Record<string, number> = {};
    if (exclude) {
      const excludeFields: string[] = exclude.split(",").map((field) => field.trim());
      const defaultFields = ["name", "desc", "image"];

      defaultFields.forEach((field) => {
        if (!excludeFields.includes(field)) {
          projection[field] = 1;
        }
      });
    }

    const [specialties, total] = await Promise.all([
      this.specialtyModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .select(projection)
        .exec(),
      this.specialtyModel.countDocuments(filter).exec()
    ]);

    return { specialties, total };
  }

  async getSpecialtyById(id: string): Promise<Specialty> {
    const specialty = await this.specialtyModel.findById(id).exec();
    if (!specialty) {
      throw new NotFoundException("Specialty not found!");
    }

    return specialty;
  }

  async getSpecialtyByName(name: string): Promise<Specialty> {
    const normalizedName = normalizeString(name);
    const specialty = await this.specialtyModel
      .findOne({ normalizedName })
      .select("_id")
      .exec();

    if (!specialty) {
      throw new NotFoundException("Specialty not found!");
    }

    return specialty;
  }
};