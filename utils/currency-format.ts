export function formatCurrency(amount: number, currency = "NPR") {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}
