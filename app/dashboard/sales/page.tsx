"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Receipt from "../pos/Receipt";
import PermissionGuard from "@/components/PermissionGuard";

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [selectedSale, setSelectedSale] =
  useState<any>(null);

const [saleItems, setSaleItems] =
  useState<any[]>([]);

  const [showReceipt, setShowReceipt] =
  useState(false);

const [receiptData, setReceiptData] =
  useState<any>(null);

  useEffect(() => {
    loadSales();
  }, []);

  async function reprintSale(sale: any) {

  const { data } = await supabase
    .from("sale_items")
    .select(`
      *,
      menu_items(name)
    `)
    .eq("sale_id", sale.id);

  const receiptItems =
    (data || []).map((item) => ({
      id: item.id,
      name: item.menu_items?.name,
      quantity: item.quantity,
      price: item.unit_price,
    }));

  setReceiptData({
    receiptNo: sale.receipt_number,
    cart: receiptItems,
    total: sale.total,
    paymentMethod:
      sale.payment_method,
  });

  setShowReceipt(true);
}

  async function loadSales() {
    const { data } = await supabase
      .from("sales")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setSales(data || []);
  }

  async function viewSale(sale: any) {

  setSelectedSale(sale);

  const { data } = await supabase
    .from("sale_items")
    .select(`
      *,
      menu_items(name)
    `)
    .eq("sale_id", sale.id);

  setSaleItems(data || []);
}

  return (
    <PermissionGuard permission="sales">
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

              <th className="text-left p-3">
                 Actions
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
                    
                <td className="p-3">

  <div className="flex gap-2">

  <button
    onClick={() => viewSale(sale)}
    className="bg-blue-600 text-white px-3 py-1 rounded"
  >
    View
  </button>

  <button
    onClick={() => reprintSale(sale)}
    className="bg-green-600 text-white px-3 py-1 rounded"
  >
    Reprint
  </button>

</div>

</td>

              </tr>

            ))}

          </tbody>

        </table>

        {selectedSale && (

  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

    <div className="bg-white p-6 rounded-xl w-[500px]">

      <h2 className="text-2xl font-bold mb-4">
        Receipt Details
      </h2>

      <p>
        Receipt:
        {" "}
        {selectedSale.receipt_number}
      </p>

      <p>
        Payment:
        {" "}
        {selectedSale.payment_method}
      </p>

      <p>
        Total:
        {" "}
        KES {selectedSale.total}
      </p>

      <hr className="my-4" />

      {saleItems.map((item) => (

        <div
          key={item.id}
          className="flex justify-between mb-2"
        >

          <span>
            {item.menu_items?.name}
          </span>

          <span>
            x{item.quantity}
          </span>

        </div>

      ))}

      <button
        onClick={() =>
          setSelectedSale(null)
        }
        className="mt-4 bg-gray-300 px-4 py-2 rounded"
      >
        Close
      </button>

    </div>

    

  </div>

)}

{showReceipt && receiptData && (

  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

    <div className="bg-white p-6 rounded-xl">

      <Receipt
        receiptNo={receiptData.receiptNo}
        cart={receiptData.cart}
        total={receiptData.total}
        paymentMethod={receiptData.paymentMethod}
      />

      <button
        onClick={() => window.print()}
        className="w-full mt-4 bg-green-600 text-white py-2 rounded"
      >
        Print Receipt
      </button>

      <button
        onClick={() => setShowReceipt(false)}
        className="w-full mt-2 bg-gray-300 py-2 rounded"
      >
        Close
      </button>

    </div>

  </div>

)}

      </div>
    </div>
    </PermissionGuard>
  );
}