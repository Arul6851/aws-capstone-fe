import { ExamFeeProps } from "@/types/fees";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
// import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"

const statuses = {
  Paid: "text-green-700 bg-green-50 ring-green-600/20",
  NotOpen: "text-gray-600 bg-gray-50 ring-gray-500/10",
  Due: "text-red-700 bg-red-50 ring-red-600/10",
};
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
interface propptype {
  feetype: string;
  feesAll: ExamFeeProps[];
}

export default function ExamCardList(props: propptype) {
  const [fees, setFees] = useState<ExamFeeProps[]>(
    props.feesAll.filter((element) => element.paid === 0)
  );
  const [ViewPaid, setViewPaid] = useState<boolean>(false);
  useEffect(() => {
    if (ViewPaid) {
      setFees(props.feesAll.filter((element) => element.paid === 1));
    } else {
      setFees(props.feesAll.filter((element) => element.paid === 0));
    }
  }, [ViewPaid]);

  // const navigate = useRouter();
  // const handlePayment = (id: string) => {
  //   console.log("id:", id);
  //   navigate.push(`/payment?feeId=${id}`);
  // };

  return fees.length === 0 ? (
    <>
      <div className="space-y-5">
        <div className="relative flex items-start p-5">
          <div className="flex h-6 items-center">
            <input
              id="comments"
              name="comments"
              type="checkbox"
              checked={ViewPaid}
              aria-describedby="comments-description"
              className="h-6 w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              onClick={() => setViewPaid(!ViewPaid)}
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label
              htmlFor="comments"
              className="font-bold text-gray-900 text-xl"
            >
              View Paid
            </label>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center h-96">
        <img src="/assets/done.svg" className="h-96 w-96" />
        <h1 className="text-lg">No {props.feetype} are Due</h1>
      </div>
    </>
  ) : (
    <>
      {" "}
      <div className="space-y-5">
        <div className="relative flex items-start p-5">
          <div className="flex h-6 items-center">
            <input
              id="comments"
              name="comments"
              type="checkbox"
              checked={ViewPaid}
              aria-describedby="comments-description"
              className="h-6 w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              onClick={() => setViewPaid(!ViewPaid)}
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label
              htmlFor="comments"
              className="font-bold text-gray-900 text-xl"
            >
              View Paid
            </label>
          </div>
        </div>
      </div>
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
      >
        {fees.map((fee) => (
          <li
            key={fee.id}
            className="overflow-hidden rounded-xl border border-gray-200"
          >
            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
              <img
                alt={fee.id}
                src={"/assets/examfee.png"}
                className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
              />
              <div className="text-xl font-medium leading-6 text-gray-900">
                Exam Fee : Semester {fee.semester}
              </div>
            </div>
            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-2 py-1">
                <dt className="text-gray-500">Exam Fee</dt>
                <dd className="text-gray-700">₹{fee.exam}</dd>
              </div>
              <div className="flex justify-between gap-x-2 py-1">
                <dt className="text-gray-500">Arrear Fee</dt>
                <dd className="text-gray-700">₹{fee.arrear}</dd>
              </div>
              <div className="flex justify-between gap-x-2 py-1">
                <dt className="text-gray-500">Others</dt>
                <dd className="text-gray-700">₹{fee.others}</dd>
              </div>
              <div className="flex justify-between gap-x-2 py-1">
                <dt className="text-gray-500">Total</dt>
                <dd className="text-gray-700">
                  ₹{fee.exam + fee.arrear + fee.others}
                </dd>
              </div>
              <div className="flex justify-between gap-x-2 py-3">
                <dt className="text-gray-500">Status</dt>
                <dd className="text-gray-700">
                  <div
                    className={classNames(
                      statuses[fee.paid == 1 ? "Paid" : "Due"],
                      "rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                    )}
                  >
                    {fee.paid == 1 ? "Paid" : "Due"}
                  </div>
                </dd>
              </div>
              <div className="flex justify-center gap-x-2 py-1">
                {fee.paid == 0 ? (
                  <button
                    onClick={() => console.log("Incomplete Function")}
                    className="btn"
                  >
                    Pay
                  </button>
                ) : (
                  <button
                    onClick={() => console.log("Incomplete Function")}
                    className="btn"
                  >
                    View Transaction
                  </button>
                )}
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
