"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, BookingFormData } from "@/lib/schemas";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateBookingPage() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    try {
      await api.post("/bookings", data);
      toast.success("Booking created successfully");
      router.push("/bookings");
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        const validationErrors = err.response.data.errors;

        Object.keys(validationErrors).forEach((field) => {
          setError(field as keyof BookingFormData, {
            type: "server",
            message: validationErrors[field][0],
          });
        });

        toast.error("Please fix the highlighted errors");
        return;
      }

      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">New Booking</h1>
        <button
          onClick={() => router.back()}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
        >
          ← Back
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl border shadow-sm p-6 space-y-6"
      >
        <div>
          <label className="label">Customer Name</label>
          <input
            {...register("customer_name")}
            placeholder="Customer Name"
            className={input(errors.customer_name)}
          />
          {errors.customer_name && error(errors.customer_name.message)}
        </div>
        <div>
          <label className="label">Email</label>
          <input
            {...register("email")}
            placeholder="Email"
            className={input(errors.email)}
          />
          {errors.email && error(errors.email.message)}
        </div>

        {/* Booking Date */}
        <div>
          <label className="label">Booking Date</label>
          <Controller
            control={control}
            name="booking_date"
            render={({ field }) => (
              <DatePicker
                selected={field.value ? dayjs(field.value).toDate() : null}
                onChange={(date) =>
                  field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : "")
                }
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/YYYY"
                className={input(errors.booking_date)}
              />
            )}
          />
          {errors.booking_date && error(errors.booking_date.message)}
        </div>

        {/* Status */}
        <div>
          <label className="label">Status</label>
          <select {...register("status")} className={input(errors.status)}>
            <option value="">Select status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {errors.status && error(errors.status.message)}
        </div>

        <button
          disabled={isSubmitting}
          className="w-full rounded-lg bg-gray-900 py-3 text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Create Booking"}
        </button>
      </form>
    </div>
  );
}

const input = (error?: any) =>
  `w-full rounded-lg border px-4 py-2 focus:ring-2 ${
    error ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-gray-900"
  }`;

const error = (msg?: string) => <p className="mt-1 text-xs text-red-600">{msg}</p>;
