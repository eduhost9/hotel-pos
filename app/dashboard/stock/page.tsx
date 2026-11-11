"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PermissionGuard from "@/components/PermissionGuard";

export default function StockPage() {
  const [itemName, setItemName] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [cost, setCost] =
    useState("");

  const [supplier, setSupplier] =
    useState("");

  const [stockEntries, setStockEntries] =
    useState<any[]>([]);

    const [editingId, setEditingId] =
  useState<string | null>(null);

  const [totalPurchases, setTotalPurchases] =
  useState(0);

const [stockCount, setStockCount] =
  useState(0);

const [averagePurchase, setAveragePurchase] =
  useState(0);

  const [issueItem,
setIssueItem] =
  useState("");

const [issueQty,
setIssueQty] =
  useState("");

const [issuedTo,
setIssuedTo] =
  useState("");

const [issuances,
setIssuances] =
  useState<any[]>([]);

  useEffect(() => {
    loadStock();
    loadIssuances();
  }, []);

  async function loadStock() {
    const { data } = await supabase
      .from("stock_entries")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setStockEntries(data || []);
    const entries = data || [];

const total = entries.reduce(
  (sum, entry) =>
    sum + Number(entry.total_cost),
  0
);

setTotalPurchases(total);

setStockCount(entries.length);

setAveragePurchase(
  entries.length > 0
    ? Math.round(total / entries.length)
    : 0
);

  }
async function issueStock() {

  const stockEntry =
    stockEntries.find(
      (entry) =>
        entry.item_name ===
        issueItem
    );

  if (!stockEntry) {

    alert(
      "Item not found in stock."
    );

    return;
  }

  const currentBalance =
    getBalance(
      stockEntry.item_name,
      Number(
        stockEntry.quantity
      )
    );

  if (
    Number(issueQty) >
    currentBalance
  ) {

    alert(
      `Insufficient stock. Available balance is ${currentBalance}.`
    );

    return;
  }

  await supabase
    .from("stock_issuance")
    .insert({
      item_name:
        issueItem,

      quantity:
        Number(issueQty),

      issued_to:
        issuedTo,
    });

  setIssueItem("");
  setIssueQty("");
  setIssuedTo("");

  loadIssuances();
}


async function loadIssuances() {

  const { data } =
    await supabase
      .from("stock_issuance")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  setIssuances(
    data || []
  );
}

function getBalance(
  itemName: string,
  purchasedQty: number
) {

  const issuedQty =
    issuances
      .filter(
        (issue) =>
          issue.item_name ===
          itemName
      )
      .reduce(
        (sum, issue) =>
          sum +
          Number(
            issue.quantity
          ),
        0
      );

  return (
    purchasedQty -
    issuedQty
  );
}

  async function saveStock() {

  if (editingId) {

    await supabase
      .from("stock_entries")
      .update({
        item_name: itemName,
        quantity: Number(quantity),
        total_cost: Number(cost),
        supplier,
      })
      .eq("id", editingId);

    setEditingId(null);

  } else {

    const { data: stockRecord, error } =
  await supabase
    .from("stock_entries")
    .insert({
      item_name: itemName,
      quantity: Number(quantity),
      total_cost: Number(cost),
      supplier,
      purchase_date:
        new Date()
          .toISOString()
          .split("T")[0],
    })
    .select()
    .single();

if (!error && stockRecord) {

  await supabase
    .from("expenses")
    .insert({
      stock_entry_id:
        stockRecord.id,
      description:
        `Stock Purchase - ${itemName}`,
      amount: Number(cost),
      expense_date:
        new Date()
          .toISOString()
          .split("T")[0],
    });

}

  }

  setItemName("");
  setQuantity("");
  setCost("");
  setSupplier("");

  loadStock();
}

function editStock(entry: any) {

  setEditingId(entry.id);

  setItemName(
    entry.item_name || ""
  );

  setQuantity(
    entry.quantity?.toString() || ""
  );

  setCost(
    entry.total_cost?.toString() || ""
  );

  setSupplier(
    entry.supplier || ""
  );
}

async function deleteStock(id: string) {

  const confirmed =
    confirm(
      "Delete this stock entry?"
    );

  if (!confirmed) return;

  await supabase
    .from("stock_entries")
    .delete()
    .eq("id", id);

  loadStock();
}



 return (
  <PermissionGuard permission="stock">
    <div>
    
    <div className="bg-white border rounded-xl p-4 mb-6">

  <h2 className="text-xl font-bold mb-4">
    Stock Issuance
  </h2>
</div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

    <select
  value={issueItem}
  onChange={(e) =>
    setIssueItem(
      e.target.value
    )
  }
  className="border p-2"
>

  <option value="">
    Select Item
  </option>

  {stockEntries.map(
    (item) => (

      <option
        key={item.id}
        value={
          item.item_name
        }
      >
        {item.item_name}
      </option>

    )
  )}

</select>
  {
  issueItem && (

    <div className="text-sm">

      Available:

      <span
        className="font-bold ml-2"
      >

        {
          getBalance(
            issueItem,
            Number(
              stockEntries.find(
                (s) =>
                  s.item_name ===
                  issueItem
              )
              ?.quantity || 0
            )
          )
        }

      </span>

    </div>

  )
}    

    <input
      value={issueQty}
      onChange={(e) =>
        setIssueQty(
          e.target.value
        )
      }
      placeholder="Quantity"
      className="border p-2"
    />

    <input
      value={issuedTo}
      onChange={(e) =>
        setIssuedTo(
          e.target.value
        )
      }
      placeholder="Issued To"
      className="border p-2"
    />

  </div>

  <button
    onClick={issueStock}
    className="mt-3 bg-orange-600 text-white px-4 py-2 rounded"
  >
    Issue Stock
  </button>

</div>
    
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Stock Purchases
      </h1>
      <div className="grid grid-cols-3 gap-4 mb-6">

  <div className="bg-white border rounded-xl p-4">
    <h3 className="text-gray-500">
      Total Purchases
    </h3>

    <div className="text-3xl font-bold">
      KES {totalPurchases}
    </div>
  </div>

  <div className="bg-white border rounded-xl p-4">
    <h3 className="text-gray-500">
      Entries
    </h3>

    <div className="text-3xl font-bold">
      {stockCount}
    </div>
  </div>

  <div className="bg-white border rounded-xl p-4">
    <h3 className="text-gray-500">
      Average Purchase
    </h3>

    <div className="text-3xl font-bold">
      KES {averagePurchase}
    </div>
  </div>

</div>

      <div className="grid grid-cols-4 gap-3 mb-6">

        <input
          value={itemName}
          onChange={(e) =>
            setItemName(e.target.value)
          }
          placeholder="Item"
          className="border p-2"
        />

        <input
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
          placeholder="Quantity"
          className="border p-2"
        />

        <input
          value={cost}
          onChange={(e) =>
            setCost(e.target.value)
          }
          placeholder="Cost"
          className="border p-2"
        />

        <input
          value={supplier}
          onChange={(e) =>
            setSupplier(e.target.value)
          }
          placeholder="Supplier"
          className="border p-2"
        />

      </div>

      <button
        onClick={saveStock}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {
  editingId
    ? "Update Stock"
    : "Save Stock Purchase"
}
      </button>

      <div className="mt-8">
<div className="mb-3">

  <h2 className="font-bold text-lg">
    Current Stock
  </h2>

  <div className="text-red-600 text-sm">

    {stockEntries
      .filter(
  (item) =>
    getBalance(
      item.item_name,
      Number(item.quantity)
    ) <= 5
)
      .map(
  (item) =>
    `${item.item_name} (${getBalance(
      item.item_name,
      Number(item.quantity)
    )})`
)
      .join(", ")
    }

  </div>

</div>

        <table className="w-full border">

          <thead>

            <tr className="bg-slate-100">

              <th className="p-2 text-left">
                Item
              </th>

              <th className="p-2 text-left">
                Qty
              </th>
              <th className="p-2 text-left">
  Balance
</th>

              <th className="p-2 text-left">
                Cost
              </th>

              <th className="p-2 text-left">
                Supplier
              </th>

              <th className="p-2 text-left">
              Actions
            </th>

            </tr>

          </thead>

          <tbody>

            {stockEntries.map(
              (entry) => (

                <tr
                  key={entry.id}
                  className="border-t"
                >

                  <td className="p-2">
                    {entry.item_name}
                  </td>

                  <td className="p-2">
                    {entry.quantity}
                  </td>
                <td
  className={`p-2 font-bold ${
    getBalance(
      entry.item_name,
      Number(entry.quantity)
    ) <= 5
      ? "text-red-600"
      : "text-green-700"
  }`}
>
  {getBalance(
    entry.item_name,
    Number(entry.quantity)
  )}
</td>
                  <td className="p-2">
                    KES {entry.total_cost}
                  </td>

                  <td className="p-2">
                    {entry.supplier}
                  </td>

                  <td className="p-2">

  <div className="flex gap-2">

    <button
      onClick={() =>
        editStock(entry)
      }
      className="bg-blue-600 text-white px-3 py-1 rounded"
    >
      Edit
    </button>

    <button
      onClick={() =>
        deleteStock(entry.id)
      }
      className="bg-red-600 text-white px-3 py-1 rounded"
    >
      Delete
    </button>

  </div>

</td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
    </PermissionGuard>
  );
}