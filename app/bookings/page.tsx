"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { api } from "@/lib/api";
import Pagination from "@/components/Pagination";
import BookingsFilters from "@/components/BookingsFilters";

export default function BookingsPage() {

  const [bookings, setBookings] = useState<any[]>([]);

  const [meta, setMeta] = useState<any>(null);

  const [page, setPage] = useState(1);

  const [perPage, setPerPage] = useState(10);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [sortBy, setSortBy] = useState("booking_date");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [loading, setLoading] = useState(false);
  
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const perPageOptions = [10, 20, 30, 50];

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/bookings", {
        params: {
          page,
          per_page: perPage,
          search,
          status,
          from_date: fromDate,
          to_date: toDate,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
      });

      setBookings(res.data.data);
      setMeta(res.data.meta);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, perPage, search, status, fromDate, toDate, sortBy, sortOrder]);

  const handleCancel = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setDeletingId(id);
    try {
      const res = await api.delete(`/bookings/${id}`);
      toast.success(res.data.message || "Booking cancelled");
      fetchBookings();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to cancel booking");
    } finally {
      setDeletingId(null);
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Bookings Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View, filter and manage customer bookings
          </p>
        </div>

        <Link
          href="/bookings/create"
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Create Booking
        </Link>
      </div>

      {/* Filters */}
      <BookingsFilters
        search={search}
        status={status}
        fromDate={fromDate}
        toDate={toDate}
        sortBy={sortBy}
        sortOrder={sortOrder}
        perPage={perPage}
        perPageOptions={perPageOptions}
        onSearchChange={v => {
          setPage(1);
          setSearch(v);
        }}
        onStatusChange={v => {
          setPage(1);
          setStatus(v);
        }}
        onFromDateChange={v => {
          setPage(1);
          setFromDate(v);
        }}
        onToDateChange={v => {
          setPage(1);
          setToDate(v);
        }}
        onSortByChange={v => {
          setPage(1);
          setSortBy(v);
        }}
        onSortOrderChange={v => {
          setPage(1);
          setSortOrder(v);
        }}
        onPerPageChange={v => {
          setPage(1);
          setPerPage(v);
        }}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-600">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="hidden px-6 py-4 md:table-cell">Email</th>
              <th className="px-6 py-4">Status</th>
              <th className="hidden px-6 py-4 sm:table-cell">
                Booking Date
              </th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  Loading bookings...
                </td>
              </tr>
            )}

            {!loading && bookings.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            )}

            {!loading &&
              bookings.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">
                    {booking.customer_name}
                  </td>

                  <td className="hidden px-6 py-4 md:table-cell">
                    {booking.email}
                  </td>

                  <td className="px-6 py-4">
                    {statusBadge(booking.status)}
                  </td>

                  <td className="hidden px-6 py-4 sm:table-cell">
                    {new Date(booking.booking_date).toLocaleDateString("en-GB")}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <Link
                        href={`/bookings/${booking.id}/edit`}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700"
                      >
                        Edit
                      </Link>

                      {booking.status !== "cancelled" && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={deletingId === booking.id}
                          className="rounded-md bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {deletingId === booking.id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {meta?.last_page > 1 && (
          <div className="flex justify-end border-t px-6 py-4">
            <Pagination
              current={meta.current_page}
              total={meta.last_page}
              onChange={setPage}
            />
          </div>
        )}
      </div>
    </section>
  );
}
