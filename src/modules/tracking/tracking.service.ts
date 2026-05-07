import { mailTransporter } from "../../config/nodemailer.js";
import trackingRepository from "./tracking.repository.js";
import { CreateTrackingPayload } from "./tracking.type.js";

class TrackingService {
  async getLogs() {
    return trackingRepository.findAll();
  }

  async track(payload: CreateTrackingPayload) {
    return trackingRepository.create(payload);
  }

  async sendMail() {
    const email = await mailTransporter.sendMail({
      from: process.env.MAIL_USER,
      to: "paderogjohn28@gmail.com",
      subject: "Test email",
      html: `<p>This is a test email.</p><img src="http://localhost:3000/tracking/open" alt="tracking pixel" />`,
    });

    console.log("Email sent");
    return email;
  }
}

export default new TrackingService();
