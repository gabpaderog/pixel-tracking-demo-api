import type { Request, Response } from "express";

import trackingService from "./tracking.service.js";
import { transparentPng } from "../../utils/pixel.util.js";

class TrackingController {
  async logs(req: Request, res: Response) {
    try {
      const logs = await trackingService.getLogs();

      return res.json(logs);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
  async open(req: Request, res: Response) {
    try {
      const ipAddress = 
        req.headers['cf-connecting-ip'] ||
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        '';

      console.log(ipAddress)

      res.setHeader("Content-Type", "image/png");

      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

      return res.send(transparentPng);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
  async sendMail(req: Request, res: Response) {
    try {
      const email = await trackingService.sendMail();
      return res.json({ message: "Email sent successfully", email });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}

export default new TrackingController();
