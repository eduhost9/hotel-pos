"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CategoriesPage() {
  const [categories, setCategories] =
    useState<any[]>([]);

  const [name, setName] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const { data } = await supabase
      .from("menu_categories")
      .select("*")
      .order("name");

    setCategories(data || []);
  }

  async function saveCategory() {
    if (!name) return;

    if (editingId) {

      await supabase
        .from("menu_categories")
        .update({
          name,
        })
        .eq("id", editingId);

    } else {

      await supabase
        .from("menu_categories")
        .insert({
          name,
        });

    }

    setName("");
    setEditingId(null);

    loadCategories();
  }

  async function deleteCategory(
    id: string
  ) {
    if (
      !confirm(
        "Delete category?"
      )
    )
      return;

    await supabase
      .from("menu_categories")
      .delete()
      .eq("id", id);

    loadCategories();
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Categories
      </h1>

      <div className="flex gap-2 mb-6">

        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="border p-2 rounded"
          placeholder="Category Name"
        />

        <button
          onClick={saveCategory}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>

      </div>

      <table className="w-full border">

        <thead>

          <tr>
            <th className="p-2">
              Name
            </th>

            <th className="p-2">
              Actions
            </th>
          </tr>

        </thead>

        <tbody>

          {categories.map(
            (category) => (

              <tr
                key={category.id}
              >

                <td className="p-2">
                  {category.name}
                </td>

                <td className="p-2 flex gap-2">

                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                    onClick={() => {
                      setEditingId(
                        category.id
                      );

                      setName(
                        category.name
                      );
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() =>
                      deleteCategory(
                        category.id
                      )
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>
  );
}