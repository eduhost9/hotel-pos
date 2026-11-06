"use client";

import { useEffect, useState } from "react";
import { getCurrentRole } from "@/lib/auth";

export default function TestRolePage() {
  const [role, setRole] = useState("");

  useEffect(() => {
    loadRole();
  }, []);

  async function loadRole() {
    const result = await getCurrentRole();

    setRole(result || "No Role");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Role Test
      </h1>

      <p className="mt-4">
        Current Role: {role}
      </p>
    </div>
  );
}