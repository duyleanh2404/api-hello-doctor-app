import {
  Get, Put, Post, Body, Query,
  Param, Delete, UseGuards, Controller
} from "@nestjs/common";

import { Schedule } from "./schedule.schema";
import { ScheduleService } from "./schedule.service";
import { Roles } from "src/auth/passport/roles.decorator";

import { RolesGuard } from "src/auth/passport/roles.guard";
import { JwtAuthGuard } from "src/auth/passport/jwt-auth.guard";

import { GetScheduleDto } from "./dto/get-schedule.dto";
import { EditScheduleDto } from "./dto/edit-schedule.dto";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { GetAllSchedulesDto } from "./dto/get-all-schedules.dto";
import { GetScheduleRangeDto } from "./dto/get-schedule-range.dto";

@Controller("schedule")
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor")
  async createSchedule(@Body() dto: CreateScheduleDto): Promise<{
    message: string; schedule: Schedule
  }> {
    const schedule = await this.scheduleService.createSchedule(dto);

    return {
      message: "Schedule created successfully!",
      schedule
    };
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor")
  async editSchedule(@Param("id") id: string, @Body() dto: EditScheduleDto): Promise<{
    message: string; schedule: Schedule
  }> {
    const schedule = await this.scheduleService.editSchedule(id, dto);

    return {
      message: "Schedule edited successfully!",
      schedule
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor")
  async delete(@Param("id") id: string): Promise<{ message: string }> {
    await this.scheduleService.deleteSchedule(id);
    return { message: "Schedule deleted successfully!" };
  }

  @Get("all")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor", "user")
  async getAllSchedules(@Query() dto: GetAllSchedulesDto): Promise<{
    message: string; total: number; schedules: Schedule[]
  }> {
    const { schedules, total } = await this.scheduleService.getAllSchedules(dto);

    return {
      message: "Schedules retrieved successfully!",
      total,
      schedules
    };
  }

  @Get("range")
  async getSchedulesByRange(@Query() dto: GetScheduleRangeDto) {
    const schedules = await this.scheduleService.getSchedulesByRange(dto);

    return {
      message: "Schedules retrieved successfully!",
      schedules
    };
  }

  @Get()
  async getSchedule(@Query() dto: GetScheduleDto): Promise<{
    message: string; schedule: Schedule
  }> {
    const schedule = await this.scheduleService.getSchedule(dto);

    return {
      message: "Schedule retrieved successfully!",
      schedule
    };
  }
};