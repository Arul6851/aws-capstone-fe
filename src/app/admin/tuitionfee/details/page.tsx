"use client";
//todo Filter by Roll No,Fee year doesnt work;Handle View download
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../../../components/student/loader";
import xlsx from "json-as-xlsx";
import AdminTabTution from "../../../../components/admin/adminTabTution";
type filteroptions =
  | "all"
  | "paid"
  | "not paid"
  | "rollno"
  | "dept"
  | "academic";
type sortoptions = "rollno" | "name" | "year" | "dept" | "paiddate";
interface FeeProps {
  rollno: string;
  regno: string;
  name: string;
  dept: string;
  quota: string;
  academic: string;
  tuition: number;
  development: number;
  placement: number;
  others: number;
  paiddate?: string;
  enabled: boolean;
  paid: boolean;
}
const Details = () => {
  const [raw, setRaw] = useState<FeeProps[]>([
    {
      rollno: "",
      regno: "",
      name: "",
      dept: "",
      quota: "",
      academic: "",
      tuition: 0,
      development: 0,
      placement: 0,
      others: 0,
      paiddate: "",
      enabled: false,
      paid: false,
    },
  ]);
  const [details, setDetails] = useState<FeeProps[]>([
    {
      rollno: "",
      regno: "",
      name: "",
      dept: "",
      quota: "",
      academic: "",
      tuition: 0,
      development: 0,
      placement: 0,
      others: 0,
      paiddate: "",
      enabled: false,
      paid: false,
    },
  ]);
  const [load, setLoad] = useState(true);
  const [info, setInfo] = useState<filteroptions | undefined>();
  const [rollno, setRollno] = useState<string>();
  const [showFilters, setShowFilters] = useState(false);

  const sortItems = (option: sortoptions, rawdetails: FeeProps[]) => {
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
          return (
            rawdetails[parseInt(a)].name.localeCompare(
              rawdetails[parseInt(b)].name
            ) || 0
          );
        })
        .map((k) => {
          return rawdetails[parseInt(k)];
        });
      setDetails(detail);
    } else if (option === "dept") {
      const detail = Object.keys(rawdetails)
        .sort((a, b) => {
          return (
            rawdetails[parseInt(a)].dept.localeCompare(
              rawdetails[parseInt(b)].dept
            ) || 0
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

  const filterItems = (option: filteroptions, rawdetails: FeeProps[]) => {
    if (option === "all") {
      setInfo("all");
      setDetails(rawdetails);
    } else if (option === "paid") {
      setInfo("paid");
      const detail = Object.keys(rawdetails)
        .filter((k) => {
          return rawdetails[parseInt(k)].paid == true;
        })
        .map((k) => {
          return rawdetails[parseInt(k)];
        });
      setDetails(detail);
    } else if (option === "not paid") {
      setInfo("not paid");
      const detail = Object.keys(rawdetails)
        .filter((k) => {
          return rawdetails[parseInt(k)].paid == false;
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
  const filterRollNo = (rollno: string, rawdetails: FeeProps[]) => {
    const detail = Object.keys(rawdetails)
      .filter((k) => {
        return rawdetails[parseInt(k)].rollno.includes(rollno) ? true : false;
      })
      .map((k) => {
        return rawdetails[parseInt(k)];
      });
    setDetails(detail);
  };

  const filterDepartment = (department: Department, rawdetails: FeeProps[]) => {
    const detail = Object.keys(rawdetails)
      .filter((k) => {
        return rawdetails[parseInt(k)].dept.includes(department) ? true : false;
      })
      .map((k) => {
        return rawdetails[parseInt(k)];
      });
    setDetails(detail);
  };

  const filterAcademic = (year: number, rawdetails: FeeProps[]) => {
    const detail = Object.keys(rawdetails)
      .filter((k) => {
        return rawdetails[parseInt(k)].academic
          .toString()
          .includes(year.toString())
          ? true
          : false;
      })
      .map((k) => {
        return rawdetails[parseInt(k)];
      });
    setDetails(detail);
  };

  const handleSearch = (value: string | Department, rawdetails: FeeProps[]) => {
    if (info === "rollno" && typeof value === "string") {
      filterRollNo(value, rawdetails);
    } else if (info === "dept" && typeof value !== "string") {
      filterDepartment(value, rawdetails);
    } else if (info === "academic" && typeof value === "number") {
      filterAcademic(value, rawdetails);
    }
  };

  const handleViewDownload = (details: FeeProps[]) => {
    console.log(details);
    const updateDetails = details.map((detail) => {
      let paiddate = "";
      if (detail.paid == true && detail.paiddate)
        paiddate = detail.paiddate.split("T")[0];
      return {
        rollno: detail.rollno,
        regno: detail.regno,
        name: detail.name,
        academic: detail.academic,
        dept: detail.dept,
        tuition: detail.tuition,
        development: detail.development,
        placement: detail.placement,
        others: detail.others,
        total:
          detail.tuition +
          detail.development +
          detail.placement +
          detail.others,
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
          { label: "Academic Year", value: "academic" },
          { label: "Department", value: "dept" },
          { label: "Tuition Fee", value: "tuition" },
          { label: "Development Fee", value: "development" },
          { label: "Placement Fee", value: "placement" },
          { label: "Photocopy Fee", value: "photocopy" },
          { label: "Other Fee", value: "others" },
          { label: "Total Fee", value: "total" },
          { label: "Paid", value: "paid" },
          { label: "Paid Date", value: "paiddate" },
        ],
        content: updateDetails,
      },
    ];
    xlsx(data, { fileName: `AdminView_Filter` });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      await axios
        .get(process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/fetch/tuition/", {
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
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="EEE">EEE</option>
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
            {info != "all" ? (
              <div className="flex flex-row justify-center gap-4 items-center">
                <input
                  type="text"
                  placeholder={info}
                  className="input input-bordered"
                  onChange={(e) =>
                    handleSearch(e.target.value as string | Department, raw)
                  }
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
      {load ? <Loader /> : <AdminTabTution details={details} />}
    </div>
  );
};

export default Details;
