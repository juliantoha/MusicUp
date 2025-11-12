import { createClient } from "@/lib/supabase/client";

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export async function signUp({ email, password, fullName }: SignUpData) {
  const supabase = createClient();

  // Sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error("Failed to create user");
  }

  // Profile is automatically created by database trigger
  // Update full_name after signup
  if (fullName) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", authData.user.id);

    if (updateError) {
      console.error("Error updating profile name:", updateError);
      // Don't throw - profile was created, just name update failed
    }
  }

  return authData;
}

export async function signIn({ email, password }: SignInData) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function requestPasswordReset(email: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function updatePassword(newPassword: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
