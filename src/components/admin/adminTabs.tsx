/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { TbEdit } from "react-icons/tb";
import { Datepicker } from "flowbite-react";
import axios from "axios";

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
interface EditStatus {
  status: number;
  data: any;
}
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
interface componentProps {
  details: StudentProps[];
}
const AdminTabs = (props: componentProps) => {
  let [categories, setCategories] = useState({
    Fee: [
      {
        rollno: "",
        regno: "",
        name: "",
        dept: "CSE A" as Department,
        year: "",
        semester: 0,
        quota: "GQ" as Quota,
        id: "",
        dob: new Date(),
      },
    ] as StudentProps[],
  });

  const [rollno, setRollno] = useState("");
  const [regno, setRegno] = useState("");
  const [dept, setDept] = useState("");
  const [year, setYear] = useState(0);
  const [semester, setSemester] = useState(0);
  const [quota, setQuota] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState(new Date());
  const [editStatus, setEditStatus] = useState<EditStatus>();
  const [editLoading, setEditLoading] = useState(false);

  const onEditHandler = (details: StudentProps) => {
    setRollno(details.rollno);
    setRegno(details.regno);
    setName(details.name);
    setDept(details.dept);
    setDob(details.dob);
    setYear(parseInt(details.year));
    setSemester(details.semester);
    setQuota(details.quota);
    console.log(details);
    const a = document.createElement("a");
    a.href = "#editModal";
    a.click();
  };

  const onSaveHandler = async () => {
    setEditLoading(true);
    await axios
      .post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/modify/student",
        {
          rollno,
          regno,
          name,
          dept,
          dob: dob.toLocaleDateString("en-CA"),
          year,
          semester,
          quota,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        const { status, data } = res;
        setEditStatus({
          status,
          data,
        });
      })
      .catch((err) => {
        const { status, data } = err;
        setEditStatus({
          status,
          data,
        });
      })
      .finally(() => {
        setEditLoading(false);
        // setTimeout(() => {
        //   setEditStatus();
        //   const a = document.createElement("a");
        //   a.href = "#";
        //   a.click();
        // }, 2000);
      });
  };

  const updateCategories = () => {
    setCategories({ Fee: props.details });
  };

  useEffect(() => {
    updateCategories();
    console.log(props);
  }, [props]);
  function refreshPage() {
    window.location.reload();
  }
  return (
    <div className="w-full px-2 py-0 sm:px-0">
      <Tab.Group>
        <Tab.Panels className="mt-2">
          {Object.values(categories).map((fee, idx) => (
            <>
              {fee != null ? (
                <Tab.Panel
                  key={idx}
                  className={classNames(
                    "rounded-xl bg-white p-3",
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                  )}
                >
                  <div className="overflow-x-auto w-full p-20">
                    <table className="table w-full">
                      <thead>
                        <tr className=" text-center">
                          <th className="hidden"></th>
                          <th>Roll No</th>
                          <th>Reg No</th>
                          <th>Name</th>
                          <th>Date Of Birth</th>
                          <th>Department</th>
                          <th>Year of Completion</th>
                          <th>Semester</th>
                          <th>Quota</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fee.map((props, id) => (
                          <tr key={id}>
                            <td className="hidden"></td>
                            <th className="text-center text-base text-clip">
                              {" "}
                              {props.rollno}{" "}
                            </th>
                            <td className="text-center text-base text-clip">
                              {" "}
                              {props.regno}{" "}
                            </td>
                            <td className="text-center text-base text-clip">
                              {" "}
                              {props.name}{" "}
                            </td>
                            <td className="text-center text-base text-clip">
                              {" "}
                              {props.dob.toString().split("T")[0]}{" "}
                            </td>
                            <td className="text-center text-base text-clip">
                              {" "}
                              {props.dept}{" "}
                            </td>
                            <td className="text-center text-base text-clip">
                              {" "}
                              {props.year}{" "}
                            </td>
                            <td className="text-center text-base text-clip">
                              {" "}
                              {props.semester}{" "}
                            </td>
                            <td className="text-center text-base text-clip">
                              {" "}
                              {props.quota}{" "}
                            </td>
                            <td className="text-center content-center text-base truncate">
                              <button
                                onClick={() => onEditHandler(props)}
                                className="text-indigo-600 hover:text-indigo-900 bg-gray-100 rounded-md p-2 hover:bg-gray-200"
                              >
                                <TbEdit />
                              </button>
                              <div className="modal" id="editModal">
                                <div className="modal-box">
                                  <div className="grid m-4 grid-cols-2 gap-4">
                                    <div>
                                      <label className="label">
                                        <span className="label-text">
                                          Rollno
                                        </span>
                                      </label>
                                      <input
                                        type="text"
                                        value={rollno}
                                        min={0}
                                        onChange={(e) =>
                                          setRollno(e.target.value)
                                        }
                                        placeholder="Enter Roll No"
                                        className="input input-bordered w-full max-w-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="label">
                                        <span className="label-text">
                                          Reg no
                                        </span>
                                      </label>
                                      <input
                                        type="text"
                                        value={regno}
                                        min={0}
                                        onChange={(e) =>
                                          setRegno(e.target.value)
                                        }
                                        placeholder="Enter Reg No"
                                        className="input input-bordered w-full max-w-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="label">
                                        <span className="label-text">Name</span>
                                      </label>
                                      <input
                                        type="text"
                                        value={name}
                                        min={0}
                                        onChange={(e) =>
                                          setName(e.target.value)
                                        }
                                        placeholder="Enter Name"
                                        className="input input-bordered w-full max-w-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="label">
                                        <span className="label-text">
                                          Department
                                        </span>
                                      </label>
                                      <select
                                        className="input input-bordered w-full max-w-xs"
                                        onChange={(e) =>
                                          setDept(e.target.value)
                                        }
                                        value={dept}
                                      >
                                        <option value="CSE A">CSE A</option>
                                        <option value="CSE B">CSE B</option>
                                        <option value="AI&DS">AI&DS</option>
                                        <option value="ECE">ECE</option>
                                        <option value="EEE">EEE</option>
                                        <option value="MECH">MECH</option>
                                        <option value="IT">IT</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="label">
                                        <span className="label-text">
                                          Date of Birth
                                        </span>
                                      </label>
                                      <div>
                                        <Datepicker
                                          onSelectedDateChanged={(e) => {
                                            setDob(e);
                                            console.log(dob);
                                          }}
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="label">
                                        <span className="label-text">
                                          Year of Completion
                                        </span>
                                      </label>
                                      <input
                                        type="number"
                                        value={year}
                                        min={0}
                                        onChange={(e) =>
                                          setYear(e.target.valueAsNumber)
                                        }
                                        placeholder="Enter Completion Year"
                                        className="input input-bordered w-full max-w-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="label">
                                        <span className="label-text">
                                          Semester
                                        </span>
                                      </label>
                                      <input
                                        type="number"
                                        value={semester}
                                        min={0}
                                        onChange={(e) =>
                                          setSemester(e.target.valueAsNumber)
                                        }
                                        placeholder="Enter Semester"
                                        className="input input-bordered w-full max-w-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="label">
                                        <span className="label-text">
                                          Quota
                                        </span>
                                      </label>
                                      <select
                                        className="input input-bordered w-full max-w-xs"
                                        onChange={(e) =>
                                          setQuota(e.target.value)
                                        }
                                        value={quota}
                                      >
                                        <option value="MQ">MQ</option>
                                        <option value="GQ">GQ</option>
                                      </select>
                                    </div>
                                    <br />
                                  </div>
                                  {editStatus ? (
                                    <div
                                      className={
                                        editStatus.status == 200
                                          ? "alert alert-success shadow-lg my-4 w-96"
                                          : "alert alert-error shadow-lg my-4 w-96"
                                      }
                                    >
                                      <div>
                                        {editStatus.status == 200 ? (
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="stroke-current flex-shrink-0 h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                          </svg>
                                        ) : (
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="stroke-current flex-shrink-0 h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                          </svg>
                                        )}
                                        <span>{editStatus.data.message}</span>
                                      </div>
                                    </div>
                                  ) : null}
                                  <div className="modal-action">
                                    <button
                                      className={
                                        editLoading
                                          ? "btn btn-primary loading"
                                          : "btn btn-primary"
                                      }
                                      onClick={onSaveHandler}
                                    >
                                      Save
                                    </button>
                                    <a
                                      className="btn btn-secondary"
                                      onClick={refreshPage}
                                    >
                                      Close!
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Tab.Panel>
              ) : (
                <Tab.Panel>
                  <h1 className="text-center text-2xl text-neutral">No Data</h1>
                </Tab.Panel>
              )}
            </>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default AdminTabs;
