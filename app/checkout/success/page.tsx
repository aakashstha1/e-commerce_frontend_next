'use client';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center py-12">
      <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
      <h1 className="mb-2 text-2xl font-bold">Payment Complete</h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        Thanks for your order! We&apos;re confirming your payment now — check your order status for the latest
        update.
      </p>
      <Button asChild>
        <Link href="/orders">View My Orders</Link>
      </Button>
    </div>
  );
}
