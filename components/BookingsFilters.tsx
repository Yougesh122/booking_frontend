"use client";

import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  search: string;
  status: string;
  fromDate: string;
  toDate: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  perPage: number;
  perPageOptions: number[];

  onSearchChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onFromDateChange: (v: string) => void;
  onToDateChange: (v: string) => void;
  onSortByChange: (v: string) => void;
  onSortOrderChange: (v: "asc" | "desc") => void;
  onPerPageChange: (v: number) => void;
};

export default function BookingsFilters({
  search,
  status,
  fromDate,
  toDate,
  sortBy,
  sortOrder,
  perPage,
  perPageOptions,
  onSearchChange,
  onStatusChange,
  onFromDateChange,
  onToDateChange,
  onSortByChange,
  onSortOrderChange,
  onPerPageChange,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-8">
        {/* Search */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">
            Search
          </label>
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Customer name or email"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Status */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">
            Status
          </label>
          <select
            className="w-full rounded-lg border px-3 py-2 text-sm"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* From Date */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">
            From Date
          </label>
          <DatePicker
            selected={fromDate ? dayjs(fromDate).toDate() : null}
            onChange={(date: Date | null) =>
              onFromDateChange(date ? dayjs(date).format("YYYY-MM-DD") : "")
            }
            dateFormat="dd/MM/yyyy"
            placeholderText="DD/MM/YYYY"
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">
            To Date
          </label>
          <DatePicker
            selected={toDate ? dayjs(toDate).toDate() : null}
            onChange={(date: Date | null) =>
              onToDateChange(date ? dayjs(date).format("YYYY-MM-DD") : "")
            }
            dateFormat="dd/MM/yyyy"
            placeholderText="DD/MM/YYYY"
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">
            Sort By
          </label>
          <select
            className="w-full rounded-lg border px-3 py-2 text-sm"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            <option value="booking_date">Booking Date</option>
            <option value="status">Status</option>
            <option value="customer_name">Customer Name</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">
            Order
          </label>
          <select
            className="w-full rounded-lg border px-3 py-2 text-sm"
            value={sortOrder}
            onChange={(e) =>
              onSortOrderChange(e.target.value as "asc" | "desc")
            }
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        {/* Per Page */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">
            Per Page
          </label>
          <select
            className="w-full rounded-lg border px-3 py-2 text-sm"
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
          >
            {perPageOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
