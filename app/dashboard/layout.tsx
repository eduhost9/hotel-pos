"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentRole } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
const [role, setRole] = useState("");

  useEffect(() => {
  checkUser();
}, []);

async function checkUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    router.push("/login");
    return;
  }

  const userRole = await getCurrentRole();

  setRole(userRole || "");

  setLoading(false);
}

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

if (loading) {
  return (
    <div className="p-10">
      Loading...
    </div>
  );
}

  return (
  <div className="min-h-screen bg-slate-100">

    <div className="flex">

      {/* SIDEBAR */}

      <aside className="w-72 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl">

        <div className="p-6 border-b border-slate-700">

          <h1 className="text-3xl font-bold">
            🏨 CHOMA ZONE
          </h1>

          <p className="text-slate-300 mt-2">
            Hotel Management System
          </p>

        </div>

        <div className="p-4">

          <div className="mb-4 px-3 py-2 bg-slate-700 rounded-lg">

            <p className="text-sm text-slate-300">
              Logged In As
            </p>

            <p className="font-semibold capitalize">
              {role}
            </p>

          </div>

          <nav className="space-y-1">

            {role === "admin" && (
              <>
                <a href="/dashboard" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  📊 Dashboard
                </a>

                <a href="/dashboard/pos" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  💰 POS
                </a>

                <a href="/dashboard/menu" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  🍽️ Menu
                </a>

                <a href="/dashboard/categories" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  🏷️ Categories
                </a>

                <a href="/dashboard/kitchen" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  👨‍🍳 Kitchen
                </a>

                <a href="/dashboard/stock" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  📦 Stock
                </a>

                <a href="/dashboard/sales" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  🧾 Sales
                </a>

                <a href="/dashboard/expenses" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  💸 Expenses
                </a>

                <a href="/dashboard/profit" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  📈 Profit
                </a>

                <a href="/dashboard/reports" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  📋 Reports
                </a>

                <a href="/dashboard/analytics" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  📊 Analytics
                </a>

                <a href="/dashboard/payroll" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  💵 Payroll
                </a>

                <a href="/dashboard/reconciliation" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  🏦 Reconciliation
                </a>

                <a href="/dashboard/offline-queue" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  ☁️ Offline Queue
                </a>
              </>
            )}

            {role === "cashier" && (
              <>
                <a href="/dashboard/pos" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  💰 POS
                </a>

                <a href="/dashboard/my-sales" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  🧾 My Sales
                </a>
              </>
            )}

          </nav>

        </div>

        <div className="mt-auto p-4">

          <button
            onClick={logout}
            className="w-full py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-all"
          >
            🚪 Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="flex-1 bg-slate-100 p-8">

        <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[calc(100vh-4rem)]">

          {children}

        </div>

      </main>

    </div>

  </div>
);
}
