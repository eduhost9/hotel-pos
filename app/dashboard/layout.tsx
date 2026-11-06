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

        <aside className="w-64 bg-white border-r p-4 min-h-screen">

          <h2 className="font-bold text-2xl mb-6">
          CHOMA ZONE HOTEL POS
          </h2>

          <div className="space-y-2">

  {role === "admin" && (
    <>
      <a
        href="/dashboard"
        className="block p-2 rounded hover:bg-slate-100"
      >
        Dashboard
      </a>

      <a
        href="/dashboard/pos"
        className="block p-2 rounded hover:bg-slate-100"
      >
        POS
      </a>

      <a
        href="/dashboard/menu"
        className="block p-2 rounded hover:bg-slate-100"
      >
        Menu
      </a>

      <a
        href="/dashboard/reports"
        className="block p-2 rounded hover:bg-slate-100"
      >
        Reports
      </a>

      <a
        href="/dashboard/stock"
        className="block p-2 rounded hover:bg-slate-100"
      >
        Stock
      </a>

      <a
        href="/dashboard/payroll"
        className="block p-2 rounded hover:bg-slate-100"
      >
        Payroll
      </a>

      <a
        href="/dashboard/test-role"
        className="block p-2 rounded hover:bg-slate-100"
      >
        Role Test
      </a>

      <a
  href="/dashboard/sales"
  className="block p-2 rounded hover:bg-slate-100"
>
  Sales
</a>

    </>
  )}

  {role === "cashier" && (
    <>
      <a
        href="/dashboard/pos"
        className="block p-2 rounded hover:bg-slate-100"
      >
        POS
      </a>

      <a
        href="/dashboard/my-sales"
        className="block p-2 rounded hover:bg-slate-100"
      >
        My Sales
      </a>

    </>
  )}

</div>

          <button
            onClick={logout}
            className="mt-8 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>

        </aside>

        <main className="flex-1 p-6">
          {children}
        </main>

      </div>
    </div>
  );
}
