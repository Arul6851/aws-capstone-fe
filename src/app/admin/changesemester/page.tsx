"use client";
import { useState } from "react";
import axios from "axios";
interface Status {
  status: number;
  data: any;
}
function Changesem() {
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [status, setStatus] = useState<Status>();
  const onSubmit = async () => {
    setLoading(true);
    await axios
      .post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/semester",
        {
          year,
          semester,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        const { status, data } = res;
        setStatus({
          status,
          data,
        });
      })
      .catch((err) => {
        const { status, data } = err;
        setStatus({
          status,
          data,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex m-10 flex-col flex-wrap gap-6 text-lg">
      <h1 className="text-center text-2xl text-accent text-3xl">
        Change Semester
      </h1>
      <div className="flex flex-row justify-around items-center flex-wrap gap-6">
        <div className="flex flex-col gap-4 items-center">
          <div className="grid m-4 grid-cols-2 gap-4">
            <label className="label">
              <span className="label-text text-lg"> Academic Year</span>
            </label>
            {/* <select
              // value={dept}
              onChange={(e) => setYear(e.target.value)}
              className="select select-bordered w-full max-w-xs text-lg"
            >
              <option></option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select> */}
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value.toUpperCase())}
              placeholder="Enter Year"
              className="input input-bordered w-full max-w-xs"
            />
            <label className="label">
              <span className="label-text text-lg">Semester</span>
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="select select-bordered w-full max-w-xs"
            >
              <option></option>
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
          <br />
          {status ? (
            <div
              className={
                status.status == 200
                  ? "alert alert-success shadow-lg my-4 w-96"
                  : "alert alert-error shadow-lg my-4 w-96"
              }
            >
              <div>
                {status.status == 200 ? (
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
                <span>{status.data.message}</span>
              </div>
            </div>
          ) : null}
          <button
            onClick={onSubmit}
            className={
              loading ? "btn btn-primary loading px-8" : "btn px-8 btn-primary"
            }
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Changesem;
