import geoip from "geoip-lite";
import { BatchStatsResult, CreateBatchDto } from "./tracking.type.js";
import prisma from "../../config/prisma.js";
import { UAParser } from "ua-parser-js";
import { sendEmail } from "./tracking.mailer.js";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

class TrackingService {
  async createBatch(dto: CreateBatchDto) {
    const batch = await prisma.emailBatch.create({
      data: {
        name: dto.name,
        emails: {
          create: dto.recipients.map((recipient) => ({
            recipient,
            subject: dto.subject,
          })),
        },
      },
      include: { emails: true },
    });

    // 2. Send emails with tracking pixel embedded
    const results = await Promise.allSettled(
      batch.emails.map((emailSent) => {
        const trackingPixelUrl = `${BASE_URL}/tracking/open?tid=${emailSent.trackingId}`;

        const html = `
        <!doctype html>
        <html>
          <body style="margin:0; padding:0; background:#f6f7fb; font-family:Arial, sans-serif;">

            <!-- Container -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fb; padding:40px 0;">
              <tr>
                <td align="center">

                  <!-- Card -->
                  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; overflow:hidden;">

                    <!-- Header -->
                    <tr>
                      <td style="background:#121838; padding:20px; text-align:center; color:#fff;">
                        <h2 style="margin:0;">${dto.subject}</h2>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="padding:30px; color:#111827;">

                        <h1 style="font-size:20px; margin-bottom:10px;">
                          Hi There! 
                        </h1>

                        <p style="font-size:14px; line-height:1.6; color:#4b5563;">
                          This is a test email sent from our system. This template is designed to look clean and readable across all email clients.
                        </p>

                        <p style="font-size:12px; color:#9ca3af;">
                          If you did not request this email, you can safely ignore it.
                        </p>

                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding:20px; text-align:center; font-size:12px; color:#9ca3af; background:#f9fafb;">
                        © 2026 Your Company. All rights reserved.
                      </td>
                    </tr>

                  </table>

                  <!-- Tracking Pixel -->
                  <img src="${trackingPixelUrl}" width="1" height="1" style="display:none;" />

                </td>
              </tr>
            </table>

          </body>
        </html>
        `;

        return sendEmail({
          to: emailSent.recipient,
          subject: dto.subject,
          html,
        });
      }),
    );

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`Failed to send to ${batch.emails[index].recipient}:`, result.reason);
      }
    });

    return batch;
  }

  async getBatches() {
    const batches = await prisma.emailBatch.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { emails: true } },
      },
    });

    return batches;
  }

  async getBatchById(id: string) {
    const batch = await prisma.emailBatch.findUnique({
      where: { id },
      include: {
        emails: {
          include: {
            opens: true,
          },
        },
      },
    });

    return batch;
  }

  async getBatchStats(id: string): Promise<BatchStatsResult | null> {
    const batch = await this.getBatchById(id);
    if (!batch) return null;

    const totalSent = batch.emails.length;
    const totalOpens = batch.emails.reduce((acc, e) => acc + e.opens.length, 0);
    const uniqueOpens = batch.emails.filter((e) => e.opens.length > 0).length;

    return {
      id: batch.id,
      name: batch.name,
      totalSent,
      totalOpens,
      uniqueOpens,
    };
  }


  async trackOpen(trackingId: string, req: { clientIp?: string; publicIp?: string; headers: Record<string, string | string[] | undefined> }) {
    const emailSent = await prisma.emailSent.findUnique({
      where: { trackingId },
    });

    if (!emailSent) return null;

    const ua = new UAParser(req.headers["user-agent"] as string).getResult();
    const geo = req.clientIp ? geoip.lookup(req.clientIp) : null;

    const open = await prisma.emailOpen.create({
      data: {
        emailSentId: emailSent.id,
        clientIp: req.clientIp ?? null,
        country: geo?.country ?? null,
        city: geo?.city ?? null,
        browser: ua.browser.name ?? null,
        browserVersion: ua.browser.version ?? null,
        os: ua.os.name ?? null,
        osVersion: ua.os.version ?? null,
        device: ua.device.type ?? "desktop",
        userAgent: req.headers["user-agent"] as string,
      },
    });

    return open;
  }

  async getEmailSentById(id: string) {
    return prisma.emailSent.findUnique({
      where: { id },
      include: { opens: true, batch: true },
    });
  }
}

export const trackingService = new TrackingService();
