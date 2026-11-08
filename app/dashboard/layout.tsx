"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentRole } from "@/lib/auth";
import {
  getUserPermissions,
} from "@/lib/permissions";
import { db } from "@/lib/offline-db";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
const [role, setRole] = useState("");
const [permissions,
setPermissions] =
  useState<string[]>([]);
const [sidebarOpen, setSidebarOpen] =
  useState(false);
  


  useEffect(() => {
  checkUser();
}, []);

async function checkUser() {
  if (!navigator.onLine) {

  const savedUser =
    localStorage.getItem(
      "offlineUser"
    );

  if (!savedUser) {

    router.push("/login");

    return;
  }

  const offlineUser =
    JSON.parse(savedUser);

  setRole(
    offlineUser.role || ""
  );

  setPermissions(
    offlineUser.permissions || []
  );

  setLoading(false);

  return;
}

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {

  router.push("/login");

  return;
}

  const userRole =
  await getCurrentRole();

setRole(userRole || "");

const perms =
  await getUserPermissions();

setPermissions(perms);

setLoading(false);
}

function can(
  permission: string
) {

  return permissions.includes(
    permission
  );

}

  async function logout() {

  localStorage.removeItem(
    "offlineUser"
  );

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

    {/* MOBILE MENU */}

    <div className="md:hidden bg-white border-b p-4 sticky top-0 z-50">

      <button
        onClick={() =>
          setSidebarOpen(!sidebarOpen)
        }
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        ☰ Menu
      </button>

    </div>

    <div className="flex">
      {sidebarOpen && (
  <div
    className="fixed inset-0 bg-black/40 z-40 md:hidden"
    onClick={() =>
      setSidebarOpen(false)
    }
  />
)}

      {/* SIDEBAR */}

      <aside
  className={`
    w-72
    min-h-screen
    bg-gradient-to-b
    from-slate-900
    to-slate-800
    text-white
    shadow-2xl

    fixed
    md:static

    top-0

    z-50

    transition-all
    duration-300

    ${
      sidebarOpen
        ? "left-0"
        : "-left-72"
    }

    md:left-0
  `}
>

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

            
              <>
             {can("users") && (

  <a
    href="/dashboard/users"
    onClick={() =>
      setSidebarOpen(false)
    }
    className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition"
  >
    👥 Users
  </a>

)}

                <a href="/dashboard" 
                onClick={() => setSidebarOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  📊 Dashboard
                </a>

                {can("pos") && (

<a
  href="/dashboard/pos"
  onClick={() =>
    setSidebarOpen(false)
  }
  className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition"
>
  💰 POS
</a>

)}

                {can("menu") && (

<a
  href="/dashboard/menu"
  onClick={() =>
    setSidebarOpen(false)
  }
  className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition"
>
  🍽️ Menu
</a>

)}

                
                {can("categories") && (

                <a href="/dashboard/categories"
                onClick={() => setSidebarOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  🏷️ Categories
                </a>

                )}

                {can("kitchen") && (

                <a href="/dashboard/kitchen"
                onClick={() => setSidebarOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  👨‍🍳 Kitchen
                </a>
                )}

{can("stock") && (
                <a href="/dashboard/stock" 
                onClick={() => setSidebarOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  📦 Stock
                </a>
)}


                {can("sales") && (
                  <a href="/dashboard/sales" 
                  onClick={() => setSidebarOpen(false)}
                  className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                    🧾 Sales
                  </a>
                )}

                {can("expenses") && (
                  <a href="/dashboard/expenses" 
                  onClick={() => setSidebarOpen(false)}
                  className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                    💸 Expenses
                  </a>
                )}

                {can("profit") && (
                  <a href="/dashboard/profit" 
                  onClick={() => setSidebarOpen(false)}
                  className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  📈 Profit
                </a>
 )}
                {can("reports") && (
                  <a href="/dashboard/reports" 
                  onClick={() => setSidebarOpen(false)}
                  className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                    📋 Reports
                  </a>
                )}

                {can("analytics") && (
                  <a href="/dashboard/analytics" 
                  onClick={() => setSidebarOpen(false)}
                  className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                    📊 Analytics
                  </a>
                )}

                {can("payroll") && (
                  <a href="/dashboard/payroll" 
                  onClick={() => setSidebarOpen(false)}
                  className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                    💵 Payroll
                  </a>
                )}

                {can("reconciliation") && (
                  <a href="/dashboard/reconciliation" 
                  onClick={() => setSidebarOpen(false)}
                  className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  🏦 Reconciliation
                </a>
 )}
                {can("offline-queue") && (
                  <a href="/dashboard/offline-queue" 
                  onClick={() => setSidebarOpen(false)}
                  className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                    ☁️ Offline Queue
                  </a>
                )}
              </>
            

            
              <>
                    {can("my-sales") && (
                <a href="/dashboard/my-sales" 
                onClick={() => setSidebarOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition">
                  🧾 My Sales
                </a>
                 )}
              </>
            

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

      <main className="flex-1 bg-slate-100 p-4 md:p-8">

        <div className="bg-white rounded-2xl shadow-lg p-3 md:p-6 min-h-[calc(100vh-4rem)] overflow-x-auto">

          {children}

        </div>

      </main>

    </div>

  </div>
);
}
