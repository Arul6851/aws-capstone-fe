"use client";
import axios from "axios";
import { useState } from "react";
import { Datepicker } from "flowbite-react";
import { TiTick, TiWarning } from "react-icons/ti";
interface StudentResponse {
  message: string;
  name: string;
  rollno: string;
}
interface BulkStudentResponse {
  added: number;
  message: string;
  notAdded: number;
}
interface individiualStatusType {
  status: number;
  data: StudentResponse;
}
interface bulkStatusType {
  status: number;
  data: BulkStudentResponse;
}
function Addstudent() {
  const [name, setName] = useState("");
  const [academic, setAcademic] = useState<number>();
  const [dept, setDept] = useState<Department>("CSE A");
  const [rollno, setRollno] = useState("");
  const [regno, setRegno] = useState("");
  const [quota, setQuota] = useState<Quota>("MQ");
  const [dob, setDob] = useState<Date>();
  const [semester, setSemester] = useState<number>();
  const [file, setFile] = useState<File>();
  const [individualStatus, setIndividualStatus] =
    useState<individiualStatusType>();
  const [individualLoading, setIndividualLoading] = useState<boolean>(false);
  const [bulkStatus, setBulkStatus] = useState<bulkStatusType>();
  const [bulkLoading, setBulkLoading] = useState<boolean>(false);
  const handleIndividual = async () => {
    setIndividualLoading(true);
    try {
      if (dob != null) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/register/single`,
          {
            rollno,
            name,
            regno,
            year: academic,
            dept,
            quota,
            dob: dob.toLocaleDateString("en-CA"),
            sem: semester,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Response=", {
          status: response.status,
          data: response.data,
        });
        setIndividualStatus({
          status: response.status,
          data: response.data,
        });
      }
    } catch (error: any) {
      if (error.response) {
        setIndividualStatus({
          status: error.response.status,
          data: error.response.data,
        });
      } else if (error.request) {
        console.error("No response received from the server");
      } else {
        console.error("Error during request setup:", error.message);
      }
    } finally {
      resetForm();
    }
  };

  const resetForm = () => {
    setName("");
    setAcademic(2000);
    setDept("CSE A");
    setRegno("");
    setRollno("");
    setQuota("MQ");
    setDob(new Date());
    setSemester(1);
    setIndividualLoading(false);
    setTimeout(() => {
      setIndividualStatus({
        status: 0,
        data: {
          message: "",
          name: "",
          rollno: "",
        },
      });
    }, 5000);
  };

  const handleBulk = async () => {
    setBulkLoading(true);
    const data = new FormData();
    console.log("file type", typeof file);
    data.append("myFile", file as Blob);
    await axios
      .post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/register/bulk",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((results) => {
        const { status, data } = results;
        console.log("Response=", {
          status,
          data,
        });
        setBulkStatus({
          status,
          data,
        });
      })
      .catch((err) => {
        const { status, data } = err.response;
        setBulkStatus({
          status,
          data,
        });
        console.log(err);
      })
      .finally(() => {
        setFile(new File([], ""));
        setBulkLoading(false);
        setTimeout(() => {
          setBulkStatus({
            status: 0,
            data: {
              added: 0,
              message: "",
              notAdded: 0,
            },
          });
        }, 5000);
      });
  };

  return (
    <div className="flex m-10 flex-col flex-wrap gap-6">
      <h1 className="text-center text-2xl text-accent">Upload Details</h1>
      <div className="flex flex-row justify-around items-center flex-wrap gap-6">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-center">Individual Upload</h1>
          <div className="grid m-4 grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase())}
                placeholder="Enter name"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Department</span>
              </label>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value as Department)}
                className="select select-bordered w-full max-w-xs"
              >
                {/* <option></option> */}
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
                <span className="label-text">Roll No</span>
              </label>
              <input
                type="text"
                value={rollno}
                onChange={(e) => setRollno(e.target.value.toUpperCase())}
                placeholder="Enter roll number"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Reg No</span>
              </label>
              <input
                type="text"
                value={regno}
                onChange={(e) => setRegno(e.target.value.toUpperCase())}
                placeholder="Enter register number"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Quota</span>
              </label>
              <select
                value={quota}
                onChange={(e) => setQuota(e.target.value as Quota)}
                className="select select-bordered w-full max-w-xs"
              >
                <option></option>
                <option value={"GQ"}>GQ</option>
                <option value={"MQ"}>MQ</option>
              </select>
            </div>
            <div>
              <label className="label">
                <span className="label-text">Date of Birth</span>
              </label>
              <div>
                <Datepicker
                  onSelectedDateChanged={(e) => {
                    console.log(e);
                    setDob(e);
                  }}
                />
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text">Year of Completion</span>
              </label>
              <input
                type="number"
                value={academic}
                min={0}
                onChange={(e) => setAcademic(e.target.valueAsNumber)}
                placeholder="Enter year of completion"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Semester</span>
              </label>
              <input
                type="number"
                value={semester}
                min={0}
                onChange={(e) => {
                  // if (e.target.valueAsNumber > 0 && e.target.valueAsNumber < 9)
                  setSemester(e.target.valueAsNumber);
                }}
                placeholder="Enter semester"
                className={`input input-bordered w-full max-w-xs ${
                  semester !== undefined && (semester > 8 || semester < 0)
                    ? "input-error"
                    : ""
                }`}
              />
            </div>
          </div>
          {individualStatus && individualStatus.data.message != "" ? (
            <div
              className={
                individualStatus.status == 200
                  ? "alert alert-success shadow-lg my-4 w-96"
                  : "alert alert-error shadow-lg my-4 w-96"
              }
            >
              <div>
                {individualStatus.status == 200 && (
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
                )}
                {individualStatus.status != 200 &&
                  individualStatus.status != 0 && (
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
                {individualStatus.data.name ? (
                  <span>
                    {individualStatus.data.message}
                    <br />
                    Name: {individualStatus.data.name}
                    <br />
                    Roll no: {individualStatus.data.rollno}
                  </span>
                ) : (
                  <span>{individualStatus.data.message}</span>
                )}
              </div>
            </div>
          ) : null}
          <button
            onClick={handleIndividual}
            className={
              individualLoading
                ? "btn btn-primary loading px-8"
                : "btn px-8 btn-primary"
            }
          >
            Submit
          </button>

          <h1 className="text-center">Bulk Upload</h1>
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files != null && e.target.files[0] != null) {
                setFile(e.target.files[0]);

                console.log("file set", file);
              }
            }}
            className="file-input file-input-primary file-input-bordered file-input-xl w-full max-w-xs"
          />
          <div className="flex gap-2">
            <h1>File Status : </h1>
            {file ? (
              <div className="flex gap-2">
                <h1 className=" text-green-500">File Ready</h1>
                <TiTick className="stroke-current flex-shrink-0 h-6 w-6" />
              </div>
            ) : (
              <div className="flex gap-2">
                <h1 className=" text-red-500">File Not Ready</h1>
                <TiWarning className="stroke-current flex-shrink-0 h-6 w-6" />
              </div>
            )}
          </div>
          {bulkStatus ? (
            <div
              className={`${
                bulkStatus.status == 200 && "alert alert-success shadow-lg my-4"
              }
                  ${
                    bulkStatus.status != 200 &&
                    bulkStatus.status != 0 &&
                    "alert alert-error shadow-lg my-4"
                  }`}
            >
              <div className="flex flex-col gap-y-4">
                <div className="flex flex-row gap-x-10">
                  {bulkStatus.status == 200 && (
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
                  )}{" "}
                  {bulkStatus.status != 200 && bulkStatus.status != 0 && (
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
                  <span>{bulkStatus.data.message}</span>
                  <span>{bulkStatus.data.added} Students added</span>
                  <span>{bulkStatus.data.notAdded} Students not added</span>
                </div>
              </div>
            </div>
          ) : null}
          <a href="/template/UploadList.xlsx" className="btn px-8 btn-primary">
            Download Template
          </a>
          <button
            onClick={handleBulk}
            className={
              bulkLoading
                ? "btn btn-primary loading px-8"
                : "btn px-8 btn-primary"
            }
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Addstudent;
