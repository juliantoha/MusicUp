"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signIn } from "@/lib/auth/actions";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user } = await signIn({ email, password });

      // Fetch user profile to determine redirect
      const supabase = createClient();
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      toast.success("Logged in successfully!");

      // Redirect based on role
      if (profile?.role === "super_admin") {
        router.push("/super");
      } else if (profile?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/performer");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
      toast.error("Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col relative">
      {/* Branded background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50/40 -z-10" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-[#2563EB]/5 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#06B6D4]/5 rounded-full blur-[100px] -z-10" />

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-lg border-b border-gray-200/40">
        <div className="container mx-auto px-4 py-3">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#EB6A18] to-[#c2410c] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg p-1.5">
              <Logo className="w-full h-full text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient-orange tracking-tight">MusicUp</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center p-4 pt-24">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-fade-in-up">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-3xl font-display font-bold text-center tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-center text-gray-500">Enter your credentials to sign in</CardDescription>
          </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-white border-gray-200 focus:border-[#2563EB] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#2563EB] hover:text-[#1d4ed8] transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-white border-gray-200 focus:border-[#2563EB] transition-colors"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#2563EB] hover:text-[#1d4ed8] transition-colors font-semibold">
              Sign up
            </Link>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
