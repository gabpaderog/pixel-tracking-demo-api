import prisma from "@/config/prisma.js";

import { CreateTrackingPayload } from "./tracking.type.js";

class TrackingRepository {
  async create(payload: CreateTrackingPayload) {
    return prisma.emailOpen.create({
      data: payload,
    });
  }

  async findAll() {
    return prisma.emailOpen.findMany({
        orderBy: {
            openedAt: "desc",
        }
    });
  }
}

export default new TrackingRepository();
