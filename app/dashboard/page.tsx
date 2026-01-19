"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    api.get("/get-bookings-status").then(res => setStats(res.data.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  const colors = [
    { bg: "#E0E7FF", text: "#3730A3" },
    { bg: "#FFEDD5", text: "#C2410C" },
    { bg: "#CCFBF1", text: "#115E59" }, 
    { bg: "#FBCFE8", text: "#9D174D" }, 
  ];

  const statusKeys = Object.keys(stats);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statusKeys.map((key, index) => {
        const value = stats[key];
        const color = colors[index % colors.length]; // loop colors if more statuses

        return (
          <div
            key={key}
            className="p-6 rounded shadow"
            style={{ backgroundColor: color.bg, color: color.text }}
          >
            <h3 className="capitalize text-sm">{key}</h3>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        );
      })}
    </div>
  );
}
