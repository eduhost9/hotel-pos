"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    const { data } = await supabase
      .from("sales")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setSales(data || []);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Sales History
      </h1>

      <div className="bg-white rounded-xl border overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>
              <th className="text-left p-3">
                Receipt
              </th>

              <th className="text-left p-3">
                Payment
              </th>

              <th className="text-left p-3">
                Total
              </th>

              <th className="text-left p-3">
                Date
              </th>
            </tr>

          </thead>

          <tbody>

            {sales.map((sale) => (

              <tr
                key={sale.id}
                className="border-t"
              >

                <td className="p-3">
                  {sale.receipt_number}
                </td>

                <td className="p-3">
                  {sale.payment_method}
                </td>

                <td className="p-3">
                  KES {sale.total}
                </td>

                <td className="p-3">
                  {new Date(
                    sale.created_at
                  ).toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}