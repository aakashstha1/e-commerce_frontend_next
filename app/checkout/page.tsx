"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, Landmark, CreditCard, Wallet } from "lucide-react";
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
import { useCheckout } from "@/hooks/use-orders";
import { toast } from "sonner";
import { PaymentMethod } from "@/types/payment.type";
import { getApiErrorMessage } from "@/api/client";
import { paymentsApi } from "@/api/payments";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/currency-format";

const paymentOptions = [
  { value: PaymentMethod.COD, label: "Cash on Delivery", icon: Truck },
  { value: PaymentMethod.ESEWA, label: "eSewa", icon: Wallet },
  { value: PaymentMethod.KHALTI, label: "Khalti", icon: Landmark },
  { value: PaymentMethod.STRIPE, label: "Card (Stripe)", icon: CreditCard },
];

function CheckoutContent() {
  const router = useRouter();
  const { data: addresses } = useAddresses();
  const { data: cart } = useCart();
  const checkout = useCheckout();

  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  const [isPaying, setIsPaying] = useState(false);

  const defaultAddress = addresses?.find((a) => a.isDefault) ?? addresses?.[0];
  const activeAddressId = selectedAddressId || defaultAddress?._id || "";

  async function handlePlaceOrder() {
    if (!activeAddressId)
      return toast.error("Please select a delivery address");
    checkout.mutate(
      { addressId: activeAddressId },
      { onSuccess: (data) => setOrderId(data.order._id) },
    );
  }

  async function handlePay() {
    if (!orderId) return;
    setIsPaying(true);
    try {
      const result = await paymentsApi.initiate(orderId, method);
      if (method === PaymentMethod.ESEWA && result.deeplink) {
        window.location.href = result.deeplink;
        return;
      }
      toast.success("Order confirmed!");
      router.push(`/orders/${orderId}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsPaying(false);
    }
  }

  if (orderId) {
    return (
      <div className="container max-w-lg py-12">
        <Card>
          <CardHeader>
            <CardTitle>Choose a payment method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {paymentOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMethod(opt.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border p-4 text-sm",
                    method === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-input",
                  )}
                >
                  <opt.icon className="h-6 w-6" />
                  {opt.label}
                </button>
              ))}
            </div>
            <Button className="w-full" onClick={handlePay} disabled={isPaying}>
              {isPaying ? "Processing..." : "Confirm & Pay"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Delivery Address</h2>
            <Dialog
              open={addressDialogOpen}
              onOpenChange={setAddressDialogOpen}
            >
              <DialogTrigger>
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
              disabled={checkout.isPending || !activeAddressId}
            >
              {checkout.isPending ? "Placing order..." : "Place Order"}
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
