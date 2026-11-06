import { supabase } from "./supabase";

export async function getCurrentRole() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();

  return data?.role || null;
}