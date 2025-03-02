// app/payment/PaymentPage.tsx
"use client";
import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import axios from "axios";
import Loader from "../../components/student/loader";
import PaymentComponent from "@/components/student/PaymentComponent";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

// Your interfaces/types here
interface Student {
  rollno: string;
  name?: string;
  dept?: string;
}

interface MinFee {
  fee: {
    tuition: number;
    development: number;
    placement: number;
    others: number;
    exam: number;
    arrear: number;
    academic: string;
    semester: string;
  };
  type: string;
}

export default function PaymentPage() {
  const [student, setStudent] = useState<{
    rollno: string;
    name?: string;
    dept?: string;
  }>({ rollno: "", name: "", dept: "" });
  const [minFee, setMinFee] = useState<{
    fee: {
      tuition: number;
      development: number;
      placement: number;
      others: number;
      exam: number;
      arrear: number;
      academic: string;
      semester: string;
    };
    type: string;
  } | null>(null);
  const [type, setType] = useState("no");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentloading, setPaymentLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [txnId, setTxnId] = useState("");

  const searchParams = useSearchParams();
  const feeId = searchParams.get("feeId");

  useEffect(() => {
    if (minFee && type) {
      if (type === "Annual Fee") {
        setTotal(
          minFee.fee.tuition +
            minFee.fee.development +
            minFee.fee.placement +
            minFee.fee.others
        );
      } else {
        setTotal(minFee.fee.exam + minFee.fee.arrear + minFee.fee.others);
      }
    }
  }, [minFee, type]);

  useEffect(() => {
    setLoading(true);
    const query = async () => {
      try {
        const studentRes = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/user",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStudent(studentRes.data.student);

        const feeRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/fee/${feeId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMinFee(feeRes.data.record);
        setType(feeRes.data.record.type);
      } catch (err) {
        console.error(err);
      }
    };
    query();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [feeId]);

  const initiateTuitionPayment = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/initiateTuitionPayment`,
        {
          id: feeId,
          amount: total,
          rollno: student.rollno,
          academicYear: minFee ? minFee.fee.academic : "",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const generatedTxnId = response.data.transaction.clnt_txn_ref;
      console.log("Generated txn id:", generatedTxnId);
      setTxnId(generatedTxnId);
    } catch (error: any) {
      console.error("Error initiating tuition payment:", error);
    }
  };
  const handleClick = async () => {
    await initiateTuitionPayment();
    setOpenModal(true);
    // setLoading(false);
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      {!paymentloading ? (
        <div className="container mt-24 px-10 py-36 rounded-lg bg-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {type === "Annual Fee" ? (
              <>
                <Modal
                  show={openModal}
                  size="md"
                  onClose={() => setOpenModal(false)}
                  popup
                >
                  <Modal.Header />
                  <Modal.Body>
                    <div className="text-center">
                      <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                      <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        You are about to be redirected for transaction, Dont
                        close this page.
                      </h3>
                      <div className="flex justify-center gap-4 mx-6">
                        <PaymentComponent
                          total={total}
                          consumerId={student.rollno}
                          txnId={txnId}
                        />
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
                <div className="product-details mr-2">
                  <h6 className="mb-0 text-2xl font-bold">
                    Annual Fee Payment Details
                  </h6>
                  <div className="flex justify-between text-xl">
                    <span>
                      Fee for academic year:{" "}
                      <span className="font-bold">
                        {minFee ? minFee.fee.academic : "Loading.."}
                      </span>
                    </span>
                  </div>
                  {/* Other fee details */}
                </div>
              </>
            ) : (
              <div className="product-details mr-2">
                <h6 className="mb-0 text-2xl font-bold">
                  Exam Fee Payment Details
                </h6>
                <div className="flex justify-between text-xl">
                  <span>
                    Exam Fee for Semester:{" "}
                    <span className="font-bold">
                      {minFee ? minFee.fee.semester : "Loading.."}
                    </span>
                  </span>
                </div>
                {/* Other fee details */}
              </div>
            )}
            <div className="payment-info">
              <div className="flex justify-between items-center">
                <span className="text-xl">
                  Student Name :{" "}
                  <span className="font-bold">
                    {student.name || "Loading.."}
                  </span>
                </span>
              </div>
              <span className="type block mb-1 text-xl">
                Roll No :{" "}
                <span className="font-bold">
                  {student.rollno || "Loading.."}
                </span>
              </span>
              <div>
                <label className="credit-card-label text-xl">
                  Department :{" "}
                  <span className="font-bold">
                    {student.dept || "Loading.."}
                  </span>
                </label>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between items-center mb-1">
                <span>Total</span>
                <span>Rs.{total}</span>
              </div>

              <button
                id="btnSubmit"
                onClick={handleClick}
                className="btn btn-primary btn-block d-flex justify-between mt-3 text-xl"
              >
                <span>₹{total}</span>
                <span>
                  Pay<i className="fas fa-long-arrow-alt-right ml-1"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div role="status" className="flex items-center justify-center">
            <svg
              aria-hidden="true"
              className="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-5 text-gray-600 text-xl font-bold text-center justify-center items-center">
            Please do not go back or close the window until the payment is
            completed.
          </p>
        </>
      )}
    </>
  );
}
