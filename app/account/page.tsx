"use client";
import { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/common/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/api/users";
import { getApiErrorMessage } from "@/api/client";
import { toast } from "sonner";

function AccountContent() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await usersApi.updateMe({
        name,
        phone: phone || undefined,
      });
      queryClient.setQueryData(["me"], updated);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="container max-w-lg py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-center">My Profile</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex ">Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email ?? ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10 digit number"
              />
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Link href="/account/addresses" className="text-primary hover:underline">
        Manage delivery addresses &rarr;
      </Link>
    </div>
  );
}

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  );
}
