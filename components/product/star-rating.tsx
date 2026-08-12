'use client';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StarRating({
  value,
  onChange,
  size = 18,
  readOnly = false,
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={cn(!readOnly && 'cursor-pointer')}
        >
          <Star
            size={size}
            className={cn(star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300')}
          />
        </button>
      ))}
    </div>
  );
}
