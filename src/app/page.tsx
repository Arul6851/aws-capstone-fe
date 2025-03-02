"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/login";
const Login = () => {
  const [rollno, setRollno] = useState<string>("");
  const [passwd, setPasswd] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const button = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        button.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const validate = async () => {
    setLoading(true);
    if (rollno === "") {
      setError("Enter roll number");
      setLoading(false);
    } else if (passwd === "") {
      setError("Enter your password");
      setLoading(false);
    } else {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              rollno,
              encPass: passwd,
            } as User),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          setError(data.data.message);
          setLoading(false);
          return;
        }

        const data = await response.json();
        const { user } = data;

        localStorage.setItem("rollno", user.rollno);
        localStorage.setItem("token", user.token);
        localStorage.setItem("type", String(user.type));

        if (user) {
          if (user.type === 0) {
            router.push("/home");
          } else if (user.type === 1) {
            router.push("/admin");
          } else {
            setError("Invalid user type");
          }
        } else {
          setError("Invalid Credentials");
        }
      } catch (error: any) {
        console.error("Error:", error.message);
        setError("An error occurred");
      } finally {
        setLoading(false);
        setRollno("");
        setPasswd("");
        setTimeout(() => {
          setError(undefined);
        }, 5000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-100">
      <div className="flex flex-col gap-6 p-10 bg-base-200 border-base-300 border-2 shadow-xl rounded-lg">
        <div className="flex justify-center">
          <img src="/assets/licet.png" alt="Institution logo" className="" />
        </div>
        <h2 className="text-center font-bold text-2xl text-content">
          Fee Payment Portal
        </h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="rollno" className="text-sm font-medium text-content">
            Roll Number
          </label>
          <p className="text-xs text-primary">Hint - 21CS001</p>
          <input
            id="rollno"
            type="text"
            value={rollno}
            onChange={(e) => setRollno(e.target.value.toUpperCase())}
            className="text-content rounded-lg p-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-content"
          >
            Password
          </label>
          <p className="text-xs text-primary">Hint - YYYY-MM-DD (DOB)</p>
          <div className="flex items-center gap-2">
            <input
              id="password"
              type={show ? "text" : "password"}
              value={passwd}
              onChange={(p) => setPasswd(p.target.value)}
              className="text-black rounded-lg p-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 flex-grow"
            />
            <button
              className="text-xs text-slate-500 hover:text-blue-600"
              onClick={() => setShow(!show)}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {error && (
          <div className=" alert alert-error shadow-lg">
            <div className="flex gap-2">
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
              <span>{error}</span>
            </div>
          </div>
        )}
        <button
          ref={button}
          className={`btn ${
            loading ? "btn-primary loading" : "btn-primary"
          } p-2 mt-5 hover:bg-info focus:outline-none focus:ring-2 focus:ring-info focus:ring-offset-2`}
          onClick={validate}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default Login;
