import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(
  request: Request
) {

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (
    !supabaseUrl ||
    !serviceRoleKey
  ) {
    return NextResponse.json(
      {
        error:
          "Missing Supabase environment variables",
      },
      {
        status: 500,
      }
    );
  }

  const supabaseAdmin =
    createClient(
      supabaseUrl,
      serviceRoleKey
    );
  try {

    const {
      email,
      password,
      fullName,
      role,
    } = await request.json();

    const {
      data,
      error,
    } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (error) {

      return NextResponse.json(
        {
          error:
            error.message,
        },
        {
          status: 400,
        }
      );

    }

    await supabaseAdmin
      .from("users")
      .insert({
        auth_user_id:
          data.user.id,
        email,
        full_name:
          fullName,
        role,
      });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    return NextResponse.json(
      {
        error:
          "Failed to create user",
      },
      {
        status: 500,
      }
    );

  }
}