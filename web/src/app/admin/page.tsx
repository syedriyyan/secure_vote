"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [candidates, setCandidates] = useState([{ name: "", party: "" }]);
  const [message, setMessage] = useState("");

  async function createElection() {
    const res = await fetch("/api/elections/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        createdBy: "admin", // replace with logged-in admin later
        candidates,
      }),
    });
    const data = await res.json();
    setMessage(data.success ? "Election Created!" : data.error);
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create Election</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Election Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {candidates.map((c, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="Candidate Name"
                value={c.name}
                onChange={(e) => {
                  const newC = [...candidates];
                  newC[i].name = e.target.value;
                  setCandidates(newC);
                }}
              />
              <Input
                placeholder="Party"
                value={c.party}
                onChange={(e) => {
                  const newC = [...candidates];
                  newC[i].party = e.target.value;
                  setCandidates(newC);
                }}
              />
            </div>
          ))}

          <Button
            onClick={() =>
              setCandidates([...candidates, { name: "", party: "" }])
            }
          >
            + Add Candidate
          </Button>

          <Button onClick={createElection} className="w-full mt-4">
            Create Election
          </Button>

          {message && <p className="text-center text-sm mt-2">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
