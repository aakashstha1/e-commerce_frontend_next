"use client";
import { useState } from "react";
import { ProtectedRoute } from "@/components/common/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddressForm } from "@/components/address/address-form";
import { useAddresses, useDeleteAddress } from "@/hooks/use-addresses";
import { Address } from "@/types/address.type";

function AddressesContent() {
  const { data: addresses, isLoading } = useAddresses();
  const deleteAddress = useDeleteAddress();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();

  function openCreate() {
    setEditingAddress(undefined);
    setDialogOpen(true);
  }

  function openEdit(address: Address) {
    setEditingAddress(address);
    setDialogOpen(true);
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button onClick={openCreate}>Add Address</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add Address"}
              </DialogTitle>
            </DialogHeader>
            <AddressForm
              address={editingAddress}
              onSuccess={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : !addresses || addresses.length === 0 ? (
        <p className="text-muted-foreground">No addresses saved yet.</p>
      ) : (
        <div className="space-y-3">
          {addresses.map((address: Address) => (
            <Card key={address._id}>
              <CardContent className="flex items-start justify-between gap-4 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{address.fullName}</p>
                    {address.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {address.street}, {address.city}, {address.state}{" "}
                    {address.postalCode}, {address.country}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(address)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteAddress.mutate(address._id)}
                    disabled={deleteAddress.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AddressesPage() {
  return (
    <ProtectedRoute>
      <AddressesContent />
    </ProtectedRoute>
  );
}
