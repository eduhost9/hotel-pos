"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/offline-db";
import { syncOfflineSales } from "@/lib/syncOfflineSales";

export default function OfflineQueuePage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadSales() {
    setLoading(true);

    const data = await db.offlineSales
      .orderBy("id")
      .reverse()
      .toArray();

    setSales(data);
    setLoading(false);
  }

  async function syncNow() {
    await syncOfflineSales();
    await loadSales();

    alert("Sync completed");
  }

  async function deleteSale(id: number) {
    const confirmed = confirm(
      "Delete this queued sale?"
    );

    if (!confirmed) return;

    await db.offlineSales.delete(id);

    await loadSales();
  }

  useEffect(() => {
    loadSales();
  }, []);

  const pendingSales = sales.filter(
    (sale) => !sale.synced
  );

  const syncedSales = sales.filter(
    (sale) => sale.synced
  );

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Offline Queue
      </h1>

      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-yellow-100 border rounded-lg p-4">
          <div className="text-sm text-gray-600">
            Pending Sales
          </div>

          <div className="text-3xl font-bold">
            {pendingSales.length}
          </div>
        </div>

        <div className="bg-green-100 border rounded-lg p-4">
          <div className="text-sm text-gray-600">
            Synced Sales
          </div>

          <div className="text-3xl font-bold">
            {syncedSales.length}
          </div>
        </div>

        <div className="bg-blue-100 border rounded-lg p-4">
          <div className="text-sm text-gray-600">
            Total Records
          </div>

          <div className="text-3xl font-bold">
            {sales.length}
          </div>
        </div>

      </div>

      <div className="flex gap-3 mb-6">

        <button
          onClick={loadSales}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>

        <button
          onClick={syncNow}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Sync Now
        </button>

      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="p-3 text-left">
                  Receipt
                </th>

                <th className="p-3 text-left">
                  Total
                </th>

                <th className="p-3 text-left">
                  Payment
                </th>

                <th className="p-3 text-left">
                  Date
                </th>

                <th className="p-3 text-left">
                  Status
                </th>

                <th className="p-3 text-left">
                  Action
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
                    KES {sale.total}
                  </td>

                  <td className="p-3">
                    {sale.payment_method}
                  </td>

                  <td className="p-3">
                    {new Date(
                      sale.created_at
                    ).toLocaleString()}
                  </td>

                  <td className="p-3">
                    {sale.synced ? (
                      <span className="text-green-600 font-bold">
                        Synced
                      </span>
                    ) : (
                      <span className="text-red-600 font-bold">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="p-3">

                    <button
                      onClick={() =>
                        deleteSale(
                          sale.id
                        )
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}