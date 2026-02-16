"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { requestPasswordReset } from "@/lib/auth/actions";
import { Logo } from "@/components/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
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
          {!success ? (
            <>
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-3xl font-display font-bold text-center tracking-tight">Reset your password</CardTitle>
                <CardDescription className="text-center text-gray-500">
                  Enter your email and we&apos;ll send you a link to reset your password
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
                      autoFocus
                      className="h-11 bg-white border-gray-200 focus:border-[#2563EB] transition-colors"
                    />
                  </div>
                  <Button type="submit" className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send reset link
                      </>
                    )}
                  </Button>
                </form>
                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="text-sm text-gray-500 hover:text-[#2563EB] transition-colors flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Back to sign in
                  </Link>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="space-y-1 flex flex-col items-center pb-4">
                <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-2">
                  <CheckCircle className="h-9 w-9 text-green-600" />
                </div>
                <CardTitle className="text-3xl font-display font-bold text-center tracking-tight">Check your email</CardTitle>
                <CardDescription className="text-center text-gray-500">
                  We&apos;ve sent a password reset link to <strong className="text-gray-700">{email}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-4">
                  <p className="text-sm text-blue-900 font-medium mb-2">What&apos;s next?</p>
                  <ol className="text-sm text-blue-800/80 space-y-1.5 list-decimal list-inside">
                    <li>Check your email inbox (and spam folder)</li>
                    <li>Click the reset link in the email</li>
                    <li>Set your new password</li>
                  </ol>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-500">
                    Didn&apos;t receive the email?
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSuccess(false);
                      setEmail("");
                    }}
                    className="w-full h-11"
                  >
                    Try again
                  </Button>
                </div>
                <div className="pt-2 text-center">
                  <Link
                    href="/login"
                    className="text-sm text-gray-500 hover:text-[#2563EB] transition-colors flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Back to sign in
                  </Link>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
