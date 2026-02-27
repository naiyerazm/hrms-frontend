"use client";

import { useState, useEffect } from "react";
import { login } from "@/lib/auth";
import { saveToken } from "@/lib/session";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mathAnswer, setMathAnswer] = useState("");
  const [error, setError] = useState("");

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  useEffect(() => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setNum1(n1);
    setNum2(n2);
    setCorrectAnswer(n1 * n2);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (parseInt(mathAnswer) !== correctAnswer) {
      setError("Incorrect answer to math challenge");
      return;
    }
    try {
      const data = await login(username, password);
      localStorage.setItem("access_token", data.access_token);
       router.push("/employee/list/");
    } catch (err) {
      setError("Invalid credentials");
    }
  }

  return (
    <>
      <Head>
        <title>HRMS Login</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="grid grid-cols-1 md:grid-cols-2 h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-50">
        {/* Left section */}
        <div className="hidden md:flex flex-col justify-center items-center p-12 relative bg-white bg-opacity-60 backdrop-blur-xl rounded-r-3xl shadow-xl">
          <h1 className="text-5xl font-extrabold text-blue-700 mb-3 tracking-tight animate-fadeIn">
            Welcome to HRMS
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-md animate-fadeIn delay-150">
            Access your Dashboard securely. Manage employees, attendance, and reports in one place.
          </p>

        </div>

        {/* Right section */}
        <div className="flex flex-col justify-center items-center p-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-10 shadow-2xl rounded-3xl w-full max-w-md border border-gray-200 hover:shadow-3xl transition-all duration-300"
          >
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 animate-fadeIn">
              Sign In
            </h2>

            {error && (
              <p className="text-red-600 bg-red-100 border border-red-300 p-2 rounded mb-4 text-center animate-shake">
                {error}
              </p>
            )}

            {/* Floating Label Input */}
            <div className="relative mb-4">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder=" "
                className="peer w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <label
                htmlFor="username"
                className="absolute left-3 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-blue-600 peer-focus:text-sm"
              >
                Email / Mobile No. / User ID
              </label>
            </div>

            <div className="relative mb-4">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className="peer w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <label
                htmlFor="password"
                className="absolute left-3 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-blue-600 peer-focus:text-sm"
              >
                Password
              </label>
            </div>

            <div className="relative mb-6">
              <label className="block mb-2 text-gray-700 font-medium">
                Solve this math: <span className="font-bold">{num1} × {num2}</span>
              </label>
              <input
                type="text"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                placeholder=" "
                className="peer w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-xl text-lg font-semibold shadow-md transition-transform transform hover:scale-105"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Tailwind animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
        .animate-fadeIn.delay-150 { animation-delay: 0.15s; }
        .animate-fadeIn.delay-300 { animation-delay: 0.3s; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease; }
      `}</style>
    </>
  );
}