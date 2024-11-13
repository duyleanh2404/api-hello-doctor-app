import {
  Post,
  Body,
  UseGuards,
  Controller,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { HistoryService } from "./history.service";
import { Roles } from "src/auth/passport/roles.decorator";
import { CreateHistoryDto } from "./dto/create-history.dto";

import { RolesGuard } from "src/auth/passport/roles.guard";
import { JwtAuthGuard } from "src/auth/passport/jwt-auth.guard";

@Controller("history")
export class HistoryController {
  constructor(private readonly historyService: HistoryService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("doctor")
  @UseInterceptors(FileInterceptor("prescriptionImage"))
  async createHistory(
    @Body() dto: CreateHistoryDto, @UploadedFile() prescriptionImage: Express.Multer.File
  ): Promise<{ message: string }> {
    await this.historyService.createHistory(dto, prescriptionImage);
    return { message: "History has been added successfully!" };
  }
};