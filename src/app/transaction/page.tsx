// app/transaction/page.tsx
import { Suspense } from "react";
import TransactionDetailsPage from "./TransactionDetailsPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading transaction details...</div>}>
      <TransactionDetailsPage />
    </Suspense>
  );
}
