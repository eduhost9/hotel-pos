"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { requireAdmin } from "@/lib/adminGuard";
import PermissionGuard from "@/components/PermissionGuard";

export default function ReportsPage() {
  const router = useRouter();

  const [allowed, setAllowed] =
    useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    const canAccess =
      await requireAdmin();

    if (!canAccess) {
      router.push(
        "/dashboard/pos"
      );
      return;
    }

    setAllowed(true);
  }

  if (!allowed) {
    return (
      <div>
        Checking Access...
      </div>
    );
  }

  const reports = [
    {
      title: "Sales Report",
      description:
        "Daily, weekly and monthly sales",
      link: "/dashboard/reports/sales",
      color: "bg-blue-500",
    },
    {
      title: "Profit Report",
      description:
        "Revenue, expenses and net profit",
      link: "/dashboard/reports/profit",
      color: "bg-green-500",
    },
    {
      title: "Expense Report",
      description:
        "All business expenses",
      link: "/dashboard/reports/expenses",
      color: "bg-red-500",
    },
    {
      title: "Stock Report",
      description:
        "Current stock valuation",
      link: "/dashboard/reports/stock",
      color: "bg-purple-500",
    },
    {
      title: "Payroll Report",
      description:
        "Payroll history and totals",
      link: "/dashboard/reports/payroll",
      color: "bg-yellow-500",
    },
    {
      title: "Cashier Performance",
      description:
        "Sales performance per cashier",
      link: "/dashboard/reports/cashiers",
      color: "bg-pink-500",
    },
    {
      title: "Kitchen Report",
      description:
        "Kitchen order statistics",
      link: "/dashboard/reports/kitchen",
      color: "bg-orange-500",
    },
    {
      title: "Offline Sync Report",
      description:
        "Offline queue and sync activity",
      link: "/dashboard/reports/offline",
      color: "bg-gray-500",
    },
  ];

  return (
    <PermissionGuard permission="reports">
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Reports Center
      </h1>

      <div className="grid grid-cols-4 gap-4">

        {reports.map((report) => (

          <Link
            key={report.link}
            href={report.link}
          >

            <div
              className={`${report.color} text-white p-6 rounded-lg cursor-pointer hover:opacity-90`}
            >

              <h2 className="text-xl font-bold">
                {report.title}
              </h2>

              <p className="mt-2 text-sm">
                {report.description}
              </p>

            </div>

          </Link>

        ))}

      </div>

    </div>
    </PermissionGuard>
  );
}