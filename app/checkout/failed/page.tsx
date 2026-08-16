'use client';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutFailedPage() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center py-12">
      <XCircle className="mb-4 h-16 w-16 text-destructive" />
      <h1 className="mb-2 text-2xl font-bold">Payment Not Completed</h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        Your eSewa payment was cancelled or didn&apos;t go through, so no order
        was placed. Your cart is untouched — you can try again or pick Cash on
        Delivery instead.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/checkout">Back to Checkout</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/cart">View Cart</Link>
        </Button>
      </div>
    </div>
  );
}
