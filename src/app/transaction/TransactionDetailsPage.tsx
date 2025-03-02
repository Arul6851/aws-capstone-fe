// app/transaction/TransactionDetailsPage.tsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Button } from "flowbite-react";

interface Transaction {
  clnt_txn_ref: number;
  rollno: string;
  txn_status: string;
  txn_msg?: string;
  txn_err_msg?: string;
  tpsl_bank_cd?: string;
  tpsl_txn_id?: string;
  txn_amt?: string;
  clnt_rqst_meta?: string;
  tpsl_txn_time?: string;
  bal_amt?: string;
  card_id?: string;
  alias_name?: string;
  BankTransactionID?: string;
  mandate_reg_no?: string;
  token?: string;
  hash?: string;
  createdAt: string;
  updatedAt: string;
  academicYear: number;
  feeid: string;
}

function TransactionDetailsPage() {
  const searchParams = useSearchParams();
  const feeid = searchParams.get("feeid");
  console.log("feeid", feeid);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Rest of your component code remains exactly the same...
  // (Keep all the existing functionality from your original component)

  useEffect(() => {
    if (feeid) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/gettransactionsuccess?feeid=${feeid}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          console.log("response", response.data);
          setTransaction(response.data.transaction);
        })
        .catch((error) => {
          setError(
            error.response?.data?.message ||
              "Failed to fetch transaction details"
          );
        });
    }
  }, [feeid]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!transaction) {
    return <div>Loading...</div>;
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "0300":
        return { text: "Success", color: "text-green-500" };
      case "0398":
        return { text: "Initiated", color: "text-yellow-500" };
      case "0399":
        return { text: "Failed", color: "text-red-500" };
      case "0396":
        return { text: "Awaited", color: "text-blue-500" };
      case "0392":
        return { text: "Aborted", color: "text-gray-500" };
      default:
        return { text: "Unknown", color: "text-gray-700" };
    }
  };

  const { text: statusText, color: statusColor } = getStatusMessage(
    transaction.txn_status
  );

  async function downloadTuitionSlip(clnt_txn_ref: number) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/tuitionslip`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clnt_txn_ref }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate tuition slip");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `TUT${clnt_txn_ref}Receipt.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading tuition slip:", error);
    }
  }
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10 md:max-w-3xl">
      <h1 className="text-2xl font-bold text-center mb-6">
        Transaction Details
      </h1>
      <div className="space-y-4">
        <p className="flex gap-2">
          <strong className="block text-gray-700">
            Client Transaction Reference:
          </strong>
          <span className="block text-gray-900">
            {transaction.clnt_txn_ref}
          </span>
        </p>
        <p className="flex gap-2">
          <strong className="block text-gray-700">Roll Number:</strong>
          <span className="block text-gray-900">{transaction.rollno}</span>
        </p>
        <p className="flex gap-2">
          <strong className="block text-gray-700">Academic Year:</strong>
          <span className="block text-gray-900">
            {transaction.academicYear}
          </span>
        </p>
        <p className="flex gap-2">
          <strong className="block text-gray-700">Transaction Status:</strong>
          <span className={`block ${statusColor} font-semibold`}>
            {statusText}
          </span>
        </p>
        <p className="flex gap-2">
          <strong className="block text-gray-700">Transaction Amount:</strong>
          <span className="block text-gray-900">
            {transaction.txn_amt || "N/A"}
          </span>
        </p>
        <p className="flex gap-2">
          <strong className="block text-gray-700">Transaction Message:</strong>
          <span className="block text-gray-900">
            {transaction.txn_msg || "N/A"}
          </span>
        </p>
        {transaction.txn_err_msg !== "NA" && (
          <p className="flex gap-2">
            <strong className="block text-gray-700">
              Transaction Error Message:
            </strong>
            <span className="block text-gray-900">
              {transaction.txn_err_msg || "N/A"}
            </span>
          </p>
        )}
        <p className="flex gap-2">
          <strong className="block text-gray-700">
            TPSL Transaction Time:
          </strong>
          <span className="block text-gray-900">
            {transaction.tpsl_txn_time || "N/A"}
          </span>
        </p>
        <p className="flex gap-2">
          <strong className="block text-gray-700">Updated At:</strong>
          <span className="block text-gray-900">
            {new Date(transaction.updatedAt).toLocaleString()}
          </span>
        </p>
        <div className="flex items-center justify-center">
          <Button onClick={() => downloadTuitionSlip(transaction.clnt_txn_ref)}>
            Download receipt
          </Button>
        </div>
      </div>
    </div>
  );
}
export default TransactionDetailsPage;
