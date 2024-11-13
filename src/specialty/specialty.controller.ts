import {
  Put, Get, Post, Body, Param, Query, Delete,
  UseGuards, Controller, UploadedFile, UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { Specialty } from "./specialty.schema";
import { SpecialtyService } from "./specialty.service";
import { Roles } from "src/auth/passport/roles.decorator";

import { RolesGuard } from "src/auth/passport/roles.guard";
import { JwtAuthGuard } from "src/auth/passport/jwt-auth.guard";

import { EditSpecialtyDto } from "./dto/edit-specialty.dto";
import { CreateSpecialtyDto } from "./dto/create-specialty.dto";
import { GetAllSpecialtiesDto } from "./dto/get-all-specialties.dto";

@Controller("specialty")
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) { }

  @Post("create")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @UseInterceptors(FileInterceptor("image"))
  async createSpecialty(
    @Body() dto: CreateSpecialtyDto, @UploadedFile() image: Express.Multer.File
  ): Promise<{ message: string; specialty: Specialty }> {
    const specialty = await this.specialtyService.createSpecialty(dto, image);

    return {
      message: "Specialty created successfully!",
      specialty
    };
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @UseInterceptors(FileInterceptor("image"))
  async editSpecialty(
    @Param("id") id: string, @Body() dto: EditSpecialtyDto, @UploadedFile() image: Express.Multer.File
  ): Promise<{ message: string; specialty: Specialty }> {
    const updatedSpecialty = await this.specialtyService.editSpecialty(id, dto, image);

    return {
      message: "Specialty updated successfully!",
      specialty: updatedSpecialty
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  async deleteSpecialty(@Param("id") id: string): Promise<{ message: string }> {
    await this.specialtyService.deleteSpecialty(id);
    return { message: "Specialty deleted successfully!" };
  }

  @Get()
  async getAllSpecialties(@Query() dto: GetAllSpecialtiesDto): Promise<{
    message: string;
    total: number;
    specialties: Specialty[];
  }> {
    const { specialties, total } = await this.specialtyService.getAllSpecialties(dto);

    return {
      message: "Specialties retrieved successfully!",
      total,
      specialties
    };
  }

  @Get(":id")
  async getSpecialtyById(@Param("id") id: string): Promise<{ message: string; specialty: Specialty }> {
    const specialty = await this.specialtyService.getSpecialtyById(id);

    return {
      message: "Specialty retrieved successfully!",
      specialty
    };
  }

  @Get("name/:name")
  async getSpecialtyByName(@Param("name") name: string): Promise<{ message: string; specialty: Specialty }> {
    const specialty = await this.specialtyService.getSpecialtyByName(name);

    return {
      message: "Specialty retrieved successfully!",
      specialty
    };
  }
};