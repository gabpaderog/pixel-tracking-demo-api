import { Router } from "express";
import { trackingController } from "./tracking.controller.js";

const router = Router();

router.get("/open", (req, res) => trackingController.open(req, res));

router.post("/batch", trackingController.createBatch.bind(trackingController));
router.get("/batch", (req, res) => trackingController.getBatches(req, res));
router.get("/batch/:id", (req, res) => trackingController.getBatchById(req, res));
router.get("/batch/:id/stats", (req, res) => trackingController.getBatchStats(req, res));

router.get("/sent/:id", (req, res) => trackingController.getEmailSentById(req, res));

export default router;