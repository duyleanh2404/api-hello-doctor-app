import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";

import { Specialty } from "./specialty.schema";
import { normalizeString } from "utils/normalize-string";
import { convertImageToBase64 } from "utils/convert-to-base64";
import { UpdateSpecialtyDto } from "./dto/update-specialty.dto";
import { GetAllSpecialtiesDto } from "./dto/get-all-specialties.dto";
import { CreateNewSpecialtyDto } from "./dto/create-new-specialty.dto";

@Injectable()
export class SpecialtyService {
  constructor(
    @InjectModel(Specialty.name) private readonly specialtyModel: Model<Specialty>
  ) { }

  async create(
    createNewSpecialtyDto: CreateNewSpecialtyDto,
    image: Express.Multer.File
  ): Promise<Specialty> {
    const existingSpecialty = await this.specialtyModel
      .findOne({ name: createNewSpecialtyDto.name })
      .exec();

    if (existingSpecialty) {
      throw new ConflictException({
        errorCode: "SPECIALTY_ALREADY_EXISTS",
        message: "Specialty with this name already exists!"
      });
    }

    const specialty = new this.specialtyModel({
      ...createNewSpecialtyDto,
      image: convertImageToBase64(image),
      normalizedName: normalizeString(createNewSpecialtyDto.name),
    });

    return specialty.save();
  }

  async updateSpecialty(
    id: string,
    updateSpecialtyDto: UpdateSpecialtyDto,
    image?: Express.Multer.File
  ): Promise<Specialty> {
    const specialty = await this.specialtyModel.findById(id).exec();
    if (!specialty) {
      throw new NotFoundException({
        errorCode: "SPECIALTY_NOT_FOUND",
        message: "Specialty not found!"
      });
    }

    if (updateSpecialtyDto.name) {
      const existingSpecialty = await this.specialtyModel
        .findOne({ name: updateSpecialtyDto.name, _id: { $ne: id } })
        .exec();

      if (existingSpecialty) {
        throw new ConflictException({
          errorCode: "SPECIALTY_ALREADY_EXISTS",
          message: "Specialty already exists!"
        });
      }

      specialty.name = updateSpecialtyDto.name;
      specialty.normalizedName = normalizeString(updateSpecialtyDto.name);
    }

    if (updateSpecialtyDto.desc) {
      specialty.desc = updateSpecialtyDto.desc;
    }

    if (updateSpecialtyDto.imageName) {
      specialty.imageName = updateSpecialtyDto.imageName;
    }

    if (image) {
      specialty.image = convertImageToBase64(image);
    }

    return specialty.save();
  }

  async deleteSpecialty(id: string): Promise<{ message: string }> {
    const specialty = await this.specialtyModel.findByIdAndDelete(id).exec();
    if (!specialty) {
      throw new NotFoundException("Specialty not found!");
    }

    return { message: "Specialty deleted successfully!" };
  }

  async getAllSpecialties({ page, limit, query }: GetAllSpecialtiesDto): Promise<{
    specialties: Specialty[]; total: number
  }> {
    const skip = (page - 1) * limit;
    const normalizedSearchTerm = normalizeString(query || "");

    const filter = normalizedSearchTerm
      ? { normalizedName: { $regex: new RegExp(normalizedSearchTerm, "i") } }
      : {};

    const [specialties, total] = await Promise.all([
      this.specialtyModel.find(filter).skip(skip).limit(limit).exec(),
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
};