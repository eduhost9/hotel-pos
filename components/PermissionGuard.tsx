"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  hasPermission,
} from "@/lib/permissions";

export default function PermissionGuard({
  permission,
  children,
}: {
  permission: string;
  children: React.ReactNode;
}) {

  const router =
    useRouter();

  const [loading, setLoading] =
    useState(true);

  const [allowed, setAllowed] =
    useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  async function checkPermission() {

  console.log(
    "Checking permission:",
    permission
  );

  const ok =
    await hasPermission(
      permission
    );

  console.log(
    "Permission result:",
    ok
  );

  if (!ok) {

    router.push(
      "/dashboard"
    );

    return;
  }

  setAllowed(true);
  setLoading(false);
}

  if (loading) {

    return (
      <div className="p-6">
        Checking Permission...
      </div>
    );

  }

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}