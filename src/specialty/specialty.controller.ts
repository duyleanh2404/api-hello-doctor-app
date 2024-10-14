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
  UploadedFile,
  UseInterceptors,
  BadRequestException
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { Specialty } from "./specialty.schema";
import { SpecialtyService } from "./specialty.service";
import { Roles } from "src/auth/passport/roles.decorator";
import { RolesGuard } from "src/auth/passport/roles.guard";
import { JwtAuthGuard } from "src/auth/passport/jwt-auth.guard";
import { UpdateSpecialtyDto } from "./dto/update-specialty.dto";
import { GetAllSpecialtiesDto } from "./dto/get-all-specialties.dto";
import { CreateNewSpecialtyDto } from "./dto/create-new-specialty.dto";

@Controller("specialty")
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) { }

  @Post("create")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @UseInterceptors(FileInterceptor("image"))
  async createSpecialty(
    @Body() createNewSpecialtyDto: CreateNewSpecialtyDto,
    @UploadedFile() image: Express.Multer.File
  ): Promise<{ message: string; specialty: Specialty }> {
    if (!image) {
      throw new BadRequestException("Image file is required!");
    }

    const specialty = await this.specialtyService.create(createNewSpecialtyDto, image);
    return {
      message: "Specialty created successfully!",
      specialty
    };
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @UseInterceptors(FileInterceptor("image"))
  async updateSpecialty(
    @Param("id") id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateSpecialtyDto: UpdateSpecialtyDto
  ): Promise<{ message: string; specialty: Specialty }> {
    if (!image) {
      throw new BadRequestException("Image file is required!");
    }

    const updatedSpecialty = await this.specialtyService.updateSpecialty(id, updateSpecialtyDto, image);
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "user")
  async getAllSpecialties(@Query() getAllSpecialtiesDto: GetAllSpecialtiesDto): Promise<{
    message: string; total: number; specialties: Specialty[]
  }> {
    const { specialties, total } = await this.specialtyService.getAllSpecialties(getAllSpecialtiesDto);
    return {
      message: "Specialties retrieved successfully!",
      total,
      specialties
    };
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "user")
  async getSpecialtyById(@Param("id") id: string): Promise<{ message: string; specialty: Specialty }> {
    const specialty = await this.specialtyService.getSpecialtyById(id);
    return {
      message: "Specialty retrieved successfully!",
      specialty
    };
  }
};