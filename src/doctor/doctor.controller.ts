import {
  Get,
  Put,
  Post,
  Body,
  Query,
  Param,
  Delete,
  Controller,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { Doctor } from "./doctor.schema";
import { DoctorService } from "./doctor.service";

import { UpdateDoctorDto } from "./dto/update-doctor.dto";
import { GetAllDoctorsDto } from "./dto/get-all-doctors.dto";
import { CreateNewDoctorDto } from "./dto/create-new-doctor.dto";

@Controller("doctor")
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) { }

  @Post("create")
  @UseInterceptors(FileInterceptor("image"))
  async createNewDoctor(
    @Body() createNewDoctorDto: CreateNewDoctorDto,
    @UploadedFile() image: Express.Multer.File
  ): Promise<{ message: string; doctor: Doctor }> {
    if (!image) {
      throw new BadRequestException("Image file is required!");
    }

    const doctor = await this.doctorService.createNewDoctor(createNewDoctorDto, image);
    return {
      message: "Doctor created successfully!",
      doctor
    };
  }

  @Put(":id")
  @UseInterceptors(FileInterceptor("image"))
  async updateDoctor(
    @Param("id") id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<{ message: string; doctor: Doctor }> {
    const updatedDoctor = await this.doctorService.updateDoctor(id, updateDoctorDto, image);
    return {
      message: "Doctor updated successfully!",
      doctor: updatedDoctor
    };
  }

  @Delete(":id")
  async deleteDoctor(@Param("id") id: string): Promise<{ message: string }> {
    await this.doctorService.deleteDoctor(id);
    return { message: "Doctor deleted successfully!" };
  }

  @Get()
  async getAllDoctors(@Query() getAllDoctorsDto: GetAllDoctorsDto): Promise<{
    message: string; total: number; doctors: Doctor[]
  }> {
    const { doctors, total } = await this.doctorService.getAllDoctors(getAllDoctorsDto);
    return {
      message: "Doctor retrieved successfully!",
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