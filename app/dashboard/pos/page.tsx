"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Receipt from "./Receipt";
import { db }
from "@/lib/offline-db";
import {
  syncOfflineSales
}
from "@/lib/syncOfflineSales";
import PermissionGuard from "@/components/PermissionGuard";


export default function POSPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [cashierId, setCashierId] =
  useState<string>("");
 const [search, setSearch] =
  useState(""); 
const [lastReceiptNo, setLastReceiptNo] = useState("");
const [lastSaleItems, setLastSaleItems] = useState<any[]>([]);
const [lastTotal, setLastTotal] = useState(0);

const onlineHandler =
  async () => {

    setIsOnline(true);

    await syncOfflineSales();

  };

  useEffect(() => {
    setIsOnline(navigator.onLine);

    if (navigator.onLine) {
      void syncOfflineSales();
    }

  const offlineHandler =
    () => setIsOnline(false);

  window.addEventListener(
    "online",
    onlineHandler
  );

  window.addEventListener(
    "offline",
    offlineHandler
  );

  return () => {

    window.removeEventListener(
      "online",
      onlineHandler
    );

    window.removeEventListener(
      "offline",
      offlineHandler
    );

  };

}, []);

 useEffect(() => {
  loadMenu();
  loadUser();
}, []);

async function loadMenu() {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("active", true)
    .order("name");

  if (error) {
    console.error(error);
    return;
  }

  setMenuItems(data || []);
}

