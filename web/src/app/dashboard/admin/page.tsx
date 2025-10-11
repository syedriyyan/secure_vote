"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Election</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => router.push("/dashboard/admin/create-election")}
            >
              + New Election
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => router.push("/dashboard/admin/candidates")}
            >
              View Candidates
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>View Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => router.push("/dashboard/admin/results")}
            >
              Election Results
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
