import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Processing() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const intentId = 1234;
  useEffect(() => {
    if (location.state.feeId && location.state.amount) {
      setLoading(false);
      console.log("simulating payment...");
    }
  }, [location.state.feeId, location.state.amount]);
  const handleHome = () => {
    window.location.href = "/home";
  };
  const handleReceipt = async () => {
    const id = location.state.feeId;
    console.log("fee id", id);
    await axios
      .post(
        import.meta.env.VITE_BACKEND_URL + "/payment/download",
        {
          feeId: id,
          rollno: localStorage.getItem("rollno"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        const { fileLink } = res.data;
        const link = document.createElement("a");
        link.href = fileLink;
        link.target = "_blank";
        link.setAttribute("download", "Receipt-" + id + ".pdf");
        console.log(fileLink);
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="container mx-auto mt-40 text-center">
      {loading ? (
        <>
          <div role="status" className="flex items-center justify-center">
            <svg
              aria-hidden="true"
              className="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-5 text-gray-600 text-xl font-bold">
            Please do not go back or close the window until the payment is
            completed.
          </p>
          <p className="mt-5 text-gray-600 text-2xl font-bold">
            {" "}
            Fee Id:{location.state.feeId}
          </p>
        </>
      ) : (
        // Display success message after payment success
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-500 mx-auto mb-5 "
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm4.95-11.364l-6 6a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L9 10.586l5.536-5.536a1 1 0 011.414 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-green-500 text-xl font-bold">Payment Success!</h2>
          <p className="mt-5 text-gray-600 text-2xl font-bold">
            {" "}
            Fee Id:{location.state.feeId}
          </p>
          <p className="mt-5 text-gray-600 text-2xl font-bold">
            {" "}
            Payment Intent ID:{intentId}
          </p>
          <button className="btn btn-primary mt-5" onClick={handleReceipt}>
            View Receipt
          </button>
          <button className="btn btn-primary mt-5 m-3" onClick={handleHome}>
            Home
          </button>
        </div>
      )}
      {/* Display message to not go back until payment is done */}
    </div>
  );
}

export default Processing;
