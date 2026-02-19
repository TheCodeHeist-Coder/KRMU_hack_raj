import { Router } from "express";
import twilio from "twilio";
const router = Router();

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

router.post("/send-sos", async (req, res) => {
  const { lat, lng, phone_number } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Location missing" });
  }

  try {
    const message = await client.messages.create({
      body: `🚨 EMERGENCY ALERT 🚨
My Live Location:
https://www.google.com/maps?q=${lat},${lng}`,
      from: process.env.TWILIO_PHONE,
      to: phone_number,
    });

    console.log("Message SID:", message.sid);
    console.log("Status:", message.status);

    res.json({ success: true, status: message.status });
  } catch (error) {
    console.error(error);
    //@ts-ignore
    res.status(500).json({ error: error?.message });
  }
});

export default router;