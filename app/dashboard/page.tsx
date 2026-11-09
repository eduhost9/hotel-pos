"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getCurrentRole } from "@/lib/auth";


export default function DashboardPage() {
  const [role, setRole] = useState("");

  const [revenue, setRevenue] = useState(0);
  const [transactions, setTransactions] =
    useState(0);

  const [averageSale, setAverageSale] =
    useState(0);

    const [greeting, setGreeting] =
  useState("");

const [todayDate, setTodayDate] =
  useState("");

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    const userRole =
      await getCurrentRole();

    setRole(userRole || "");

    const hour =
  new Date().getHours();

if (hour < 12) {
  setGreeting("Good Morning");
} else if (hour < 17) {
  setGreeting("Good Afternoon");
} else {
  setGreeting("Good Evening");
}

setTodayDate(
  new Date().toLocaleDateString(
    "en-KE",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  )
);

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
  <div className="space-y-6">

    {/* HERO */}

    <div className="bg-gradient-to-r from-green-700 to-green-900 rounded-3xl p-6 text-white">

      <div className="flex flex-col md:flex-row md:justify-between">

        <div>

          <h1 className="text-3xl md:text-5xl font-bold">
            🏨 CHOMA ZONE HOTEL
          </h1>

          <p className="mt-2 text-green-100">
            {greeting}
          </p>

          <p className="text-green-200">
            {todayDate}
          </p>

        </div>

        <div className="mt-4 md:mt-0">

          <div className="bg-white/10 rounded-xl p-4">

            <div className="text-sm">
              Today's Revenue
            </div>

            <div className="text-3xl font-bold">
              KES {revenue.toLocaleString()}
            </div>

          </div>

        </div>

      </div>

    </div>

    {/* QUICK ACTIONS */}

    <div>

      <h2 className="text-xl font-bold mb-3">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

        <a
          href="/dashboard/pos"
          className="bg-blue-600 text-white p-4 rounded-xl text-center font-semibold"
        >
          💰 POS
        </a>

        <a
          href="/dashboard/stock"
          className="bg-orange-500 text-white p-4 rounded-xl text-center font-semibold"
        >
          📦 Stock
        </a>

        <a
          href="/dashboard/sales"
          className="bg-green-600 text-white p-4 rounded-xl text-center font-semibold"
        >
          🧾 Sales
        </a>

        <a
          href="/dashboard/kitchen"
          className="bg-purple-600 text-white p-4 rounded-xl text-center font-semibold"
        >
          👨‍🍳 Kitchen
        </a>

        <a
          href="/dashboard/users"
          className="bg-slate-700 text-white p-4 rounded-xl text-center font-semibold"
        >
          👥 Users
        </a>

      </div>

    </div>

    {/* STATS */}

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">

        <p className="text-gray-500">
          Today's Revenue
        </p>

        <p className="text-4xl font-bold mt-2 text-green-700">
          KES {revenue.toLocaleString()}
        </p>

      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">

        <p className="text-gray-500">
          Transactions Today
        </p>

        <p className="text-4xl font-bold mt-2 text-blue-700">
          {transactions}
        </p>

      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-600">

        <p className="text-gray-500">
          Average Sale
        </p>

        <p className="text-4xl font-bold mt-2 text-orange-700">
          KES {averageSale.toLocaleString()}
        </p>

      </div>

    </div>

    {/* WELCOME CARD */}

    <div className="bg-white rounded-2xl p-6 shadow-lg">

      <h2 className="text-2xl font-bold mb-3">
        Hotel Daily Operations Overview
      </h2>

      <p className="text-gray-600">
        Welcome to CHOMA ZONE HOTEL management system.
        Monitor revenue, stock, sales, kitchen orders,
        payroll and hotel operations from one place.
      </p>

    </div>

  </div>
);
  
}