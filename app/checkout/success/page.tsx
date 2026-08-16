'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function CheckoutSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('orderId');
  const orderNumber = params.get('orderNumber');

  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center py-12">
      <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
      <h1 className="mb-2 text-2xl font-bold">Payment Complete</h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        {orderNumber
          ? `Thanks for your order! Order ${orderNumber} has been placed and payment has been received.`
          : "Thanks for your order! We're confirming your payment now — check your order status for the latest update."}
      </p>
      <Button asChild>
        <Link href={orderId ? `/orders/${orderId}` : '/orders'}>View My Orders</Link>
      </Button>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
