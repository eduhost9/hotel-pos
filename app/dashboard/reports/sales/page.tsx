"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SalesReportPage() {
  const [sales, setSales] =
    useState<any[]>([]);

const [startDate, setStartDate] =
  useState("");

const [endDate, setEndDate] =
  useState("");

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
  let query = supabase
    .from("sales")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (startDate) {
    query = query.gte(
      "created_at",
      startDate
    );
  }

  if (endDate) {
    query = query.lte(
      "created_at",
      endDate + "T23:59:59"
    );
  }

  const { data } = await query;

  setSales(data || []);
}

  const totalSales =
    sales.reduce(
      (sum, sale) =>
        sum + Number(sale.total),
      0
    );
const today = new Date().toISOString().split("T")[0];
const todayTotal =
  sales
    .filter((sale) => sale.created_at?.startsWith(today))
    .reduce(
      (sum, sale) => sum + Number(sale.total),
      0
    );

const cashTotal =
  sales
    .filter(
      (sale) =>
        sale.payment_method ===
        "Cash"
    )
    .reduce(
      (sum, sale) =>
        sum + Number(sale.total),
      0
    );

const mpesaTotal =
  sales
    .filter(
      (sale) =>
        sale.payment_method ===
        "MPESA"
    )
    .reduce(
      (sum, sale) =>
        sum + Number(sale.total),
      0
    );

const cardTotal =
  sales
    .filter(
      (sale) =>
        sale.payment_method ===
        "Card"
    )
    .reduce(
      (sum, sale) =>
        sum + Number(sale.total),
      0
    );

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Sales Report
      </h1>
<div className="flex gap-4 mb-6">

  <input
    type="date"
    value={startDate}
    onChange={(e) =>
      setStartDate(
        e.target.value
      )
    }
    className="border p-2 rounded"
  />

  <input
    type="date"
    value={endDate}
    onChange={(e) =>
      setEndDate(
        e.target.value
      )
    }
    className="border p-2 rounded"
  />

  <button
    onClick={loadSales}
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    Filter
  </button>

</div>
      <div className="bg-green-100 p-4 rounded-lg mb-6">

        <h2 className="text-xl font-bold">
          Total Sales
        </h2>

        <p className="text-3xl">
          KES {totalSales}
        </p>

      </div>

      
      <div className="grid grid-cols-3 gap-4 mb-6">

  <div className="bg-blue-100 p-4 rounded">
    <h2 className="font-bold">
      Cash
    </h2>

    <div className="text-2xl">
      KES {cashTotal}
    </div>
  </div>

  <div className="bg-green-100 p-4 rounded">
    <h2 className="font-bold">
      MPESA
    </h2>

    <div className="text-2xl">
      KES {mpesaTotal}
    </div>
  </div>

  <div className="bg-yellow-100 p-4 rounded">
    <h2 className="font-bold">
      Card
    </h2>

    <div className="text-2xl">
      KES {cardTotal}
    </div>
  </div>

</div>

      <table className="w-full border">

        <thead>

          <tr>

            <th className="p-2">
              Receipt
            </th>

            <th className="p-2">
              Payment
            </th>

            <th className="p-2">
              Total
            </th>

            <th className="p-2">
              Date
            </th>

          </tr>

        </thead>

        <tbody>

          {sales.map((sale) => (

            <tr
              key={sale.id}
            >

              <td className="p-2">
                {
                  sale.receipt_number
                }
              </td>

              <td className="p-2">
                {
                  sale.payment_method
                }
              </td>

              <td className="p-2">
                KES {sale.total}
              </td>

              <td className="p-2">
                {new Date(
                  sale.created_at
                ).toLocaleString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>
<div className="bg-indigo-100 p-4 rounded-lg mb-6">

  <h2 className="font-bold">
    Today's Sales
  </h2>

  <div className="text-3xl">
    KES {todayTotal}
  </div>

</div>
    </div>
  );
}