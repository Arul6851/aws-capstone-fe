import { ExamTransactionProps, TuitionTransactionProps } from "@/types/fees";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ExamTransactionList() {
  const [transactions, setTransactions] = useState<ExamTransactionProps[]>([]);
  const [load, setLoad] = useState(true);
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
  useEffect(() => {
    setLoad(false);
    const fetchTransactionData = async () => {
      await axios
        .get(process.env.NEXT_PUBLIC_BACKEND_URL + "/transaction/fetchexam", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((results) => {
          console.log("dat", results.data);
          setTransactions(results.data.transactions);
          setTimeout(() => {
            setLoad(false);
          }, 2000);
        })
        .catch((err) => {
          console.log(err.toString());
        });
    };
    fetchTransactionData();
    setLoad(false);
  }, []);
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center"></div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Transaction ID
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Fee Id
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Semester
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Updated At
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {transactions.map((transaction) => (
                  <tr key={transaction.clnt_txn_ref}>
                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                      TUT{transaction.clnt_txn_ref}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                      {transaction.feeid}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                      {transaction.semester}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {transaction.txn_amt}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {transaction.txn_msg}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {new Date(transaction.updatedAt).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm ">
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() =>
                          downloadTuitionSlip(transaction.clnt_txn_ref)
                        }
                      >
                        Download
                        {/* <span className="sr-only">, {transaction.id}</span> */}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
