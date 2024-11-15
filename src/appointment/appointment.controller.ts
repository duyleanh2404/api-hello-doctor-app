import {
  Controller, Post, Body, Put,
  Param, Get, Query, Delete, UseGuards
} from "@nestjs/common";

import { Appointment } from "./appointment.schema";
import { Roles } from "src/auth/passport/roles.decorator";
import { AppointmentService } from "./appointment.service";

import { RolesGuard } from "src/auth/passport/roles.guard";
import { JwtAuthGuard } from "src/auth/passport/jwt-auth.guard";

import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { GetAllAppointmentsDto } from "./dto/get-all-appointments.dto";

@Controller("appointment")
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) { }

  @Post("create")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("user")
  async createAppointment(@Body() dto: CreateAppointmentDto): Promise<{
    message: string; appointment: Appointment;
  }> {
    const appointment = await this.appointmentService.createAppointment(dto);
    return { message: "Appointment created successfully!", appointment };
  }

  @Put(":token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("doctor", "user")
  async updateStatusAppointment(@Param("token") token: string) {
    await this.appointmentService.updateStatusAppointment(token);
    return { message: "Appointment status updated successfully" };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("doctor", "user")
  async deleteAppointment(@Param("id") id: string): Promise<{ message: string }> {
    await this.appointmentService.deleteAppointment(id);
    return { message: "Appointment deleted successfully!" };
  }

  @Get("all")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "doctor", "user")
  async getAllAppointments(@Query() dto: GetAllAppointmentsDto) {
    const { appointments, total } = await this.appointmentService.getAllAppointments(dto);
    return { message: "Successfully retrieved appointments", total, appointments };
  }
};