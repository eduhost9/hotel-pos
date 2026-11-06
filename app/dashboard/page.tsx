"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getCurrentRole } from "@/lib/auth";
import HeroCarousel from "@/components/HeroCarousel";

export default function DashboardPage() {
  const [role, setRole] = useState("");

  const [revenue, setRevenue] = useState(0);
  const [transactions, setTransactions] =
    useState(0);

  const [averageSale, setAverageSale] =
    useState(0);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    const userRole =
      await getCurrentRole();

    setRole(userRole || "");

    if (userRole === "admin") {
      loadAdminStats();
    }
  }

  async function loadAdminStats() {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const { data } = await supabase
      .from("sales")
      .select("*")
      .gte(
        "created_at",
        today.toISOString()
      );

    if (!data) return;

    const totalRevenue =
      data.reduce(
        (sum, sale) =>
          sum + Number(sale.total),
        0
      );

    const totalTransactions =
      data.length;

    const avgSale =
      totalTransactions > 0
        ? totalRevenue /
          totalTransactions
        : 0;

    setRevenue(totalRevenue);

    setTransactions(
      totalTransactions
    );

    setAverageSale(
      Math.round(avgSale)
    );
  }

  if (role === "cashier") {

    return (
      <div>

        <h1 className="text-3xl font-bold">
          Cashier Dashboard
        </h1>

        <p className="mt-3">
          Use POS and My Sales
          from the sidebar.
        </p>

      </div>
    );
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl border">

          <h2 className="text-gray-500">
            Today's Revenue
          </h2>

          <div className="text-4xl font-bold">
            KES {revenue}
          </div>

        </div>

        <div className="bg-white p-6 rounded-xl border">

          <h2 className="text-gray-500">
            Transactions
          </h2>

          <div className="text-4xl font-bold">
            {transactions}
          </div>

        </div>

        <div className="bg-white p-6 rounded-xl border">

          <h2 className="text-gray-500">
            Average Sale
          </h2>

          <div className="text-4xl font-bold">
            KES {averageSale}
          </div>

        </div>

      </div>

    </div>
  );
}