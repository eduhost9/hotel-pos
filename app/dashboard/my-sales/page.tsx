"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MySalesPage() {
  const [salesTotal, setSalesTotal] = useState(0);
  const [transactionCount, setTransactionCount] =
    useState(0);

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data } = await supabase
      .from("sales")
      .select("*")
      .eq("cashier_id", user.id)
      .gte(
        "created_at",
        today.toISOString()
      );

    if (!data) return;

    const total = data.reduce(
      (sum, sale) =>
        sum + Number(sale.total),
      0
    );

    setSalesTotal(total);
    setTransactionCount(data.length);
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        My Sales Today
      </h1>

      <div className="grid grid-cols-2 gap-6">

        <div className="bg-white border rounded-xl p-6">

          <h2 className="text-gray-500">
            Sales Amount
          </h2>

          <div className="text-4xl font-bold">
            KES {salesTotal}
          </div>

        </div>

        <div className="bg-white border rounded-xl p-6">

          <h2 className="text-gray-500">
            Transactions
          </h2>

          <div className="text-4xl font-bold">
            {transactionCount}
          </div>

        </div>

      </div>

    </div>
  );
}