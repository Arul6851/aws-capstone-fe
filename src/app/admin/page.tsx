"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Admin = () => {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("rollno") == null) {
      router.push("/");
    } else if (Number(localStorage.getItem("type")) === 0) {
      router.push("/home");
    }
  }, []);

  return (
    <div className="flex m-10 flex-row flex-wrap gap-6 items-center justify-center">
      {[
        ["Exam Fee", "Click to view exam fee details"],
        ["Tuition Fee", "Click to view tuition fee details"],
        ["Change Semester", "Click to change semester"],
        ["Add Student", "Click to add student"],
        ["Modify Details", "Click to modify student details"],
        ["View Transactions", "Click to view transaction details"],
      ].map((feeType, index) => (
        <div key={index} className="card w-96 bg-base-100 shadow-xl rounded-xl">
          <div className="card-body p-6">
            <h2 className="card-title text-lg font-semibold">{`${feeType[0]}`}</h2>
            <p className="text-sm">{feeType[1]}</p>
            <div className="card-actions justify-end mt-4">
              <Link
                href={`/admin/${feeType[0].replace(/\s/g, "").toLowerCase()}`}
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

export default Admin;
