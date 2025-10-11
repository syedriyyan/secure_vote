"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VoterDashboard() {
  const activeElections = [
    { id: 1, name: "Presidential Election 2025", status: "Open" },
    { id: 2, name: "State Assembly 2025", status: "Upcoming" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold mb-6">Voter Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activeElections.map((election) => (
          <Card key={election.id}>
            <CardHeader>
              <CardTitle>{election.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">Status: {election.status}</p>
              <Button className="w-full" disabled={election.status !== "Open"}>
                {election.status === "Open" ? "Vote Now" : "Not Available"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
