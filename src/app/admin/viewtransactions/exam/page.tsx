"use client";
import { TuitionTransactionProps } from "@/types/fees";
import axios from "axios";
import { useEffect, useState } from "react";

function Transactions() {
  const [transactions, setTransactions] = useState<TuitionTransactionProps[]>(
    []
  );
  const [filteredTransactions, setFilteredTransactions] = useState<
    TuitionTransactionProps[]
  >([]);
  const [load, setLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("rollno");
  const [statusFilter, setStatusFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  useEffect(() => {
    const fetchTransactionData = async () => {
      await axios
        .get(
          process.env.NEXT_PUBLIC_BACKEND_URL +
            "/transactionadmin/fetchallexam",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((results) => {
          setTransactions(results.data.tuitiontransactions);
          setFilteredTransactions(results.data.tuitiontransactions);
          setLoad(false);
        })
        .catch((err) => {
          console.log(err.toString());
          setLoad(false);
        });
    };
    fetchTransactionData();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [searchTerm, searchBy, statusFilter, yearFilter]);

  const filterTransactions = () => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter((transaction) =>
        searchBy === "rollno"
          ? transaction.rollno.toLowerCase().includes(searchTerm.toLowerCase())
          : transaction.clnt_txn_ref.toString().includes(searchTerm)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (transaction) => transaction.txn_status === statusFilter
      );
    }
    setFilteredTransactions(filtered);
  };

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
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Exam Transactions
      </h1>
      <div className="sm:flex sm:items-center mb-4">
        <div className="sm:flex-auto">
          <input
            type="text"
            placeholder={
              searchBy == "rollno" ? "Enter Roll No" : "Enter Transaction ID"
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 mr-4"
          />
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            className="border p-2 mr-4"
          >
            <option value="rollno">Roll No</option>
            <option value="transactionId">Transaction ID</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 mr-4"
          >
            <option value="">All Statuses</option>
            <option value="0300">Success</option>
            <option value="0398">Initiated</option>
            <option value="0399">Failure</option>
            <option value="0396">Awaited</option>
            <option value="0392">Aborted</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flow-root">
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
                    Roll No
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
                    Fee Academic Year
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
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.clnt_txn_ref}>
                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                      TUT{transaction.clnt_txn_ref}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                      {transaction.rollno}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                      {transaction.feeid}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                      {transaction.academicYear}
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
                    <td className="whitespace-nowrap px-2 py-2 text-sm">
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() =>
                          downloadTuitionSlip(transaction.clnt_txn_ref)
                        }
                      >
                        Download
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

export default Transactions;
