"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function KitchenPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true);

    const { data, error } = await supabase
      .from("kitchen_orders")
      .select(`
        *,
        kitchen_order_items (*)
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  }

  async function updateStatus(
    id: number,
    status: string
  ) {
    const { error } = await supabase
      .from("kitchen_orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    loadOrders();
  }

  useEffect(() => {
    loadOrders();

    const interval = setInterval(
      loadOrders,
      10000
    );

    return () =>
      clearInterval(interval);
  }, []);

  const pendingOrders = orders.filter(
    (o) => o.status === "Pending"
  );

  const preparingOrders = orders.filter(
    (o) => o.status === "Preparing"
  );

  const readyOrders = orders.filter(
    (o) => o.status === "Ready"
  );

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Kitchen Display
      </h1>

      <div className="grid grid-cols-3 gap-6">

        {/* PENDING */}

        <div>

          <h2 className="text-xl font-bold mb-4 text-red-600">
            Pending
          </h2>

          {pendingOrders.map((order) => (

            <div
              key={order.id}
              className="bg-white border rounded-lg p-4 mb-4"
            >

              <div className="font-bold">
                {order.receipt_number}
              </div>

              <div className="text-sm text-gray-500 mb-3">
                {new Date(
                  order.created_at
                ).toLocaleString()}
              </div>

              {order.kitchen_order_items?.map(
                (item: any) => (
                  <div
                    key={item.id}
                    className="mb-1"
                  >
                    {item.quantity} × {item.item_name}
                  </div>
                )
              )}

              <button
                onClick={() =>
                  updateStatus(
                    order.id,
                    "Preparing"
                  )
                }
                className="mt-3 w-full bg-yellow-500 text-white py-2 rounded"
              >
                Start Preparing
              </button>

            </div>

          ))}

        </div>

        {/* PREPARING */}

        <div>

          <h2 className="text-xl font-bold mb-4 text-yellow-600">
            Preparing
          </h2>

          {preparingOrders.map((order) => (

            <div
              key={order.id}
              className="bg-white border rounded-lg p-4 mb-4"
            >

              <div className="font-bold">
                {order.receipt_number}
              </div>

              <div className="text-sm text-gray-500 mb-3">
                {new Date(
                  order.created_at
                ).toLocaleString()}
              </div>

              {order.kitchen_order_items?.map(
                (item: any) => (
                  <div
                    key={item.id}
                    className="mb-1"
                  >
                    {item.quantity} × {item.item_name}
                  </div>
                )
              )}

              <button
                onClick={() =>
                  updateStatus(
                    order.id,
                    "Ready"
                  )
                }
                className="mt-3 w-full bg-green-600 text-white py-2 rounded"
              >
                Mark Ready
              </button>

            </div>

          ))}

        </div>

        {/* READY */}

        <div>

          <h2 className="text-xl font-bold mb-4 text-green-600">
            Ready
          </h2>

          {readyOrders.map((order) => (

            <div
              key={order.id}
              className="bg-white border rounded-lg p-4 mb-4"
            >

              <div className="font-bold">
                {order.receipt_number}
              </div>

              <div className="text-sm text-gray-500 mb-3">
                {new Date(
                  order.created_at
                ).toLocaleString()}
              </div>

              {order.kitchen_order_items?.map(
                (item: any) => (
                  <div
                    key={item.id}
                    className="mb-1"
                  >
                    {item.quantity} × {item.item_name}
                  </div>
                )
              )}

              <button
                onClick={() =>
                  updateStatus(
                    order.id,
                    "Served"
                  )
                }
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded"
              >
                Mark Served
              </button>

            </div>

          ))}

        </div>

      </div>

      {loading && (
        <div className="mt-4">
          Loading...
        </div>
      )}

    </div>
  );
}