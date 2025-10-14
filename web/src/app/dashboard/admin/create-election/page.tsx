"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWriteContract } from "wagmi";
import { votingContract } from "@/lib/contract";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateElectionPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const startDate = formData.get("start") as string;
    const endDate = formData.get("end") as string;

    // Convert dates to Unix timestamps
    const start = Math.floor(new Date(startDate).getTime() / 1000);
    const end = Math.floor(new Date(endDate).getTime() / 1000);

    // Validation
    if (start <= Math.floor(Date.now() / 1000)) {
      toast.error("Start time must be in the future");
      setLoading(false);
      return;
    }

    if (end <= start) {
      toast.error("End time must be after start time");
      setLoading(false);
      return;
    }

    try {
      toast.info("Creating election on blockchain...");

      writeContract({
        ...votingContract,
        functionName: "createElection",
        args: [name, "Election Description", BigInt(start), BigInt(end)],
      });

      toast.success("Election creation transaction submitted!");

      // Reset form
      (e.target as HTMLFormElement).reset();

      // Optionally redirect to elections list
      setTimeout(() => {
        router.push("/dashboard/admin");
      }, 2000);
    } catch (err: unknown) {
      console.error("Election creation error:", err);

      let errorMessage = "Failed to create election";
      if (err && typeof err === "object" && "message" in err) {
        errorMessage = (err as Error).message;
      }

      toast.error(errorMessage);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Create New Election</CardTitle>
          <p className="text-sm text-gray-600 text-center">
            Create a new election on the blockchain
          </p>
        </CardHeader>
        <CardContent>
          {!isConnected && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-3">
                Connect your wallet to create elections on the blockchain.
              </p>
              <ConnectButton />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Election Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter election title (e.g., General Election 2024)"
                required
                disabled={!isConnected}
              />
            </div>

            <div>
              <Label htmlFor="start">Start Date & Time</Label>
              <Input
                id="start"
                type="datetime-local"
                name="start"
                required
                disabled={!isConnected}
              />
            </div>

            <div>
              <Label htmlFor="end">End Date & Time</Label>
              <Input
                id="end"
                type="datetime-local"
                name="end"
                required
                disabled={!isConnected}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isConnected}
            >
              {loading
                ? "Creating Election..."
                : "Create Election on Blockchain"}
            </Button>

            {isConnected && (
              <p className="text-xs text-gray-500 text-center">
                This will create a transaction that requires gas fees
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
