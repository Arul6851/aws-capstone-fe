"use client";
import { useState, useEffect } from "react";
import axios from "axios";
interface IndividualStatus {
  status: number;
  data: any;
}
function Settution() {
  const [tuition, setTuition] = useState(0);
  const [year, setYear] = useState(0);
  const [quota, setQuota] = useState("");
  const [roll, setRoll] = useState("");
  const [development, setDevelopment] = useState(0);
  const [placement, setPlacement] = useState(0);
  const [others, setOthers] = useState(0);
  const [total, setTotal] = useState(0);
  const [Individual, setIndividual] = useState(false);
  const [individualLoading, setIndividualLoading] = useState(false);
  const [individualStatus, setIndividualStatus] = useState<IndividualStatus>();
  useEffect(() => {
    setTotal(
      (tuition ? tuition : 0) +
        (development ? development : 0) +
        (placement ? placement : 0) +
        (others ? others : 0)
    );
  }, [tuition, development, placement, others]);

  const handleIndividual = async () => {
    console.log(year, tuition, placement, development, quota, others);
    setIndividualLoading(true);
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/setfee/tuition/base",
        {
          academic: year,
          tuition,
          placement,
          development,
          quota,
          others,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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
  const handleScolarship = async () => {
    console.log(roll, tuition, placement, development, others);
    setIndividualLoading(true);
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/setfee/tuition/scholar",
        {
          rollNo: roll,
          tuition,
          placement,
          development,
          others,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-center text-2xl font-semibold text-accent mb-6">
        Set Annual Tuition
      </h1>

      <div className="flex flex-col items-center gap-6">
        <div className="relative inline-block w-10 mr-2 align-middle select-none">
          <input
            type="checkbox"
            name="toggle"
            id="toggle"
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-sky-600 border-4 appearance-none cursor-pointer"
            checked={Individual}
            onChange={() => setIndividual(!Individual)}
          />
          <label
            htmlFor="toggle"
            className="toggle-label block overflow-hidden h-6 rounded-full bg-sky-600 cursor-pointer"
          >
            <span
              className={`block h-6 w-6 rounded-full bg-sky-200 shadow transform transition-transform duration-300 ease-in-out ${
                Individual ? "translate-x-4" : "translate-x-0"
              }`}
            ></span>
          </label>
        </div>
        <label htmlFor="toggle" className="text-sm font-medium text-gray-900">
          Set Individual Fee
        </label>

        <div className="w-full">
          {!Individual ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Year of Completion
                </label>
                <input
                  type="number"
                  min={0}
                  onChange={(e) => setYear(e.target.valueAsNumber)}
                  placeholder="Enter Year of Completion"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Quota
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => setQuota(e.target.value)}
                >
                  <option value=""></option>
                  <option value="MQ">MQ</option>
                  <option value="GQ">GQ</option>
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Roll Number
              </label>
              <input
                type="text"
                onChange={(e) => setRoll(e.target.value.toUpperCase())}
                value={roll}
                placeholder="Enter Roll Number"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          {/* Fee Inputs */}
          {["Tuition Fee", "Development Fee", "Placement Fee", "Others"].map(
            (fee, index) => (
              <div key={index} className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  {fee}
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder={`Enter ${fee}`}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => {
                    const value = e.target.valueAsNumber;
                    switch (fee) {
                      case "Tuition Fee":
                        setTuition(value);
                        break;
                      case "Development Fee":
                        setDevelopment(value);
                        break;
                      case "Placement Fee":
                        setPlacement(value);
                        break;
                      case "Others":
                        setOthers(value);
                        break;
                      default:
                        break;
                    }
                  }}
                />
              </div>
            )
          )}
        </div>

        <h2 className="text-xl font-semibold">Total Fee: {total}</h2>

        {individualStatus && (
          <div
            className={`mt-4 w-full text-center py-2 rounded-lg text-white ${
              individualStatus.status === 200 ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {individualStatus.data.message}
          </div>
        )}

        <button
          onClick={() =>
            !Individual ? handleIndividual() : handleScolarship()
          }
          className={`${
            individualLoading ? "loading " : ""
          }btn btn-primary mt-4 px-8`}
        >
          Set Fee
        </button>
      </div>
    </div>
  );
}

export default Settution;
