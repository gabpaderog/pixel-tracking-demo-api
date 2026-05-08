import { Request, Response } from "express";
import { trackingService } from "./tracking.service.js";

// 1x1 transparent PNG
const transparentPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "base64");

class TrackingController {
  async createBatch(req: Request, res: Response) {
    try {
      console.log(req.body);
      const { name, subject, recipients } = req.body;

      if (!subject || !recipients?.length) {
        return res.status(400).json({ message: "subject and recipients are required" });
      }

      const batch = await trackingService.createBatch({ name, subject, recipients });

      return res.status(201).json(batch);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /email-tracking/batch
  async getBatches(req: Request, res: Response) {
    try {
      const batches = await trackingService.getBatches();
      return res.json(batches);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /email-tracking/batch/:id
  async getBatchById(req: Request, res: Response) {
    try {
      const batch = await trackingService.getBatchById(req.params.id as string);

      if (!batch) return res.status(404).json({ message: "Batch not found" });

      return res.json(batch);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /email-tracking/batch/:id/stats
  async getBatchStats(req: Request, res: Response) {
    try {
      const stats = await trackingService.getBatchStats(req.params.id as string);

      if (!stats) return res.status(404).json({ message: "Batch not found" });

      return res.json(stats);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /email-tracking/sent/:id
  async getEmailSentById(req: Request, res: Response) {
    try {
      const email = await trackingService.getEmailSentById(req.params.id as string);

      if (!email) return res.status(404).json({ message: "Email not found" });

      return res.json(email);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /email-tracking/open?tid=<trackingId>
  async open(req: Request, res: Response) {
    try {
      const { tid } = req.query;

      if (tid) {
        await trackingService.trackOpen(tid as string, {
          clientIp: req.clientIp,
          headers: req.headers as Record<string, string | string[] | undefined>,
        });
      }

      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      return res.send(transparentPng);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export const trackingController = new TrackingController();
