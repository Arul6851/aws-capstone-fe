"use client";
import { useState } from "react";
import axios from "axios";
interface IndividualStatus {
  status: number;
  data: any;
}
function Setexam() {
  const [semester, setSemester] = useState("");
  const [dept, setDept] = useState("");
  const [exam, setExam] = useState("");
  const [others, setOthers] = useState("");
  const [loading, setLoading] = useState(false);
  const [individualStatus, setIndividualStatus] = useState<IndividualStatus>();
  const handleExam = async () => {
    console.log(dept, semester, exam, others);
    setLoading(true);
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/setfee/exam",
        {
          dept,
          semester,
          exam,
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
      setLoading(false);
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with an error status
        setIndividualStatus({
          status: error.response.status,
          data: error.response.data,
        });
        setLoading(false);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from the server");
        setLoading(false);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error during request setup:", error.message);
        setLoading(false);
      }
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg">
      <h1 className="text-center text-2xl font-semibold text-accent mb-8">
        Set Exam Fee
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Semester
          </label>
          <input
            type="number"
            value={semester}
            min={0}
            onChange={(e) => setSemester(e.target.value)}
            placeholder="Enter Semester"
            className="input w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            className="select w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exam Fee
          </label>
          <input
            type="number"
            value={exam}
            min={0}
            onChange={(e) => setExam(e.target.value)}
            placeholder="Enter Exam Fee"
            className="input w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Others
          </label>
          <input
            type="number"
            value={others}
            min={0}
            onChange={(e) => setOthers(e.target.value)}
            placeholder="Enter Other"
            className="input w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm"
          />
        </div>
      </div>

      {individualStatus && (
        <div
          className={`mt-6 p-4 rounded-lg text-white ${
            individualStatus.status === 200 ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {individualStatus.data.message}
        </div>
      )}

      <div className="text-center mt-6">
        <button
          onClick={handleExam}
          className={`btn btn-primary ${loading ? "loading" : ""}`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Setexam;
