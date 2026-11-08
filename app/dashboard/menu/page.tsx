"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/adminGuard";
import PermissionGuard from "@/components/PermissionGuard";

export default function MenuPage() {
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);

  const [menuItems, setMenuItems] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [editingId, setEditingId] =
    useState<string | null>(null);
    const [categories, setCategories] =
  useState<any[]>([]);

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

    loadMenuItems();
    loadCategories();
  }

async function loadCategories() {
  const { data } =
    await supabase
      .from("menu_categories")
      .select("*")
      .eq("active", true)
      .order("name");

  setCategories(data || []);
}

  async function loadMenuItems() {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("name");

    if (error) {
      console.error(error);
      return;
    }

    setMenuItems(data || []);
  }

  async function saveMenuItem() {
    if (
  !name ||
  !category ||
  !sellingPrice ||
  !costPrice
) {
      alert("Fill all fields");
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("menu_items")
        .update({
          name,
          category,
          selling_price:
            Number(sellingPrice),
          cost_price:
            Number(costPrice),
        })
        .eq("id", editingId);

      if (error) {
        console.error(error);
        alert("Update failed");
        return;
      }

      alert("Menu Updated");
    } else {
      const { error } = await supabase
        .from("menu_items")
        .insert({
  name,
  category,
  selling_price:
    Number(sellingPrice),

  cost_price:
    Number(costPrice),

  active: true,
});

      if (error) {
        console.error(error);
        alert("Save failed");
        return;
      }

      alert("Menu Saved");
    }

    clearForm();

    loadMenuItems();
  }

  async function deleteItem(id: string) {
    const confirmed = confirm(
      "Delete this menu item?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Delete failed");
      return;
    }

    loadMenuItems();
  }

  function editItem(item: any) {
    setEditingId(item.id);

setCostPrice(
  item.cost_price?.toString() || ""
);

    setName(item.name);

    setCategory(item.category);

    setSellingPrice(
      item.selling_price.toString()
    );
  }

  function clearForm() {
    setEditingId(null);

    setName("");
    setCategory("");
    setSellingPrice("");
    setCostPrice("");
  }

  if (!allowed) {
    return (
      <div>
        Checking Access...
      </div>
    );
  }

  return (
    <PermissionGuard permission="menu">
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Menu Management
      </h1>

      <div className="bg-white p-4 rounded-lg border mb-6">

        <div className="grid grid-cols-4 gap-4">

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Menu Name"
            className="border p-2 rounded"
          />

          <select
  value={category}
  onChange={(e) =>
    setCategory(
      e.target.value
    )
  }
  className="border p-2 rounded"
>

  <option value="">
    Select Category
  </option>

  {categories.map(
    (cat) => (

      <option
        key={cat.id}
        value={cat.name}
      >
        {cat.name}
      </option>

    )
  )}

</select>

          <input
            type="number"
            value={sellingPrice}
            onChange={(e) =>
              setSellingPrice(
                e.target.value
              )
            }
            placeholder="Selling Price"
            className="border p-2 rounded"
          />

          <input
  type="number"
  value={costPrice}
  onChange={(e) =>
    setCostPrice(
      e.target.value
    )
  }
  placeholder="Cost Price"
  className="border p-2 rounded"
/>

        </div>

        <div className="flex gap-2 mt-4">

          <button
            onClick={saveMenuItem}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {editingId
              ? "Update Menu"
              : "Save Menu"}
          </button>

          <button
            onClick={clearForm}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Clear
          </button>

        </div>

      </div>

      <div className="bg-white border rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">
                Name
              </th>

              <th className="p-3 text-left">
                Category
              </th>

              <th className="p-3 text-left">
                Price
              </th>
 <th className="p-3 text-left">
  Cost
</th>

<th className="p-3 text-left">
  Margin
</th>
              <th className="p-3 text-left">
                Actions
              </th>

             

            </tr>

          </thead>

          <tbody>

            {menuItems.map((item) => (

              <tr
                key={item.id}
                className="border-t"
              >

                <td className="p-3">
                  {item.name}
                </td>

                <td className="p-3">
                  {item.category}
                </td>

                <td className="p-3">
                  KES {item.selling_price}
                </td>

                 <td className="p-3">
  KES {item.cost_price}
</td>

<td className="p-3">
  KES {
    item.selling_price -
    item.cost_price
  }
</td>

                <td className="p-3 flex gap-2">

                  <button
                    onClick={() =>
                      editItem(item)
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteItem(item.id)
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

    </div>
    </PermissionGuard>
  );
}