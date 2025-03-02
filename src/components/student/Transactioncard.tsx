import {
  CalendarDaysIcon,
  CreditCardIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import axios from "axios";
import { Button } from "flowbite-react";

interface Transactioncard {
  feename: string;
  amount: number;
  intentId: string;
  id: string;
  transactionId: string;
  status: boolean;
  rollno: string;
  timestamp: string;
  academic: string;
  semester: string;
  arrearCost: string;
  feeId: string;
}

export default function Transactioncard(props: Transactioncard) {
  const handleReceipt = async (id: string) => {
    console.log("adasdas", props);
    await axios
      .post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/payment/download",
        {
          feeId: id,
          rollno: localStorage.getItem("rollno"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        const { fileLink } = res.data;
        const link = document.createElement("a");
        link.href = fileLink;
        link.target = "_blank";
        link.setAttribute("download", "Receipt-" + id + ".pdf");
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    //feename,amount,intentId,id,transactionId,status,rollno,timestamp,
    <div className="lg:col-start-3 lg:row-end-1">
      <h2 className="sr-only">Summary</h2>
      <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
        <dl className="flex flex-wrap">
          <div className="flex-auto pl-6 pt-6">
            <dt className="text-sm font-semibold leading-6 text-gray-900">
              {props.transactionId.substring(0, 3) === "tut"
                ? "Annual Fee"
                : "Exam Fee"}
            </dt>
            <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">
              ₹{props.amount}
            </dd>
          </div>
          <div className="flex-none self-end px-6 pt-4">
            <dt className="sr-only">Status</dt>
            {props.status ? (
              <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                Success
              </dd>
            ) : (
              <dd className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                Failed
              </dd>
            )}
          </div>
          <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
            <dt className="flex-none">
              <span className="sr-only">{props.rollno}</span>
              <UserCircleIcon
                className="h-6 w-5 text-gray-400"
                aria-hidden="true"
              />
            </dt>
            <dd className="text-sm font-medium leading-6 text-gray-900">
              {props.rollno}
            </dd>
          </div>
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
            <dt className="flex-none">
              <span className="sr-only">Due date</span>
              <CalendarDaysIcon
                className="h-6 w-5 text-gray-400"
                aria-hidden="true"
              />
            </dt>
            <dd className="text-sm leading-6 text-gray-500">
              <time dateTime={props.timestamp}>{props.timestamp}</time>
            </dd>
          </div>
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
            <dt className="flex-none">
              <span className="sr-only">Due date</span>
              <span className="text-gray-400">TxnID:</span>
            </dt>
            <dd className="text-sm leading-6 text-gray-500">
              {props.transactionId}
            </dd>
          </div>
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
            <dt className="flex-none">
              <span className="sr-only">Due date</span>
              <span className="text-gray-400">Intent ID:</span>
            </dt>
            <dd className="text-sm leading-6 text-gray-500">
              {props.intentId}
            </dd>
          </div>
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
            <dt className="flex-none">
              <span className="sr-only">Due date</span>
              <span className="text-gray-400">Fee ID:</span>
            </dt>
            <dd className="text-sm leading-6 text-gray-500">{props.id}</dd>
          </div>
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
            <dt className="flex-none">
              <span className="sr-only">Status</span>
              <CreditCardIcon
                className="h-6 w-5 text-gray-400"
                aria-hidden="true"
              />
            </dt>
            <dd className="text-sm leading-6 text-gray-500">
              Paid with MasterCard
            </dd>
          </div>
        </dl>
        <div className="mt-6 border-t border-gray-900/5 px-6 py-6">
          <Button
            className=" cursor-pointer text-sm font-semibold leading-6 "
            onClick={() => handleReceipt(props.feeId)}
          >
            Download receipt <span aria-hidden="true">&rarr;</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
