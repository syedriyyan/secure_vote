"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("VOTER");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: role,
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success("Registration successful! Please login.");
        router.push("/login");
      } else {
        let message = "Registration failed";
        try {
          const data = await res.json();
          message = data.error || message;
        } catch {
          // ignore JSON parse errors
        }
        toast.error(message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to register";
      toast.error(`Request error: ${message}. Check API and database config.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen w-full bg-gray-50">
      <div className="w-full max-w-md px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <Card className="shadow-lg border rounded-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-center text-xl sm:text-2xl font-semibold text-gray-900">
              Register for SecureVote
            </CardTitle>
            <p className="text-center text-sm text-gray-600">
              Create your account to start voting
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="h-10 sm:h-11"
                  required
                />
              </div>
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
                  placeholder="Enter your email"
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
                  placeholder="Create a password"
                  className="h-10 sm:h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Role
                </Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="h-10 sm:h-11">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VOTER">Voter</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full h-10 sm:h-11 text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Register"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-primary hover:underline transition-colors"
              >
                Login here
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
