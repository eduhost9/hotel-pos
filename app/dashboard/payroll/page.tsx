"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { requireAdmin } from "@/lib/adminGuard";

export default function StockPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    const canAccess = await requireAdmin();

    if (!canAccess) {
      router.push("/dashboard/pos");
      return;
    }

    setAllowed(true);
  }

  if (!allowed) {
    return <div>Checking Access...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">
  Payroll Management
</h1>
    </div>
  );
}