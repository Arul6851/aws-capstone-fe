"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Exam = () => {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("rollno") == null) {
      router.push("/");
    } else if (Number(localStorage.getItem("type")) === 0) {
      router.push("/home");
    }
  }, []);

  const examOptions = [
    ["Set Exam Fee", "Click this card to set the exam fee", "setexam"],
    [
      "Access Details",
      "Click this card to access all database details",
      "details",
    ],
  ];

  return (
    <div className="flex m-10 flex-row flex-wrap gap-6 items-center justify-center">
      {examOptions.map((option, index) => (
        <div key={index} className="card w-96 bg-base-100 shadow-xl rounded-xl">
          <div className="card-body p-6">
            <h2 className="card-title text-lg font-semibold">{option[0]}</h2>
            <p className="text-sm">{option[1]}</p>
            <div className="card-actions justify-end mt-4">
              <Link
                href={`/admin/examfee/${option[2]}`}
                className="btn btn-primary rounded-lg transition duration-150 ease-in-out hover:bg-blue-600"
              >
                Access
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Exam;
