import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { CreateScheduleDto } from "./dto/create-new-schedule";
import { Schedules } from "./schedule.schema";
import { GetAllSchedulesDto } from "./dto/get-all-schedules.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";

@Controller("schedule")
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) { }

  @Post()
  async create(@Body() createScheduleDto: CreateScheduleDto): Promise<{ message: string; schedule: Schedules }> {
    const newSchedule = await this.scheduleService.createSchedule(createScheduleDto);
    return {
      message: "Schedule created successfully!",
      schedule: newSchedule
    };
  }

  @Put(":id")
  async updateSchedule(
    @Param("id") id: string,
    @Body() updateScheduleDto: UpdateScheduleDto
  ): Promise<{ message: string; schedule: Schedules }> {
    const updatedSchedule = await this.scheduleService.updateSchedule(id, updateScheduleDto);
    return {
      message: "Schedule updated successfully!",
      schedule: updatedSchedule
    };
  }

  @Delete(":id")
  async deleteSchedule(@Param("id") id: string): Promise<{ message: string }> {
    await this.scheduleService.deleteSchedule(id);
    return { message: "Schedule deleted successfully!" };
  }

  @Get()
  async getAllSchedules(@Query() getAllSchedulesDto: GetAllSchedulesDto): Promise<{
    message: string; total: number; schedules: Schedules[]
  }> {
    const { schedules, total } = await this.scheduleService.getAllSchedules(getAllSchedulesDto);
    return {
      message: "Schedules retrieved successfully!",
      total,
      schedules
    };
  }

  @Get(":id")
  async getScheduleById(@Param("id") id: string): Promise<{ message: string; schedule: Schedules }> {
    const schedule = await this.scheduleService.getScheduleById(id);
    return {
      message: "Schedule retrieved successfully!",
      schedule
    };
  }
};