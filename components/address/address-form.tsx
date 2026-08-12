"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAddress, useUpdateAddress } from "@/hooks/use-addresses";
import type { Address } from "@/types/address.type";

export function AddressForm({
  address,
  onSuccess,
}: {
  address?: Address;
  onSuccess?: () => void;
}) {
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const [form, setForm] = useState({
    fullName: address?.fullName ?? "",
    country: address?.country ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "",
    postalCode: address?.postalCode ?? "",
    street: address?.street ?? "",
    isDefault: address?.isDefault ?? false,
  });

  const isPending = createAddress.isPending || updateAddress.isPending;

  function handleChange(field: keyof typeof form, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (address) {
      updateAddress.mutate({ id: address._id, payload: form }, { onSuccess });
    } else {
      createAddress.mutate(form, { onSuccess });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          required
          value={form.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="street">Street</Label>
          <Input
            id="street"
            required
            value={form.street}
            onChange={(e) => handleChange("street", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            required
            value={form.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            required
            value={form.state}
            onChange={(e) => handleChange("state", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal code</Label>
          <Input
            id="postalCode"
            required
            value={form.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          required
          value={form.country}
          onChange={(e) => handleChange("country", e.target.value)}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => handleChange("isDefault", e.target.checked)}
        />
        Set as default address
      </label>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Saving..." : address ? "Update Address" : "Save Address"}
      </Button>
    </form>
  );
}
