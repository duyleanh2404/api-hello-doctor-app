import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, NotFoundException } from "@nestjs/common";

import { CreateHistoryDto } from "./dto/create-history.dto";
import { convertImageToBase64 } from "utils/convert-to-base64";

import { History } from "./history.schema";
import { User } from "src/user/user.schema";
import { Appointment } from "src/appointment/appointment.schema";

@Injectable()
export class HistoryService {
  constructor(
    private mailerService: MailerService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(History.name) private readonly historyModel: Model<History>,
    @InjectModel(Appointment.name) private readonly appointmentModel: Model<Appointment>
  ) { }

  private mapHealthStatus(status: string): string {
    const statusMap: Record<string, string> = {
      bad: "Xấu", normal: "Bình Thường", good: "Tốt"
    };
    return statusMap[status] || "Bình Thường";
  }

  async createHistory(dto: CreateHistoryDto, prescriptionImage: Express.Multer.File): Promise<History> {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new NotFoundException("User not found!");
    }

    const newHistory = new this.historyModel({
      ...dto, prescriptionImage: convertImageToBase64(prescriptionImage)
    });

    await this.appointmentModel.findByIdAndUpdate(dto.appointment_id, { isFinished: true });

    await this.mailerService.sendMail({
      from: "Hello Bacsi <hellodoctor.app.healthcare@gmail.com>",
      to: dto.email,
      subject: "Kết quả khám bệnh",
      template: "./examination-results",
      context: {
        patientsName: user.fullname,
        doctorComment: dto.doctorComment,
        healthStatus: this.mapHealthStatus(dto.healthStatus)
      },
      attachments: [
        {
          filename: "tinh_trang_benh.jpeg",
          path: newHistory.prescriptionImage,
          cid: "prescriptionImage"
        }
      ]
    });

    return await newHistory.save();
  }
};