"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signUp } from "@/lib/auth/actions";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/Logo";

function PageWrapper({ children }: { children: React.ReactNode }) {
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
        {children}
      </div>
    </div>
  );
}

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signUp({ email, password, fullName });
      setSignupSuccess(true);
      toast.success("Account created! Check your email to verify.");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      toast.error("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setResendingEmail(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;
      toast.success("Verification email sent! Check your inbox.");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend email");
    } finally {
      setResendingEmail(false);
    }
  };

  // Show success state after signup
  if (signupSuccess) {
    return (
      <PageWrapper>
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-fade-in-up">
          <CardHeader className="space-y-1 flex flex-col items-center pb-4">
            <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-2">
              <CheckCircle2 className="h-9 w-9 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-display font-bold text-center tracking-tight">Check your email</CardTitle>
            <CardDescription className="text-center text-gray-500">
              We've sent a verification link to
            </CardDescription>
          </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <Mail className="h-7 w-7 mx-auto mb-2 text-gray-400" />
            <p className="font-medium text-gray-900">{email}</p>
          </div>

          <div className="space-y-3">
            <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-900 font-medium mb-2">What's next?</p>
              <ol className="text-sm text-blue-800/80 space-y-1.5 list-decimal list-inside">
                <li>Open your email inbox</li>
                <li>Click the verification link we sent you</li>
                <li>You'll be redirected back to log in</li>
              </ol>
            </div>

            <Alert className="border-gray-200">
              <AlertDescription className="text-xs text-gray-500">
                <strong className="text-gray-700">Can't find the email?</strong> Check your spam folder or click below to resend it.
              </AlertDescription>
            </Alert>
          </div>

          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11"
              onClick={handleResendEmail}
              disabled={resendingEmail}
            >
              {resendingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend verification email"
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => router.push("/login")}
            >
              Back to login
            </Button>
          </div>

          <p className="text-xs text-center text-gray-400 mt-4">
            Already verified? <Link href="/login" className="text-[#2563EB] hover:text-[#1d4ed8] transition-colors font-medium">Sign in here</Link>
          </p>
        </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-fade-in-up">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-3xl font-display font-bold text-center tracking-tight">Create an account</CardTitle>
          <CardDescription className="text-center text-gray-500">Enter your details to get started</CardDescription>
        </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="h-11 bg-white border-gray-200 focus:border-[#2563EB] transition-colors"
            />
          </div>
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
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-11 bg-white border-gray-200 focus:border-[#2563EB] transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="h-11 bg-white border-gray-200 focus:border-[#2563EB] transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-[#2563EB] hover:text-[#1d4ed8] transition-colors font-semibold">
            Sign in
          </Link>
        </div>
      </CardContent>
      </Card>
    </PageWrapper>
  );
}
