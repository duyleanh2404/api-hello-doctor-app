import {
  Put, Get, Post, Body, Param, Query, Delete,
  UseGuards, Controller, UploadedFiles, UseInterceptors
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";

import { Clinic } from "./clinic.schema";
import { ClinicService } from "./clinic.service";
import { Roles } from "src/auth/passport/roles.decorator";

import { RolesGuard } from "src/auth/passport/roles.guard";
import { JwtAuthGuard } from "src/auth/passport/jwt-auth.guard";

import { EditClinicDto } from "./dto/edit-clinic.dto";
import { CreateClinicDto } from "./dto/create-clinic.dto";
import { GetAllClinicsDto } from "./dto/get-all-clinics.dto";

@Controller("clinic")
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) { }

  @Post("create")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @UseInterceptors(FilesInterceptor("files"))
  async createClinic(
    @Body() dto: CreateClinicDto, @UploadedFiles() files: Express.Multer.File[]
  ): Promise<{ message: string; clinic: Clinic }> {
    const [avatar, banner] = files;
    const clinic = await this.clinicService.createClinic(dto, avatar, banner);

    return {
      message: "Clinic created successfully!",
      clinic
    };
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @UseInterceptors(FilesInterceptor("files"))
  async editClinic(
    @Param("id") id: string, @Body() dto: EditClinicDto, @UploadedFiles() files: Express.Multer.File[]
  ): Promise<{ message: string; clinic: Clinic }> {
    const [avatar, banner] = files;
    const updatedClinic = await this.clinicService.editClinic(id, dto, avatar, banner);

    return {
      message: "Clinic updated successfully!",
      clinic: updatedClinic
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  async deleteClinic(@Param("id") id: string): Promise<{ message: string }> {
    await this.clinicService.deleteClinic(id);
    return { message: "Clinic deleted successfully!" };
  }

  @Get()
  async getAllClinics(@Query() dto: GetAllClinicsDto): Promise<{
    message: string; total: number; clinics: Clinic[]
  }> {
    const { clinics, total } = await this.clinicService.getAllClinics(dto);

    return {
      message: "Clinics retrieved successfully!",
      total,
      clinics
    };
  }

  @Get(":id")
  async getClinicById(@Param("id") id: string): Promise<{ message: string; clinic: Clinic }> {
    const clinic = await this.clinicService.getClinicById(id);

    return {
      message: "Clinic retrieved successfully!",
      clinic
    };
  }
};