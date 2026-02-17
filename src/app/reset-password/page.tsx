"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { updatePassword } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setValidSession(!!session);
    };
    checkSession();
  }, []);

  const validatePassword = () => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validatePassword()) return;

    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess(true);
      toast.success("Password updated successfully!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update password");
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  // Branded background wrapper
  const PageShell = ({ children }: { children: React.ReactNode }) => (
    <div className="flex min-h-screen flex-col relative">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50/40 -z-10" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-[#2563EB]/5 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#06B6D4]/5 rounded-full blur-[100px] -z-10" />

      <nav aria-label="Reset password navigation" className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-lg border-b border-gray-200/40">
        <div className="container mx-auto px-4 py-3">
          <Link href="/" aria-label="Back to MusicUp home" className="flex items-center gap-2 group w-fit">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#EB6A18] to-[#c2410c] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg p-1.5">
              <Logo className="w-full h-full text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient-orange tracking-tight">MusicUp</span>
          </Link>
        </div>
      </nav>

      <div className="flex flex-1 items-center justify-center p-4 pt-24">
        {children}
      </div>
    </div>
  );

  if (validSession === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center">
            <Logo className="w-full h-full text-primary" animate />
          </div>
          <p className="mt-4 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (validSession === false) {
    return (
      <PageShell>
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-fade-in-up">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-3xl font-display font-bold text-center text-red-600 tracking-tight">Invalid or Expired Link</CardTitle>
            <CardDescription className="text-center text-gray-500">
              This password reset link is invalid or has expired
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                Password reset links expire after a certain time for security reasons. Please request a new one.
              </AlertDescription>
            </Alert>
            <Button asChild className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all">
              <Link href="/forgot-password">Request new reset link</Link>
            </Button>
            <div className="text-center">
              <Link href="/login" className="text-sm text-gray-500 hover:text-[#2563EB] transition-colors">
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-fade-in-up">
        {!success ? (
          <>
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-3xl font-display font-bold text-center tracking-tight">Set new password</CardTitle>
              <CardDescription className="text-center text-gray-500">
                Enter your new password below
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoFocus
                      minLength={8}
                      autoComplete="new-password"
                      className="h-11 bg-white border-gray-200 focus:border-[#2563EB] transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">Must be at least 8 characters</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="h-11 bg-white border-gray-200 focus:border-[#2563EB] transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update password"
                  )}
                </Button>
              </form>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="space-y-1 flex flex-col items-center pb-4">
              <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-2">
                <CheckCircle className="h-9 w-9 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-display font-bold text-center tracking-tight">Password updated!</CardTitle>
              <CardDescription className="text-center text-gray-500">
                Your password has been successfully updated. Redirecting you to sign in...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all">
                <Link href="/login">Go to sign in</Link>
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </PageShell>
  );
}
