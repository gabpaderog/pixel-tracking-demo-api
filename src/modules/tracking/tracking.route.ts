import { Router } from "express";

import trackingController from "./tracking.controller.js";

const router = Router();

router.get("/pixel", trackingController.open.bind(trackingController));
router.get("/logs", trackingController.logs.bind(trackingController));
router.get("/send-mail", trackingController.sendMail.bind(trackingController));

export default router;