"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, BookingFormData } from "@/lib/schemas";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";

export default function EditBookingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customer_name: "",
      email: "",
      booking_date: "",
      status: "pending",
    },
  });

  useEffect(() => {
    api.get(`/bookings/${id}`).then((res) => {
      const data = res.data.data;
      reset({
        customer_name: data.customer_name ?? "",
        email: data.email ?? "",
        booking_date: data.booking_date ?? "",
        status: data.status ?? "pending",
      });
      setLoading(false);
    });
  }, [id, reset]);

  const onSubmit = async (data: BookingFormData) => {
    await api.put(`/bookings/${id}`, data);
    toast.success("Booking updated");
    router.push("/bookings");
  };

  if (loading) {
    return <p className="text-gray-500">Loading booking...</p>;
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Edit Booking</h1>
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
        {/* Customer Name */}
        <div>
          <label className="label">Customer Name</label>
          <input
            {...register("customer_name")}
            placeholder="Customer Name"
            className={input(errors.customer_name)}
          />
          {errors.customer_name && error(errors.customer_name.message)}
        </div>

        {/* Email */}
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
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {errors.status && error(errors.status.message)}
        </div>

        <button
          disabled={isSubmitting}
          className="w-full rounded-lg bg-gray-900 py-3 text-white hover:bg-gray-800"
        >
          {isSubmitting ? "Saving..." : "Update Booking"}
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
