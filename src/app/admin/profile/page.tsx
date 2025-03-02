"use client";
import { useEffect, useState } from "react";
import Loader from "@/components/student/loader";
import axios from "axios";
interface profileprops {
  name: string;
  rollno: string;
  dept: string;
  quota: string;
  designation: string;
}
const Profile = () => {
  const [student, setStudent] = useState<profileprops>();
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      console.log("usertype:", localStorage.getItem("type"));
      if (localStorage.getItem("type") == "0") {
        await axios
          .get(process.env.NEXT_PUBLIC_BACKEND_URL + "/user", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((results) => {
            setStudent(results.data.student);
            setLoad(false);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        await axios
          .get(process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/user", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((results) => {
            console.log(results.data.admin);
            setStudent(results.data.admin);
            setLoad(false);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    fetchData();
  }, []);

  const User = () => {
    return (
      <div className="flex flex-col items-center">
        <h1 className="text-2xl text-center text-accent">User Details</h1>
        <div className="flex flex-col items-center gap-4">
          <div className="grid grid-cols-2 items-center py-20 gap-x-4 gap-y-8">
            {localStorage.getItem("type") == "0" && (
              <>
                <div>Department</div>
                <div className="badge badge-outline py-3 px-4 rounded-md ">
                  {student ? student.dept : "Loading.."}
                </div>
                <div>Quota</div>
                <div className="badge badge-outline py-3 px-4 rounded-md ">
                  {student ? student.quota : "Loading.."}
                </div>
              </>
            )}
            <div>Name</div>
            <div className="badge badge-outline py-3 px-4 rounded-md ">
              {student ? student.name : "Loading.."}
            </div>
            <div>Roll No</div>
            <div className="badge badge-outline py-3 px-4 rounded-md ">
              {student ? student.rollno : "Loading.."}
            </div>
            {localStorage.getItem("type") == "1" && (
              <>
                <div>Designation</div>
                <div className="badge badge-outline py-3 px-4 rounded-md ">
                  {student ? student.designation : "Loading.."}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
  return <>{load ? <Loader /> : <User />}</>;
};

export default Profile;
