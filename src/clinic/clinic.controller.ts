import {
  Put,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  UseGuards,
  Controller,
  UploadedFiles,
  UseInterceptors,
  BadRequestException
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";

import { Clinic } from "./clinic.schema";
import { ClinicService } from "./clinic.service";
import { Roles } from "src/auth/passport/roles.decorator";
import { UpdateClinicDto } from "./dto/update-clinic.dto";
import { RolesGuard } from "src/auth/passport/roles.guard";
import { GetAllClinicsDto } from "./dto/get-all-clinics.dto";
import { CreateNewClinicDto } from "./dto/create-new-clinic.dto";
import { JwtAuthGuard } from "src/auth/passport/jwt-auth.guard";

@Controller("clinic")
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) { }

  @Post("create")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @UseInterceptors(FilesInterceptor("files"))
  async createClinic(
    @Body() createNewClinicDto: CreateNewClinicDto,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<{ message: string; clinic: Clinic }> {
    if (files.length < 2) {
      throw new BadRequestException("Both avatar and banner files are required!");
    }

    const [avatar, banner] = files;
    const clinic = await this.clinicService.create(createNewClinicDto, avatar, banner);

    return {
      message: "Clinic created successfully!",
      clinic
    };
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @UseInterceptors(FilesInterceptor("files", 2))
  async updateClinic(
    @Param("id") id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateClinicDto: UpdateClinicDto
  ): Promise<{ message: string; clinic: Clinic }> {
    const avatar = files[0];
    const banner = files[1];

    const updatedClinic = await this.clinicService.updateClinic(id, updateClinicDto, avatar, banner);

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "user")
  async getAllClinics(@Query() getAllClinicsDto: GetAllClinicsDto): Promise<{
    message: string; total: number; clinics: Clinic[]
  }> {
    const { clinics, total } = await this.clinicService.getAllClinics(getAllClinicsDto);
    return {
      message: "Clinics retrieved successfully!",
      total,
      clinics
    };
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "user")
  async getClinicById(@Param("id") id: string): Promise<{ message: string; clinic: Clinic }> {
    const clinic = await this.clinicService.getClinicById(id);
    return {
      message: "Clinic retrieved successfully!",
      clinic
    };
  }
};