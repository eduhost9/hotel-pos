import { supabase } from "./supabase";

export async function hasPermission(
  permission: string
) {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  if (
    permission === "pos"
  ) {
    return true;
  }

  const { data: profile } =
    await supabase
      .from("users")
      .select("id")
      .eq(
        "auth_user_id",
        user.id
      )
      .single();

  if (!profile) return false;

  const {
    data: permissions,
  } = await supabase
    .from("user_permissions")
    .select("permission")
    .eq(
      "user_id",
      profile.id
    );

  return permissions?.some(
    (p) =>
      p.permission === permission
  );
}


export async function getUserPermissions() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: profile } =
    await supabase
      .from("users")
      .select("id")
      .eq(
        "auth_user_id",
        user.id
      )
      .single();

  if (!profile) return [];

  const {
    data: permissions,
  } = await supabase
    .from("user_permissions")
    .select("permission")
    .eq(
      "user_id",
      profile.id
    );

  return (
    permissions?.map(
      (p) => p.permission
    ) || []
  );
}