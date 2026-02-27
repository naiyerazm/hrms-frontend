"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { API_BASE } from "@/app/constants";
import Head from "next/head";

export default function AttendanceList() {
  const [mounted, setMounted] = useState(false);
  const [month, setMonth] = useState(0); // 0 = January
  const [year, setYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [detailPopup, setDetailPopup] = useState({ show: false, employee: null, daily: [] });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    setMonth(new Date().getMonth());
    setMounted(true);
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        `${API_BASE}/employee/attendance/list?year=${year}&month=${month + 1}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch attendance");
      const data = await res.json();
      setAttendanceData(data);
    } catch (err) {
      console.error(err);
      setAttendanceData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (mounted) fetchAttendance();
  }, [mounted]);

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const openDetailPopup = async (employee) => {
  try {
    const token = localStorage.getItem("access_token");

    // Fetch daily attendance from API
    const res = await fetch(
      `${API_BASE}/employee/attendance/${employee.employee_id}?month=${month + 1}&year=${year}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch daily attendance");
    const data = await res.json();

    // Set the popup state with employee info + daily attendance
    setDetailPopup({ show: true, employee, daily: data });
  } catch (err) {
    console.error(err);
    setDetailPopup({ show: true, employee, daily: [] });
  }
};

  if (!mounted) return null;

  // Create a map of day => status
  const getStatusByDay = () => {
    const daysInMonth = getDaysInMonth(month, year);
    const dayMap = Array.from({ length: daysInMonth }, () => "Absent"); // default Absent

    detailPopup.daily.forEach((d) => {
      const dateObj = new Date(d.date);
      if (dateObj.getMonth() === month && dateObj.getFullYear() === year) {
        dayMap[dateObj.getDate() - 1] = d.status.charAt(0).toUpperCase() + d.status.slice(1); // Present/Absent
      }
    });

    return dayMap;
  };

  const dailyStatus = getStatusByDay();

  return (
    <>
      <Head>
        <title>Attendance List</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-48 flex flex-col">
          <Header />

          <main className="flex-1 p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Attendance - {monthNames[month]} {year}
            </h2>

            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-4 mb-6">
              <label className="flex items-center gap-2 text-gray-700">
                Month:
                <select
                  className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                >
                  {monthNames.map((name, idx) => (
                    <option key={idx} value={idx}>{name}</option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 text-gray-700">
                Year:
                <input
                  type="number"
                  className="border border-gray-300 rounded p-2 w-24 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                />
              </label>

              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-md"
                onClick={fetchAttendance}
              >
                {loading ? "Loading..." : "Get Attendance"}
              </button>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 text-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Employee ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Full Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Days Present</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Days Absent</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {attendanceData.map((emp, idx) => (
                    <tr
                      key={emp.employee_id}
                      className={`transition-colors duration-200 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-indigo-50`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-700">{emp.employee_id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{emp.full_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{emp.department}</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-medium">{emp.days_present}</td>
                      <td className="px-4 py-3 text-sm text-red-600 font-medium">{emp.days_absent}</td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-200 transition"
                          onClick={() => openDetailPopup(emp)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}

                  {attendanceData.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 text-center text-gray-400">
                        No attendance data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Detail Popup */}
            {detailPopup.show && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl overflow-x-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    Attendance Details - {detailPopup.employee.full_name}
                  </h3>

                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-gray-800">
                      <tr>
                        {Array.from({ length: getDaysInMonth(month, year) }, (_, i) => (
                          <th key={i} className="px-2 py-1 text-xs font-semibold uppercase text-center">
                            {i + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {dailyStatus.map((status, i) => {
                          const color = status === "Present" ? "text-green-600" : "text-red-600";
                          return (
                            <td key={i} className={`px-2 py-1 text-xs text-center font-medium ${color}`}>
                              {status}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setDetailPopup({ show: false, employee: null, daily: [] })}
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}