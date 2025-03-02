// app/payment/result/TransactionDetails.tsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

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

export default function TransactionDetails() {
  const searchParams = useSearchParams();
  const clnt_txn_ref = searchParams.get("clnt_ref_id");
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clnt_txn_ref) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/getTransactionDetails?clnt_txn_ref=${clnt_txn_ref}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          setTransaction(response.data.transaction);
        })
        .catch((error) => {
          setError(
            error.response?.data?.message ||
              "Failed to fetch transaction details"
          );
        });
    }
  }, [clnt_txn_ref]);

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
      </div>
    </div>
  );
}
