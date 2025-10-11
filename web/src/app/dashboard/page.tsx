"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Voter Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Elections</CardTitle>
          </CardHeader>
          <CardContent>No elections yet.</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Vote History</CardTitle>
          </CardHeader>
          <CardContent>None yet.</CardContent>
        </Card>
      </div>
    </div>
  );
}
