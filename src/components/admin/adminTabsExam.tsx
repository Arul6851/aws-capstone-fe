/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { TbEdit } from "react-icons/tb";
import axios from "axios";
import { FcApproval } from "react-icons/fc";
import { FcHighPriority } from "react-icons/fc";
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
interface EditStatus {
  status: number;
  data: any;
}
interface componentProps {
  details: ExamFeeProps[];
}
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const AdminTabsExam = (props: componentProps) => {
  let [categories, setCategories] = useState({
    Fee: [
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
      },
    ] as ExamFeeProps[],
  });

  const [editStatus, setEditStatus] = useState<EditStatus>();
  const [editLoading, setEditLoading] = useState(false);
  const [exam, setExam] = useState(0);
  const [arrear, setArrear] = useState(0);
  const [other, setOther] = useState(0);
  const [PaymentStatus, setPaymentStatus] = useState(0);
  const [id, setId] = useState<string>();
  const onEditHandler = (details: ExamFeeProps) => {
    console.log(details);

    setExam(details.exam);
    setArrear(details.arrear);
    setOther(details.others);
    setPaymentStatus(details.paid);
    setId(details.id);
    const a = document.createElement("a");
    a.href = "#editModal";
    a.click();
  };

  const onSaveHandler = async () => {
    setEditLoading(true);
    await axios
      .post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/modify/exam",
        {
          id: id,
          exam: exam,
          arrear: arrear,
          others: other,
          paid: PaymentStatus,
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
    <div className="w-full px-2 py-16 sm:px-0">
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
                  <div className="overflow-x-auto w-full p-0">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th className="hidden"></th>
                          <th>Roll No</th>
                          <th>Reg No</th>
                          <th>Name</th>
                          <th>Department</th>
                          <th>Completion Year</th>
                          <th>Semester</th>
                          <th>Exam Fee</th>
                          <th>Others</th>
                          <th>Arrear Fee</th>
                          <th>Total</th>
                          <th>Paid Date</th>
                          <th>Paid</th>
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
                              {props.exam}{" "}
                            </td>
                            <td className="text-center text-base text-clip">
                              {" "}
                              {props.others}{" "}
                            </td>
                            <td className="text-center text-base text-clip">
                              {" "}
                              {props.arrear}{" "}
                            </td>
                            <td className="text-center text-base text-clip">
                              {" "}
                              {props.arrear + props.others + props.exam}{" "}
                            </td>
                            <td className="text-center text-base text-clip">
                              {" "}
                              {props.paiddate
                                ? props.paiddate.split("T")[0]
                                : "-"}{" "}
                            </td>
                            <td className="text-center text-base text-clip flex items-center justify-center">
                              {" "}
                              {props.paid ? (
                                <button className="text-indigo-600 bg-green-100 rounded-md p-2">
                                  <FcApproval />
                                </button>
                              ) : (
                                <button className="text-indigo-600 bg-red-100 rounded-md p-2">
                                  <FcHighPriority />
                                </button>
                              )}{" "}
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
                                  <div>
                                    <span className="label-text">
                                      <span className=" font-bold">Name: </span>
                                      {props.name}
                                    </span>
                                    <br />
                                    <span className="label-text">
                                      <span className=" font-bold">
                                        Roll No:{" "}
                                      </span>
                                      {props.rollno}
                                    </span>{" "}
                                    <br />
                                    <span className="label-text">
                                      <span className=" font-bold">
                                        Fee for year:{" "}
                                      </span>
                                      {props.year}
                                    </span>
                                    <br />
                                  </div>
                                  <div className="grid m-4 grid-cols-2 gap-4">
                                    <div>
                                      <label className="label">
                                        <span className="label-text">
                                          Exam Fee
                                        </span>
                                      </label>
                                      <input
                                        type="text"
                                        value={isNaN(exam) ? 0 : exam}
                                        min={0}
                                        onChange={(e) =>
                                          setExam(parseInt(e.target.value))
                                        }
                                        placeholder="Enter Development Fee"
                                        className="input input-bordered w-full max-w-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="label">
                                        <span className="label-text">
                                          Arrear Fee
                                        </span>
                                      </label>
                                      <input
                                        type="text"
                                        value={isNaN(arrear) ? 0 : arrear}
                                        min={0}
                                        onChange={(e) =>
                                          setArrear(parseInt(e.target.value))
                                        }
                                        placeholder="Enter Arrear Fee"
                                        className="input input-bordered w-full max-w-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="label">
                                        <span className="label-text">
                                          other
                                        </span>
                                      </label>
                                      <input
                                        type="number"
                                        value={isNaN(other) ? 0 : other}
                                        min={0}
                                        onChange={(e) =>
                                          setOther(e.target.valueAsNumber)
                                        }
                                        placeholder="Enter Completion Year"
                                        className="input input-bordered w-full max-w-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="label">
                                        <span className="label-text">
                                          Payment Status
                                        </span>
                                      </label>
                                      <input
                                        type="checkbox"
                                        checked={PaymentStatus == 1}
                                        min={0}
                                        onChange={() =>
                                          setPaymentStatus(
                                            PaymentStatus == 0 ? 1 : 0
                                          )
                                        }
                                        className="input input-bordered w-full max-w-xs"
                                      />
                                    </div>
                                    <br />
                                  </div>
                                  {editStatus ? (
                                    <div
                                      className={
                                        editStatus.status == 200
                                          ? "alert alert-success shadow-lg my-4 w-fit"
                                          : "alert alert-error shadow-lg my-4 w-fit"
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
                                      href="#"
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

export default AdminTabsExam;
