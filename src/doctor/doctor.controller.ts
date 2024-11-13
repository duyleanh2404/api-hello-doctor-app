import {
  Get, Put, Post, Body, Query, Param, Delete,
  UseGuards, Controller, UploadedFile, UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { Doctor } from "./doctor.schema";
import { DoctorService } from "./doctor.service";
import { Roles } from "src/auth/passport/roles.decorator";

import { RolesGuard } from "src/auth/passport/roles.guard";
import { JwtAuthGuard } from "src/auth/passport/jwt-auth.guard";

import { EditDoctorDto } from "./dto/edit-doctor.dto";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
import { GetAllDoctorsDto } from "./dto/get-all-doctors.dto";

@Controller("doctor")
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) { }

  @Post("create")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @UseInterceptors(FileInterceptor("image"))
  async createDoctor(
    @Body() dto: CreateDoctorDto, @UploadedFile() image: Express.Multer.File
  ): Promise<{ message: string; doctor: Doctor }> {
    const doctor = await this.doctorService.createDoctor(dto, image);

    return {
      message: "Doctor created successfully!",
      doctor
    };
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @UseInterceptors(FileInterceptor("image"))
  async editDoctor(
    @Param("id") id: string, @Body() dto: EditDoctorDto, @UploadedFile() image: Express.Multer.File
  ): Promise<{ message: string; doctor: Doctor }> {
    const doctor = await this.doctorService.editDoctor(id, dto, image);

    return {
      message: "Doctor updated successfully!",
      doctor
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  async deleteDoctor(@Param("id") id: string): Promise<{ message: string }> {
    await this.doctorService.deleteDoctor(id);
    return { message: "Doctor deleted successfully!" };
  }

  @Get()
  async getAllDoctors(@Query() dto: GetAllDoctorsDto): Promise<{
    message: string; total: number; doctors: Doctor[];
  }> {
    const { doctors, total } = await this.doctorService.getAllDoctors(dto);

    return {
      message: "Doctors retrieved successfully!",
      total,
      doctors
    };
  }

  @Get(":id")
  async getDoctorById(@Param("id") id: string): Promise<{ message: string; doctor: Doctor }> {
    const doctor = await this.doctorService.getDoctorById(id);

    return {
      message: "Doctor retrieved successfully!",
      doctor
    };
  }
};