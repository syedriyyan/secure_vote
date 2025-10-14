"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      toast.success("Welcome back!");
      // Add a small delay to ensure cookie is set
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh(); // Force a refresh to update auth state
      }, 100);
    } else {
      toast.error(data.error || "Invalid credentials");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen w-full bg-gray-50">
      <div className="w-full max-w-md px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <Card className="shadow-lg border rounded-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-center text-xl sm:text-2xl font-semibold text-gray-900">
              Login to SecureVote
            </CardTitle>
            <p className="text-center text-sm text-gray-600">
              Welcome back! Please sign in to your account
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  className="h-10 sm:h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  className="h-10 sm:h-11"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full h-10 sm:h-11 text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="font-medium text-primary hover:underline transition-colors"
              >
                Register here
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
