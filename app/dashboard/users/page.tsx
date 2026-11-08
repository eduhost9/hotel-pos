"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


const permissionsList = [
  "pos",
  "menu",
  "sales",
  "stock",
  "expenses",
  "payroll",
  "analytics",
  "reports",
  "users",
  "categories",
  "kitchen",
  "profit",
  "reconciliation",
  "offline-queue",
  "my-sales",
];

export default function UsersPage() {
  const [users, setUsers] =
    useState<any[]>([]);

const [fullName, setFullName] =
  useState("");

const [email, setEmail] =
  useState("");

const [password, setPassword] =
  useState("");

const [role, setRole] =
  useState("cashier");

  useEffect(() => {
    loadUsers();
  }, []);

  async function createUser() {

  const response =
    await fetch(
      "/api/create-user",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email,
          password,
          fullName,
          role,
        }),
      }
    );

  const result =
    await response.json();

  if (result.error) {

    alert(
      result.error
    );

    return;
  }

  alert(
    "User Created"
  );

  setFullName("");
  setEmail("");
  setPassword("");

  loadUsers();
}

  async function loadUsers() {

    const { data } =
      await supabase
        .from("users")
        .select("*")
        .order("full_name");

    setUsers(data || []);
  }

  async function togglePermission(
    userId: string,
    permission: string,
    checked: boolean
  ) {

    if (checked) {

      await supabase
        .from("user_permissions")
        .insert({
          user_id: userId,
          permission,
        });

    } else {

      await supabase
        .from("user_permissions")
        .delete()
        .eq("user_id", userId)
        .eq(
          "permission",
          permission
        );

    }
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        User Permissions
      </h1>

<div className="bg-white border rounded-xl p-4 mb-6">

  <h2 className="text-xl font-bold mb-4">
    Create User
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

    <input
      value={fullName}
      onChange={(e) =>
        setFullName(e.target.value)
      }
      placeholder="Full Name"
      className="border p-2 rounded"
    />

    <input
      value={email}
      onChange={(e) =>
        setEmail(e.target.value)
      }
      placeholder="Email"
      className="border p-2 rounded"
    />

    <input
      type="password"
      value={password}
      onChange={(e) =>
        setPassword(e.target.value)
      }
      placeholder="Password"
      className="border p-2 rounded"
    />

    <select
      value={role}
      onChange={(e) =>
        setRole(e.target.value)
      }
      className="border p-2 rounded"
    >
      <option value="cashier">
        Cashier
      </option>

      <option value="admin">
        Admin
      </option>
    </select>

  </div>

  <button
    onClick={createUser}
    className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
  >
    Create User
  </button>

</div>


      <div className="space-y-6">

        {users.map((user) => (

          <div
            key={user.id}
            className="bg-white border rounded-xl p-4"
          >

            <div className="font-bold text-lg mb-3">
              {user.full_name}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

              {permissionsList.map(
                (permission) => (

                  <label
                    key={permission}
                    className="flex items-center gap-2"
                  >

                    <input
                      type="checkbox"
                      onChange={(e) =>
                        togglePermission(
                          user.id,
                          permission,
                          e.target.checked
                        )
                      }
                    />

                    {permission}

                  </label>

                )
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}