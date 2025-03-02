"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import AdminTabs from "@/components/admin/adminTabs";
import Loader from "@/components/student/loader";
import xlsx from "json-as-xlsx";
import { register } from "module";
interface StudentProps {
  rollno: string;
  regno: string;
  name: string;
  dept: Department;
  year: string;
  semester: number;
  quota: Quota;
  id: string;
  dob: Date;
}
type filteroptions = "all" | "rollno" | "dept" | "academic" | "semester";
type sortoptions = "rollno" | "name" | "year" | "dept";

const ModifyDetails = () => {
  const [raw, setRaw] = useState<StudentProps[]>([
    {
      rollno: "",
      regno: "",
      name: "",
      dept: "IT",
      year: "",
      semester: 0,
      quota: "MQ",
      id: "1",
      dob: new Date(),
    },
  ]);
  const [details, setDetails] = useState<StudentProps[]>([
    {
      rollno: "",
      regno: "",
      name: "",
      dept: "CSE A",
      year: "",
      semester: 0,
      quota: "MQ",
      id: "1",
      dob: new Date(),
    },
  ]);
  const [load, setLoad] = useState(true);
  const [info, setInfo] = useState<filteroptions | undefined>();
  const [rollno, setRollno] = useState<string>();
  const [showFilters, setShowFilters] = useState(false);
  const sortItems = (option: sortoptions, rawdetails: StudentProps[]) => {
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
    }
  };

  const filterItems = (option: filteroptions, rawdetails: StudentProps[]) => {
    if (option === "all") {
      setInfo("all");
      setDetails(rawdetails);
    } else if (option === "rollno") {
      setInfo("rollno");
    } else if (option === "dept") {
      setInfo("dept");
    } else if (option === "academic") {
      setInfo("academic");
    }
  };
  const filterRollNo = (rollno: string, rawdetails: StudentProps[]) => {
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
    rawdetails: StudentProps[]
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

  const filterAcademic = (year: number, rawdetails: StudentProps[]) => {
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
    rawdetails: StudentProps[]
  ) => {
    if (info === "rollno" && typeof value === "string") {
      filterRollNo(value, rawdetails);
    } else if (info === "dept" && typeof value !== "string") {
      filterDepartment(value, rawdetails);
    } else if (info === "academic" && typeof value === "number") {
      filterAcademic(value, rawdetails);
    }
  };

  const handleViewDownload = (details: StudentProps[]) => {
    const updateDetails = details.map((detail) => {
      return {
        rollno: detail.rollno,
        regno: detail.regno,
        name: detail.name,
        year: detail.year,
        dept: detail.dept,
        semester: detail.semester,
        quota: detail.quota,
        dob: new Date(detail.dob),
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
          { label: "Semester", value: "semester" },
          { label: "Quota", value: "quota" },
          { label: "DOB", value: "dob" },
        ],
        content: updateDetails,
      },
    ];
    xlsx(data, { fileName: `Student_AdminView_Filter` });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      await axios
        .get(process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/fetch/students/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
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
              <h2 className="text-lg font-medium text-accent">
                Department Filter
              </h2>
              <select
                className="select select-md w-56 p-3 rounded-lg border-gray-300"
                onChange={(e) =>
                  filterDepartment(e.target.value as Department, raw)
                }
              >
                <option value="">Select Department</option>
                <option value="CSE A">CSE A</option>
                <option value="CSE B">CSE B</option>
                <option value="AI&DS">AI&DS</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="IT">IT</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <h2 className="text-lg font-medium text-accent">
                Year of completion Filter
              </h2>
              <input
                type="number"
                placeholder="Enter Year"
                className="input input-bordered w-56 p-3 rounded-lg"
                onChange={(e) => filterAcademic(parseInt(e.target.value), raw)}
              />
            </div>

            <div className="flex items-center gap-4">
              <h2 className="text-lg font-medium text-accent">
                Roll No Filter
              </h2>
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
            {info != "all" ? (
              <div className="flex flex-row justify-center gap-4 items-center">
                <input
                  type="text"
                  placeholder={info}
                  className="input input-bordered"
                  onChange={(e) => handleSearch(e.target.value, raw)}
                />
              </div>
            ) : null}
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
      {load ? <Loader /> : <AdminTabs details={details} />}
    </div>
  );
};

export default ModifyDetails;
