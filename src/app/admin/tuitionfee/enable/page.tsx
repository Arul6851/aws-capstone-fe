"use client";
import { useState } from "react";
import axios from "axios";
interface individualStatusType {
  status: number;
  data: {
    message: string;
  };
}
function Enable() {
  const [year, setYear] = useState<number | undefined>();
  const [study, setStudy] = useState<YearOfStudyString>("1");
  const [individualLoading, setIndividualLoading] = useState(false);
  const [individualStatus, setIndividualStatus] =
    useState<individualStatusType>();

  const handleEnable = async () => {
    setIndividualLoading(true);
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/setfee/tuition/enable",
        {
          year: year,
          yearPresent: study,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Find Type:", {
        status: response.status,
        data: response.data,
      });
      setIndividualStatus({
        status: response.status,
        data: response.data,
      });
      setIndividualLoading(false);
    } catch (error: any) {
      if (error.response) {
        setIndividualStatus({
          status: error.response.status,
          data: error.response.data,
        });
        setIndividualLoading(false);
      } else if (error.request) {
        console.error("No response received from the server");
        setIndividualLoading(false);
      } else {
        console.error("Error during request setup:", error.message);
        setIndividualLoading(false);
      }
    }
  };
  return (
    <div>
      <div className="flex m-10 flex-col flex-wrap gap-6">
        <h1 className="text-center text-2xl text-accent">
          Enable Annual tuition
        </h1>

        <div className="flex flex-row justify-around items-center flex-wrap gap-6">
          <div className="flex flex-col gap-4 items-center">
            <div className="grid m-4 grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Year of completion</span>
                </label>
                <input
                  type="number"
                  min={0}
                  onChange={(e) => setYear(e.target.valueAsNumber)}
                  placeholder="Enter Year of completion"
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Year of Study</span>
                </label>
                <select
                  className="select select-bordered w-full max-w-xs"
                  onChange={(e) =>
                    setStudy(e.target.value as YearOfStudyString)
                  }
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            </div>
            {individualStatus ? (
              <div
                className={
                  individualStatus.status == 200
                    ? "alert alert-success shadow-lg my-4 w-96"
                    : "alert alert-error shadow-lg my-4 w-96"
                }
              >
                <div>
                  {individualStatus.status == 200 ? (
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
                  <span>{individualStatus.data.message}</span>
                </div>
              </div>
            ) : null}
            <button
              onClick={() => {
                handleEnable();
              }}
              className={
                individualLoading
                  ? "btn btn-primary loading px-8"
                  : "btn px-8 btn-primary"
              }
            >
              Enable Fee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Enable;
