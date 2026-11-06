"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Receipt from "./Receipt";


export default function POSPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
const [lastReceiptNo, setLastReceiptNo] = useState("");
const [lastSaleItems, setLastSaleItems] = useState<any[]>([]);
const [lastTotal, setLastTotal] = useState(0);

 useEffect(() => {
  loadMenu();
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

  function generateReceiptNo() {
    return "RCP-" + Date.now();
  }

  async function completeSale() {

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  alert("User not logged in");
  return;
}

  if (cart.length === 0) {
    alert("Cart Empty");
    return;
  }

  try {

    const receiptNo = generateReceiptNo();

    // Save Sale Header

    const { data: sale, error: saleError } =
      await supabase
        .from("sales")
        .insert({
  cashier_id: user.id,
  receipt_number: receiptNo,
  payment_method: paymentMethod,
  total: total,
})
        .select()
        .single();

    if (saleError) {
      console.error(saleError);
      alert("Failed to save sale");
      return;
    }

    // Save Sale Items

    const saleItems = cart.map((item) => ({
      sale_id: sale.id,
      menu_item_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.quantity * item.price,
    }));

    const { error: itemError } =
      await supabase
        .from("sale_items")
        .insert(saleItems);

    if (itemError) {
      console.error(itemError);
      alert("Failed to save items");
      return;
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

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="grid grid-cols-3 gap-4 h-screen p-4">

      {/* PRODUCTS */}

      <div className="col-span-2">

        <h1 className="text-3xl font-bold mb-4">
          Hotel POS
        </h1>

        <div className="grid grid-cols-3 gap-4">

          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700"
            >
              <div className="text-xl font-bold">
                {item.name}
              </div>

              <div>
                KES {item.selling_price}
              </div>
            </button>
          ))}

        </div>

      </div>

      {/* CART */}

      <div className="bg-white border rounded-xl p-4">

        <h2 className="text-2xl font-bold mb-4">
          Cart
        </h2>

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

            <div className="flex gap-2 mt-2 items-center">

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
          className="border p-2 w-full mb-4 rounded"
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
          className="w-full mt-4 bg-green-600 text-white py-4 rounded-lg text-lg font-bold"
        >
          COMPLETE SALE
        </button>

      </div>
{showReceipt && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

    <div className="bg-white p-6 rounded-lg">

      <Receipt
        receiptNo={lastReceiptNo}
        cart={lastSaleItems}
        total={lastTotal}
        paymentMethod={paymentMethod}
      />

      <button
        onClick={() => window.print()}
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
  );
}