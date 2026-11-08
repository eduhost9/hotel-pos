"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PermissionGuard from "@/components/PermissionGuard";


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

  const [editingUserId,
setEditingUserId] =
  useState<string | null>(
    null
  );
const [userPermissions,
setUserPermissions] =
  useState<any>({});

  useEffect(() => {
    loadUsers();
    loadPermissions();
  }, []);

  async function createUser() {

    if (editingUserId) {

  await supabase
    .from("users")
    .update({
      full_name:
        fullName,
      email,
      role,
    })
    .eq(
      "id",
      editingUserId
    );

  alert(
    "User Updated"
  );

  setEditingUserId(
    null
  );

  setFullName("");
  setEmail("");
  setPassword("");

  loadUsers();

  return;
}

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

function editUser(
  user: any
) {

  setEditingUserId(
    user.id
  );

  setFullName(
    user.full_name || ""
  );

  setEmail(
    user.email || ""
  );

  setRole(
    user.role || "cashier"
  );
}

  async function loadUsers() {

    const { data } =
      await supabase
        .from("users")
        .select("*")
        .order("full_name");

    setUsers(data || []);
  }

  async function loadPermissions() {

  const { data } =
    await supabase
      .from("user_permissions")
      .select("*");

  const map: any = {};

  data?.forEach(
    (record) => {

      if (!map[record.user_id]) {
        map[record.user_id] = [];
      }

      map[record.user_id].push(
        record.permission
      );

    }
  );

  setUserPermissions(map);
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
    loadPermissions();
  }


  async function deactivateUser(
  id: string
) {

  await supabase
    .from("users")
    .update({
      active: false,
    })
    .eq("id", id);

  loadUsers();
}

async function activateUser(
  id: string
) {

  await supabase
    .from("users")
    .update({
      active: true,
    })
    .eq("id", id);

  loadUsers();
}

async function deleteUser(
  id: string
) {

  if (
    !confirm(
      "Delete user?"
    )
  ) {
    return;
  }

  await supabase
    .from("users")
    .delete()
    .eq("id", id);

  loadUsers();
}

async function resetPassword(
  email: string
) {

  const { error } =
    await supabase.auth.resetPasswordForEmail(
      email
    );

  if (error) {

    alert(
      error.message
    );

    return;
  }

  alert(
    "Password reset email sent"
  );
}

  return (
  <PermissionGuard permission="users">
    <div>

      <h1 className="text-3xl font-bold mb-6">
        User Permissions
      </h1>

<div className="bg-white border rounded-xl p-4 mb-6">

  <h2 className="text-xl font-bold mb-4">
    {
  editingUserId
    ? "Update User"
    : "Create User"
}
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
    {editingUserId ? "Update User" : "Create User"}
  </button>

</div>


      <div className="space-y-6">

        {users.map((user) => (

          <div
            key={user.id}
            className="bg-white border rounded-xl p-4"
          >

            <div className="mb-4">

  <div className="font-bold text-lg">
    {user.full_name}
  </div>

  <div className="text-sm text-gray-600">
    {user.email}
  </div>

  <div className="text-sm text-gray-600">
    Role: {user.role}
  </div>

  <div
    className={`text-sm font-semibold ${
      user.active === false
        ? "text-red-600"
        : "text-green-600"
    }`}
  >
    Status:
    {" "}
    {user.active === false
      ? "Inactive"
      : "Active"}
  </div>

</div>

<div className="flex flex-wrap gap-2 mb-4">

  <button
    onClick={() =>
      editUser(user)
    }
    className="bg-blue-600 text-white px-3 py-1 rounded"
  >
    Edit
  </button>

  {user.active === false ? (

  <button
    onClick={() =>
      activateUser(user.id)
    }
    className="bg-green-600 text-white px-3 py-1 rounded"
  >
    Activate
  </button>

) : (

  <button
    onClick={() =>
      deactivateUser(user.id)
    }
    className="bg-orange-600 text-white px-3 py-1 rounded"
  >
    Deactivate
  </button>

)}

  <button
    onClick={() =>
      resetPassword(
        user.email
      )
    }
    className="bg-green-600 text-white px-3 py-1 rounded"
  >
    Reset Password
  </button>

  <button
    onClick={() =>
      deleteUser(user.id)
    }
    className="bg-red-600 text-white px-3 py-1 rounded"
  >
    Delete
  </button>

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
  checked={
    userPermissions[user.id]?.includes(
      permission
    ) || false
  }
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
    </PermissionGuard>
  );
}