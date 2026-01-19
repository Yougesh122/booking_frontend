import * as z from "zod";

export const bookingSchema = z.object({
  customer_name: z.string().min(3),
  email: z.string().email(),
  booking_date: z.string(),
  status: z.enum(["pending", "confirmed", "cancelled"])
});

export type BookingFormData = z.infer<typeof bookingSchema>;
