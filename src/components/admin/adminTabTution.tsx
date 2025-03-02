/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { TbEdit } from "react-icons/tb";
import axios from "axios";
import { FcApproval } from "react-icons/fc";
import { FcHighPriority } from "react-icons/fc";
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
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
interface EditStatus {
  status: number;
  data: any;
}
interface componentProps {
  details: FeeProps[];
}
const AdminTabTution = (props: componentProps) => {
  let [categories, setCategories] = useState({
    Fee: [
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
    ] as FeeProps[],
  });

  const [editStatus, setEditStatus] = useState<EditStatus>();
  const [editLoading, setEditLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [tuition, setTuition] = useState(0);
  const [development, setDevelopment] = useState(0);
  const [placement, setPlacement] = useState(0);
  const [others, setOthers] = useState(0);
  const [rollno, setRollno] = useState("");
  const [regno, setRegno] = useState("");
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [PaymentStatus, setPaymentStatus] = useState(false);
  const onEditHandler = (details: FeeProps) => {
    setTuition(details.tuition);
    setDevelopment(details.development);
    setPlacement(details.placement);
    setOthers(details.others);
    setPaymentStatus(details.paid);
    setEnabled(details.enabled);
    setRollno(details.rollno);
    setRegno(details.regno);
    setName(details.name);
    setYear(details.academic);
    console.log(details);
    const a = document.createElement("a");
    a.href = "#editModal";
    a.click();
  };

  const onSaveHandler = async () => {
    setEditLoading(true);
    console.log(
      rollno,
      regno,
      year,
      tuition,
      development,
      placement,
      others,
      PaymentStatus,
      enabled
    );
    try {
      await axios
        .put(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/modify/tuition",
          {
            rollno,
            regno,
            year,
            tuition,
            development,
            placement,
            others,
            paid: PaymentStatus ? 1 : 0,
            enabled: enabled ? 1 : 0,
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
          console.log("Edit status1: ", res);
        })
        .catch((err) => {
          const { status, data } = err;
          setEditStatus({
            status,
            data,
          });
          console.log("Edit status2: ", err);
        })
        .finally(() => {
          setEditLoading(false);
          console.log("Edit status: ", editStatus);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const updateCategories = () => {
    setCategories({ Fee: props.details });
  };

  useEffect(() => {
    console.log("Props: ", props);
    updateCategories();
    console.log(props);
  }, [props]);

  function refreshPage() {
    window.location.reload();
  }
  return (
    <div className="w-full px-2 py-1 sm:px-0">
      <Tab.Group>
        <Tab.Panels className="mt-0">
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
                  <div className="overflow-x-auto w-full p-5">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th className="hidden"></th>
                          <th>Roll No</th>
                          <th>Reg No</th>
                          <th>Name</th>
                          <th>Department</th>
                          <th>Quota</th>
                          <th>Fee Year</th>
                          <th>Tution</th>
                          <th>Development</th>
                          <th>Placement</th>
                          <th>Others</th>
                          <th>Payment Date</th>
                          <th>Enabled</th>
                          <th>Payment Status</th>
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
                            <th className="text-center text-base text-clip">
                              {" "}
                              {props.regno}{" "}
                            </th>
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
                              {props.quota}{" "}
                            </td>
                            <td className="text-center text-base text-clip">
                              {" "}
                              {props.academic}{" "}
                            </td>
                            <td className="text-center text-base text-clip">
                              {" "}
                              {props.tuition}{" "}
                            </td>
                            <td className="text-center text-base text-clip">
                              {" "}
                              {props.development}{" "}
                            </td>
                            <td className="text-center text-base text-clip">
                              {" "}
                              {props.placement}{" "}
                            </td>
                            <td className="text-center text-base text-clip">
                              {" "}
                              {props.others}{" "}
                            </td>

                            <td className="text-center text-base text-clip">
                              {" "}
                              {props.paiddate
                                ? props.paiddate.split("T")[0]
                                : "-"}{" "}
                            </td>
                            <td className="text-center text-base text-clip">
                              {" "}
                              {props.enabled ? "Yes" : "No"}{" "}
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
                                      {name}
                                    </span>
                                    <br />
                                    <span className="label-text">
                                      <span className=" font-bold">
                                        Roll No:{" "}
                                      </span>
                                      {rollno}
                                    </span>{" "}
                                    <br />
                                    <span className="label-text">
                                      <span className=" font-bold">
                                        Fee for year:{" "}
                                      </span>
                                      {year}
                                    </span>
                                    <br />
                                  </div>
                                  <div className="grid m-4 grid-cols-2 gap-4">
                                    <div>
                                      <label className="label">
                                        <span className="label-text">
                                          Tution Fee
                                        </span>
                                      </label>
                                      <input
                                        type="text"
                                        value={tuition}
                                        min={0}
                                        onChange={(e) => {
                                          let data = e.target.value;
                                          data = data.trim();
                                          data = data.replace(/[\s()-]/g, "");
                                          if (data.length == 0) {
                                            data = "0";
                                          }
                                          setTuition(parseInt(data));
                                        }}
                                        placeholder="Placement Fee"
                                        className="input input-bordered w-full max-w-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="label">
                                        <span className="label-text">
                                          Development Fee
                                        </span>
                                      </label>
                                      <input
                                        type="text"
                                        value={development}
                                        min={0}
                                        onChange={(e) => {
                                          let data = e.target.value;
                                          data = data.trim();
                                          data = data.replace(/[\s()-]/g, "");
                                          if (data.length == 0) {
                                            data = "0";
                                          }
                                          setDevelopment(parseInt(data));
                                        }}
                                        placeholder="Enter Development Fee"
                                        className="input input-bordered w-full max-w-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="label">
                                        <span className="label-text">
                                          Placement Fee
                                        </span>
                                      </label>
                                      <input
                                        type="text"
                                        value={placement}
                                        min={0}
                                        onChange={(e) => {
                                          let data = e.target.value;
                                          data = data.trim();
                                          data = data.replace(/[\s()-]/g, "");
                                          if (data.length == 0) {
                                            data = "0";
                                          }
                                          setPlacement(parseInt(data));
                                        }}
                                        placeholder="Enter Other"
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
                                        value={others}
                                        min={0}
                                        onChange={(e) => {
                                          let data = e.target.value;
                                          data = data.trim();
                                          data = data.replace(/[\s()-]/g, "");
                                          if (data.length == 0) {
                                            data = "0";
                                          }
                                          setOthers(parseInt(data));
                                        }}
                                        placeholder="Enter Completion Year"
                                        className="input input-bordered w-full max-w-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="label">
                                        <span className="label-text">
                                          Enabled
                                        </span>
                                      </label>
                                      <input
                                        type="checkbox"
                                        checked={enabled}
                                        min={0}
                                        onChange={() => setEnabled(!enabled)}
                                        placeholder="Enter Semester"
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
                                        checked={PaymentStatus}
                                        min={0}
                                        onChange={() =>
                                          setPaymentStatus(!PaymentStatus)
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
                                          ? "alert alert-success shadow-lg my-4"
                                          : "alert alert-error shadow-lg my-4"
                                      }
                                    >
                                      <div className="w-fit flex">
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
                                        <span className="text-sm">
                                          {editStatus.data.message}
                                        </span>
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

export default AdminTabTution;
