"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/student/loader";
import { Tabs1 } from "@/components/student/tabs1";
import { ExamFeeProps, TuitionFeeProps } from "@/types/fees";

const Home = () => {
  const navigate = useRouter();
  const [tuitionfee, settuitionfee] = useState<TuitionFeeProps[]>([]);
  const [examfee, setexamfee] = useState<ExamFeeProps[]>([]);
  const [exmload, setexmload] = useState(true);
  const [tuitionload, settuitionload] = useState(true);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    setLoad(true);
    setexmload(true);
    settuitionload(true);
    if (localStorage.getItem("rollno") == null) {
      navigate.push("/");
    } else if (localStorage.getItem("type") == "1") {
      navigate.push("/admin");
    } else {
      console.log(localStorage.getItem("token"));
      const fetchTuitionData = async () => {
        await axios
          .get(process.env.NEXT_PUBLIC_BACKEND_URL + "/fee/tuition", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((results) => {
            console.log("dat", results.data);

            settuitionfee(results.data.fee);
            setTimeout(() => {
              settuitionload(false);
            }, 2000);
          })
          .catch((err) => {
            console.log(err.toString());
          });
      };
      const fetchExamData = async () => {
        await axios
          .get(process.env.NEXT_PUBLIC_BACKEND_URL + "/fee/exam", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((results) => {
            console.log("dat", results.data);

            setexamfee(results.data.fee);
            setTimeout(() => {
              setexmload(false);
            }, 2000);
          })
          .catch((err) => {
            console.log(err.toString());
          });
      };
      fetchTuitionData();
      fetchExamData();
    }
  }, []);
  useEffect(() => {
    if (!tuitionload && !exmload) {
      setLoad(false);
    }
  }, [tuitionload, exmload]);

  return (
    <>
      {load ? <Loader /> : <Tabs1 tuitionfee={tuitionfee} examfee={examfee} />}
    </>
  );
};

export default Home;