async function loadUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    setCashierId(user.id);
  }
}

  const addToCart = (item: any) => {
    const existing = cart.find((c) => c.id === item.id);

    if (existing) {
      setCart(
        cart.map((c) =>
          c.id === item.id
            ? {
                ...c,
                quantity: c.quantity + 1,
              }
            : c
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...item,
          price: item.selling_price,
          quantity: 1,
        },
      ]);
    }
  };

  function increaseQty(id: number) {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  function decreaseQty(id: number) {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(id: number) {
    setCart(
      cart.filter((item) => item.id !== id)
    );
  }

const filteredMenu =
  menuItems.filter((item) =>
    item.name
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function generateReceiptNo() {
    return "RCP-" + Date.now();
  }

  async function completeSale() {
    if (cart.length === 0) {
      alert("Cart Empty");
      return;
    }

    const receiptNo = generateReceiptNo();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    
    if (!isOnline) {

  await db.offlineSales.add({
    cashier_id: cashierId,

    receipt_number:
      receiptNo,

    payment_method:
      paymentMethod,

    total,

    items: cart,

    synced: false,

    created_at:
      new Date()
        .toISOString(),
  });

  alert(
    "Offline Sale Saved"
  );

  setCart([]);

  return;
}

    try {
      if (!user) {
        alert("User not logged in");
        return;
      }

      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert({
          cashier_id: user.id,
          receipt_number: receiptNo,
          payment_method: paymentMethod,
          total,
        })
        .select()
        .single();

      if (saleError) {
        console.error(saleError);
        alert("Failed to save sale");
        return;
      }

      const saleItems = cart.map((item) => ({
        sale_id: sale.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.quantity * item.price,
      }));

      const { error: itemError } = await supabase
        .from("sale_items")
        .insert(saleItems);

      if (itemError) {
        console.error(itemError);
        alert("Failed to save items");
        return;
      }
// CREATE KITCHEN ORDER

const {
  data: kitchenOrder,
  error: kitchenError,
} = await supabase
  .from("kitchen_orders")
  .insert({
    receipt_number: receiptNo,
    cashier_id: user.id,
    total: total,
    status: "Pending",
  })
  .select()
  .single();

if (kitchenError) {
  console.error(kitchenError);
} else {

  const kitchenItems = cart.map(
    (item) => ({
      kitchen_order_id:
        kitchenOrder.id,

      menu_item_id:
        item.id,

      item_name:
        item.name,

      quantity:
        item.quantity,

      status: "Pending",
    })
  );

  const {
    error: kitchenItemsError,
  } = await supabase
    .from("kitchen_order_items")
    .insert(kitchenItems);

  if (kitchenItemsError) {
    console.error(
      kitchenItemsError
    );
  }
}
      setLastReceiptNo(receiptNo);
      setLastSaleItems(cart);
      setLastTotal(total);
      setShowReceipt(true);
      setCart([]);
    } catch (err) {
      console.error(err);
      alert("Unexpected Error");
    }
  }

  return (
    <PermissionGuard permission="pos">
    
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 p-2 md:p-4">

     

      {/* PRODUCTS */}

      <div className="order-2 xl:order-1 xl:col-span-3">

  <h1 className="text-2xl md:text-3xl font-bold mb-4">
    Hotel POS
  </h1>

  <input
    type="text"
    placeholder="🔍 Search food or drink..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    className="w-full border p-3 rounded-lg mb-4"
  />

  <div className="bg-white border rounded-xl overflow-hidden">

    <div className="max-h-[60vh] md:max-h-[700px] overflow-y-auto">

      {filteredMenu.map((item) => (

        <div
          key={item.id}
          className="
flex
flex-col
sm:flex-row
sm:justify-between
sm:items-center
border-b
px-4
py-4
hover:bg-slate-50
gap-3
"
        >

          <div>

            <div className="font-bold text-lg">
              {item.name}
            </div>

            <div className="text-sm text-gray-500">
              {item.category}
            </div>

          </div>

         <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">

            <div className="font-bold text-green-700">
              KES {item.selling_price}
            </div>

            <button
              onClick={() =>
                addToCart(item)
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Add
            </button>

          </div>

        </div>

      ))}

    </div>

  </div>

</div>

      {/* CART */}

      <div className="order-1 xl:order-2 bg-white border rounded-xl p-4 sticky top-4">

        <h2 className="text-2xl font-bold mb-4">
          Cart
        </h2>

        <div
  className={`mb-4 p-2 rounded text-center text-white font-bold ${
    isOnline
      ? "bg-green-600"
      : "bg-red-600"
  }`}
>
  {isOnline
    ? "🟢 ONLINE"
    : "🔴 OFFLINE"}
</div>

        {cart.map((item) => (

          <div
            key={item.id}
            className="border-b py-3"
          >
            <div className="flex justify-between">

              <div>
                <div className="font-bold">
                  {item.name}
                </div>

                <div>
                  KES {item.price}
                </div>
              </div>

              <div className="font-bold">
                KES {item.price * item.quantity}
              </div>

            </div>

            <div className="flex flex-wrap gap-2 mt-2 items-center">

              <button
                onClick={() => decreaseQty(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                -
              </button>

              <span>
                {item.quantity}
              </span>

              <button
                onClick={() => increaseQty(item.id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                +
              </button>

              <button
                onClick={() => removeItem(item.id)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Remove
              </button>

            </div>

          </div>

        ))}

        <hr className="my-4" />

        <label className="block mb-2 font-semibold">
          Payment Method
        </label>

        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
          className="border p-3 w-full mb-4 rounded"
        >
          <option>Cash</option>
          <option>MPESA</option>
          <option>Card</option>
        </select>

        <div className="text-2xl font-bold">
          Total: KES {total}
        </div>

        <button
          onClick={completeSale}
          className="
w-full
mt-4
bg-green-600
text-white
py-4
rounded-lg
text-lg
font-bold
sticky
bottom-0
"
        >
          COMPLETE SALE
        </button>

      </div>
{showReceipt && (
 <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4">

    <div className="bg-white p-6 rounded-lg w-[95%] max-w-md">

      <Receipt
        receiptNo={lastReceiptNo}
        cart={lastSaleItems}
        total={lastTotal}
        paymentMethod={paymentMethod}
      />

      <button
  onClick={() => {

    const printContents =
      document.getElementById(
        "receipt-content"
      )?.innerHTML;

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=400,height=800"
      );

    if (
      printWindow &&
      printContents
    ) {

      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>

            <style>
              body{
                font-family: monospace;
                padding:10px;
              }

              h2,h3,p{
                text-align:center;
              }

              table{
                width:100%;
              }

              td{
                padding:3px;
              }
            </style>

          </head>

          <body>

            ${printContents}

          </body>

        </html>
      `);

      printWindow.document.close();

      printWindow.print();
    }

  }}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
      >
        Print Receipt
      </button>

      <button
        onClick={() => setShowReceipt(false)}
        className="mt-2 w-full bg-gray-300 py-2 rounded"
      >
        Close
      </button>

    </div>

  </div>
)}
    </div>
    </PermissionGuard>
  );
}