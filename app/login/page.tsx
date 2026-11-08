"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { db } from "@/lib/offline-db";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  async function login() {

      if (!navigator.onLine) {

    const offlineUser =
      await db.offlineUsers
        .where("email")
        .equals(email)
        .first();

    if (!offlineUser) {

      alert(
        "User not available offline. Login online at least once first."
      );

      return;
    }

    localStorage.setItem(
      "offlineUser",
      JSON.stringify(
        offlineUser
      )
    );

    router.push(
      "/dashboard"
    );

    return;
  }

  const { error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    alert(error.message);
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { data: profile } =
    await supabase
      .from("users")
      .select("*")
      .eq(
        "auth_user_id",
        user.id
      )
      .single();

  const { data: perms } =
    await supabase
      .from("user_permissions")
      .select("permission")
      .eq(
        "user_id",
        profile.id
      );

  await db.offlineUsers.clear();

  await db.offlineUsers.add({
    auth_user_id:
      user.id,

    email:
      profile.email,

    full_name:
      profile.full_name,

    role:
      profile.role,

    permissions:
      perms?.map(
        (p) => p.permission
      ) || [],
  });
const cachedUser = {
  auth_user_id:
    user.id,

  email:
    profile.email,

  full_name:
    profile.full_name,

  role:
    profile.role,

  permissions:
    perms?.map(
      (p) => p.permission
    ) || [],
};

localStorage.setItem(
  "offlineUser",
  JSON.stringify(
    cachedUser
  )
);
  router.push("/dashboard");
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 flex items-center justify-center p-4">

      <div className="grid md:grid-cols-2 w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl">

        {/* LEFT SIDE */}

        <div className="relative hidden md:flex">

          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
            alt="Hotel"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">

            <h1 className="text-5xl font-bold">
              CHOMA ZONE
            </h1>

            <h2 className="text-3xl mt-2">
              HOTEL POS
            </h2>

            <p className="mt-6 text-lg">
              Complete Hotel &
              Restaurant Management
              Platform
            </p>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="p-10 flex flex-col justify-center">

          <div className="mb-8">

            <h2 className="text-4xl font-bold text-white">
              Welcome Back
            </h2>

            <p className="text-green-100 mt-2">
              Sign in to continue
            </p>

          </div>

          <input
            className="w-full p-4 rounded-xl mb-4 bg-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            className="w-full p-4 rounded-xl mb-6 bg-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <button
            onClick={login}
            className="w-full py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white text-lg font-semibold transition-all"
          >
            Sign In
          </button>

          <div className="text-center text-green-100 mt-6">

            Hotel Management System

          </div>

        </div>

      </div>

    </div>
  );
}