"use client";
//todo sort not working
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../../../components/student/loader";
import xlsx from "json-as-xlsx";
import AdminTabsExam from "@/components/admin/adminTabsExam";
type filteroptions =
  | "all"
  | "paid"
  | "not paid"
  | "rollno"
  | "dept"
  | "academic"
  | "semester";
interface ExamFeeProps {
  rollno: string;
  regno: string;
  name: string;
  dept: string;
  year: string;
  semester: number;
  academic: string;
  exam: number;
  arrear: number;
  others: number;
  paiddate?: string;
  paid: number;
  id: string;
}
type sortoptions = "rollno" | "name" | "dept" | "paiddate";

const Details = () => {
  const [raw, setRaw] = useState<ExamFeeProps[]>([
    {
      rollno: "",
      regno: "",
      name: "",
      dept: "",
      year: "",
      semester: 0,
      academic: "",
      exam: 0,
      arrear: 0,
      others: 0,
      paiddate: "",
      paid: 0,
      id: "",
    },
  ]);
  const [details, setDetails] = useState<ExamFeeProps[]>([
    {
      rollno: "",
      regno: "",
      name: "",
      dept: "",
      year: "",
      semester: 0,
      academic: "",
      exam: 0,
      arrear: 0,
      others: 0,
      paiddate: "",
      paid: 0,
      id: "",
    },
  ]);
  const [load, setLoad] = useState(true);
  const [info, setInfo] = useState<filteroptions | undefined>();
  const [rollno, setRollno] = useState<string>();

  const sortItems = (option: sortoptions, rawdetails: ExamFeeProps[]) => {
    if (option === "rollno") {
      const detail = Object.keys(rawdetails)
        .sort((a, b) => {
          return rawdetails[parseInt(a)].rollno.localeCompare(
            rawdetails[parseInt(b)].rollno
          );
        })
        .map((k) => {
          return rawdetails[parseInt(k)];
        });
      setDetails(detail);
    } else if (option === "name") {
      const detail = Object.keys(rawdetails)
        .sort((a, b) => {
          return rawdetails[parseInt(a)].name.localeCompare(
            rawdetails[parseInt(b)].name
          );
        })
        .map((k) => {
          return rawdetails[parseInt(k)];
        });
      setDetails(detail);
    } else if (option === "dept") {
      const detail = Object.keys(rawdetails)
        .sort((a, b) => {
          return rawdetails[parseInt(a)].dept.localeCompare(
            rawdetails[parseInt(b)].dept
          );
        })
        .map((k) => {
          return rawdetails[parseInt(k)];
        });
      setDetails(detail);
    } else if (option === "paiddate") {
      const detail = Object.keys(rawdetails)
        .sort((a, b) => {
          return (
            rawdetails[parseInt(a)].paiddate?.localeCompare(
              rawdetails[parseInt(b)].paiddate ?? ""
            ) || 0
          );
        })
        .map((k) => {
          return rawdetails[parseInt(k)];
        });
      setDetails(detail);
    }
  };

  const filterItems = (option: filteroptions, rawdetails: ExamFeeProps[]) => {
    if (option === "all") {
      setInfo("all");
      setDetails(rawdetails);
    } else if (option === "paid") {
      setInfo("paid");
      const detail = Object.keys(rawdetails)
        .filter((k) => {
          return rawdetails[parseInt(k)].paid == 1;
        })
        .map((k) => {
          return rawdetails[parseInt(k)];
        });
      setDetails(detail);
    } else if (option === "not paid") {
      setInfo("not paid");
      const detail = Object.keys(rawdetails)
        .filter((k) => {
          return rawdetails[parseInt(k)].paid == 0;
        })
        .map((k) => {
          return rawdetails[parseInt(k)];
        });
      setDetails(detail);
    } else if (option === "rollno") {
      setInfo("rollno");
    } else if (option === "dept") {
      setInfo("dept");
    } else if (option === "academic") {
      setInfo("academic");
    }
  };
  const filterRollNo = (rollno: string, rawdetails: ExamFeeProps[]) => {
    const detail = Object.keys(rawdetails)
      .filter((k) => {
        return rawdetails[parseInt(k)].rollno.includes(rollno) ? true : false;
      })
      .map((k) => {
        return rawdetails[parseInt(k)];
      });
    setDetails(detail);
  };

  const filterDepartment = (
    department: Department,
    rawdetails: ExamFeeProps[]
  ) => {
    const detail = Object.keys(rawdetails)
      .filter((k) => {
        return rawdetails[parseInt(k)].dept.includes(department) ? true : false;
      })
      .map((k) => {
        return rawdetails[parseInt(k)];
      });
    setDetails(detail);
  };
  const filterSemester = (semester: number, rawdetails: ExamFeeProps[]) => {
    console.log(semester);
    const detail = Object.keys(rawdetails)
      .filter((k) => {
        return rawdetails[parseInt(k)].semester
          .toString()
          .includes(semester.toString())
          ? true
          : false;
        ``;
      })
      .map((k) => {
        return rawdetails[parseInt(k)];
      });
    setDetails(detail);
  };

  const filterAcademic = (year: number, rawdetails: ExamFeeProps[]) => {
    console.log("year", year);
    if (isNaN(year)) setDetails(rawdetails);
    else {
      const detail = Object.keys(rawdetails)
        .filter((k) => {
          return rawdetails[parseInt(k)].year
            .toString()
            .includes(year.toString())
            ? true
            : false;
        })
        .map((k) => {
          return rawdetails[parseInt(k)];
        });
      setDetails(detail);
    }
  };
  const handleSearch = (
    value: string | Department,
    rawdetails: ExamFeeProps[]
  ) => {
    if (info === "rollno" && typeof value === "string") {
      filterRollNo(value, rawdetails);
    } else if (info === "dept" && typeof value !== "string") {
      filterDepartment(value, rawdetails);
    } else if (info === "academic" && typeof value === "number") {
      filterAcademic(value, rawdetails);
    }
  };

  const handleViewDownload = (details: ExamFeeProps[]) => {
    const updateDetails = details.map((detail) => {
      let paiddate = "";
      if (detail.paid == 1 && detail.paiddate)
        paiddate = detail.paiddate.split("T")[0];
      return {
        rollno: detail.rollno,
        regno: detail.regno,
        name: detail.name,
        year: detail.year,
        sem: detail.semester,
        dept: detail.dept,
        exam: detail.exam,
        arrear: detail.arrear,
        others: detail.others,
        total: detail.exam + detail.arrear + detail.others,
        paid: detail.paid,
        paiddate,
      };
    });
    const data = [
      {
        sheet: "Admin View",
        columns: [
          { label: "Roll No", value: "rollno" },
          { label: "Reg No", value: "regno" },
          { label: "Name", value: "name" },
          { label: "Year", value: "year" },
          { label: "Department", value: "dept" },
          { label: "Semester", value: "sem" },
          { label: "Exam Fee", value: "exam" },
          { label: "Arrear Fee", value: "arrear" },
          { label: "Other Fee", value: "others" },
          { label: "Total Fee", value: "total" },
          { label: "Paid", value: "paid" },
          { label: "Paid Date", value: "paiddate" },
        ],
        content: updateDetails,
      },
    ];
    xlsx(data, { fileName: `ExamFee_AdminView_Filter` });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      await axios
        .get(process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/fetch/exam", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log(res.data.details);
          setRaw(res.data.details);
          setDetails(res.data.details);
          filterItems("all", res.data.raw);
          sortItems("rollno", res.data.details);
          setTimeout(() => {
            setLoad(false);
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
          setLoad(false);
        })
        .finally(() => {
          setLoad(false);
        });
    };
    fetchData();
    setRaw(details);
    setDetails(details);
    setLoad(false);
  }, []);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-accent text-3xl font-semibold mb-6">
        Database Details
      </h1>
      <div className=" flex items-center justify-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center mb-0 bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          {showFilters
            ? "Hide Filters & Sort Options"
            : "Show Filters & Sort Options"}
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={showFilters ? "M18 12H6" : "M6 9l6 6 6-6"}
            ></path>
          </svg>
        </button>
      </div>

      {showFilters && (
        <div className="bg-white-50 p-6 rounded-lg mb-8 transition-all duration-300">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-medium text-accent">Payment</h2>
              <select
                className="select select-md w-56 p-3 rounded-lg border-gray-300"
                onChange={(e) =>
                  filterItems(e.target.value as filteroptions, raw)
                }
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="not paid">Not Paid</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <h2 className="text-lg font-medium text-accent">Department</h2>
              <select
                className="select select-md w-56 p-3 rounded-lg border-gray-300"
                onChange={(e) =>
                  filterDepartment(e.target.value as Department, raw)
                }
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="EEE">EEE</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-medium text-accent">Semester</h2>
              <select
                className="select select-md w-56 p-3 rounded-lg border-gray-300"
                onChange={(e) => filterSemester(parseInt(e.target.value), raw)}
              >
                <option value="">Select Semester</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <h2 className="text-lg font-medium text-accent">
                Academic Year Filter
              </h2>
              <input
                type="number"
                placeholder="Academic Year"
                className="input input-bordered w-56 p-3 rounded-lg"
                onChange={(e) => filterAcademic(parseInt(e.target.value), raw)}
              />
            </div>

            <div className="flex items-center gap-4">
              <h2 className="text-lg font-medium text-accent">Roll No</h2>
              <input
                type="text"
                placeholder="Enter Roll No"
                className="input input-bordered w-56 p-3 rounded-lg"
                value={rollno}
                onChange={(e) => {
                  setRollno(e.target.value.toUpperCase());
                  filterRollNo(e.target.value.toUpperCase(), raw);
                }}
              />
            </div>
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-medium text-accent">Sort By</h2>
              <select
                className="select select-md w-56 p-3 rounded-lg border-gray-300"
                onChange={(e) =>
                  sortItems(e.target.value as sortoptions, details)
                }
              >
                <option value="rollno">Roll No</option>
                <option value="name">Name</option>
                <option value="dept">Department</option>
                <option value="paiddate">Paid Date</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="flex items-center justify-center mb-0 bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
                onClick={() => handleViewDownload(details)}
              >
                Download View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for your data display component */}
      {load ? (
        <Loader />
      ) : (
        <AdminTabsExam details={details as ExamFeeProps[]} />
      )}
    </div>
  );
};

export default Details;
