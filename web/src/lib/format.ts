const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

/** 7999 → "₹7,999"; 150000 → "₹1,50,000" (Indian digit grouping). */
export function formatInr(amount: number): string {
  return inr.format(amount);
}
