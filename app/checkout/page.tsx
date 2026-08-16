"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, Wallet } from "lucide-react";
import { ProtectedRoute } from "@/components/common/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddressForm } from "@/components/address/address-form";
import { useAddresses } from "@/hooks/use-addresses";
import { useCart } from "@/hooks/use-cart";
import { useCheckoutCod } from "@/hooks/use-orders";
import { toast } from "sonner";
import { PaymentMethod } from "@/types/payment.type";
import { getApiErrorMessage } from "@/api/client";
import { paymentsApi } from "@/api/payments";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/currency-format";

// Only methods actually wired up end-to-end. Add Stripe/Khalti here once
// their gateway integration exists.
const paymentOptions = [
  {
    value: PaymentMethod.COD,
    label: "Cash on Delivery",
    icon: Truck,
    description: "Pay in cash when your order arrives.",
  },
  {
    value: PaymentMethod.ESEWA,
    label: "eSewa",
    icon: Wallet,
    description: "Pay now via eSewa. You'll be redirected to eSewa to complete payment.",
  },
];

/** Builds a real hidden <form> and submits it, which is how eSewa's payment
 * page flow works (a signed POST, not a simple GET redirect). */
function submitToEsewa(action: string, fields: Record<string, string>) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
}

function CheckoutContent() {
  const router = useRouter();
  const { data: addresses } = useAddresses();
  const { data: cart } = useCart();
  const checkoutCod = useCheckoutCod();

  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  const [isPlacing, setIsPlacing] = useState(false);

  const defaultAddress = addresses?.find((a) => a.isDefault) ?? addresses?.[0];
  const activeAddressId = selectedAddressId || defaultAddress?._id || "";

  async function handlePlaceOrder() {
    if (!activeAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    if (method === PaymentMethod.COD) {
      checkoutCod.mutate(
        { addressId: activeAddressId },
        { onSuccess: (data) => router.push(`/orders/${data.order._id}`) },
      );
      return;
    }

    if (method === PaymentMethod.ESEWA) {
      setIsPlacing(true);
      try {
        const { action, fields } = await paymentsApi.initiateEsewa(activeAddressId);
        // The order is only created after eSewa confirms payment — this just
        // redirects the browser into eSewa's (test/dummy) payment page.
        submitToEsewa(action, fields);
      } catch (error) {
        toast.error(getApiErrorMessage(error));
        setIsPlacing(false);
      }
      return;
    }
  }

  const isPending = checkoutCod.isPending || isPlacing;

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Delivery Address</h2>
              <Dialog
                open={addressDialogOpen}
                onOpenChange={setAddressDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Add new address
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Address</DialogTitle>
                  </DialogHeader>
                  <AddressForm onSuccess={() => setAddressDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>

            {addresses && addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address._id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-lg border p-4",
                      activeAddressId === address._id
                        ? "border-primary bg-primary/5"
                        : "border-input",
                    )}
                  >
                    <input
                      type="radio"
                      name="address"
                      className="mt-1"
                      checked={activeAddressId === address._id}
                      onChange={() => setSelectedAddressId(address._id)}
                    />
                    <div>
                      <p className="font-medium">{address.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {address.street}, {address.city}, {address.state}{" "}
                        {address.postalCode}, {address.country}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No saved addresses yet — add one to continue.
              </p>
            )}
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold">Payment Method</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {paymentOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-4",
                    method === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-input",
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    className="mt-1"
                    checked={method === opt.value}
                    onChange={() => setMethod(opt.value)}
                  />
                  <div>
                    <div className="flex items-center gap-2 font-medium">
                      <opt.icon className="h-4 w-4" /> {opt.label}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {opt.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(cart?.subTotal ?? 0)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Final total (with shipping & tax) is shown after placing the
              order.
            </p>
            <Button
              className="w-full mt-4"
              onClick={handlePlaceOrder}
              disabled={isPending || !activeAddressId}
            >
              {isPending
                ? "Processing..."
                : method === PaymentMethod.ESEWA
                  ? "Pay with eSewa"
                  : "Place Order"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}
