"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Election = {
  id: string | number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
};

export default function ElectionsList() {
  const [elections, setElections] = useState<Election[]>([]);

  useEffect(() => {
    fetch("/api/elections/list")
      .then((res) => res.json())
      .then((data) => setElections(data.elections || []));
  }, []);

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Available Elections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {elections.map((e: Election) => (
          <Card key={e.id}>
            <CardHeader>
              <CardTitle>{e.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{e.description}</p>
              <p className="text-sm mt-2 text-gray-500">
                {new Date(e.startDate).toLocaleDateString()} →{" "}
                {new Date(e.endDate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
