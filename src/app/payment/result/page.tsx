// app/payment/result/page.tsx
import { Suspense } from "react";
import TransactionDetails from "./TransactionDetails";

export default function ResultPage() {
  return (
    <Suspense fallback={<div>Loading transaction details...</div>}>
      <TransactionDetails />
    </Suspense>
  );
}
