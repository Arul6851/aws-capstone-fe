import { TuitionFeeProps } from "@/types/fees";
import { use, useEffect, useState } from "react";
// import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { Spinner } from "flowbite-react";
import { useRouter } from "next/navigation";

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
  feesAll: TuitionFeeProps[];
}

export default function TuitionCardList(props: propptype) {
  const navigate = useRouter();
  const handlePayment = (id: string) => {
    console.log("id:", id);
    navigate.push(`/payment?feeId=${id}`);
  };
  const initalfees = props.feesAll.filter(
    (element) => element.enabled === 1 && element.paid === 0
  );
  const [fees, setFees] = useState<TuitionFeeProps[]>(initalfees);
  const [ViewPaid, setViewPaid] = useState<boolean>(false);
  useEffect(() => {
    console.log("infees", initalfees, "aaa", props.feesAll);
    if (ViewPaid) {
      setFees(
        props.feesAll.filter(
          (element) => element.enabled === 1 && element.paid === 1
        )
      );
    } else {
      setFees(
        props.feesAll.filter(
          (element) => element.enabled === 1 && element.paid === 0
        )
      );
    }
  }, [ViewPaid]);

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
                src={"/assets/tutionfee.png"}
                className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
              />
              <div className="text-xl font-medium leading-6 text-gray-900">
                Tuition Fee : {fee.academic}
              </div>
            </div>
            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-2 py-1">
                <dt className="text-gray-500">Tuition</dt>
                <dd className="text-gray-700">₹{fee.tuition}</dd>
              </div>
              <div className="flex justify-between gap-x-2 py-1">
                <dt className="text-gray-500">Development</dt>
                <dd className="text-gray-700">₹{fee.development}</dd>
              </div>
              <div className="flex justify-between gap-x-2 py-1">
                <dt className="text-gray-500">Placement</dt>
                <dd className="text-gray-700">₹{fee.placement}</dd>
              </div>
              <div className="flex justify-between gap-x-2 py-1">
                <dt className="text-gray-500">Others</dt>
                <dd className="text-gray-700">₹{fee.others}</dd>
              </div>
              <div className="flex justify-between gap-x-2 py-1">
                <dt className="text-gray-500">Total</dt>
                <dd className="text-gray-700">
                  ₹{fee.tuition + fee.development + fee.placement + fee.others}
                </dd>
              </div>
              <div className="flex justify-between gap-x-2 py-3">
                <dt className="text-gray-500">Status</dt>
                <dd className="text-gray-700">
                  <div
                    className={classNames(
                      statuses[
                        fee.paid == 1
                          ? "Paid"
                          : fee.enabled == 1
                          ? "Due"
                          : "NotOpen"
                      ],
                      "rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                    )}
                  >
                    {fee.paid == 1
                      ? "Paid"
                      : fee.enabled == 1
                      ? "Due"
                      : "NotOpen"}
                  </div>
                </dd>
              </div>
              <div className="flex justify-center gap-x-2 py-1">
                {fee.enabled == 1 && fee.paid == 0 ? (
                  <button onClick={() => handlePayment(fee.id)} className="btn">
                    Pay
                  </button>
                ) : fee.enabled == 1 && fee.paid == 1 ? (
                  <button
                    onClick={() =>
                      navigate.push(`/transaction?feeid=${fee.id}`)
                    }
                    className="btn"
                  >
                    View Transaction
                  </button>
                ) : (
                  <button
                    // onClick={() => handlePayment(props.id)}
                    className="btn"
                    disabled={true}
                  >
                    Pay
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
