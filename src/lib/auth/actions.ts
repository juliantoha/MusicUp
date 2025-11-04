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
  });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error("Failed to create user");
  }

  // Create profile with performer role
  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    email: authData.user.email,
    full_name: fullName,
    role: "performer",
  });

  if (profileError) {
    throw new Error(profileError.message);
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
