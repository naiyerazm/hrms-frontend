"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { API_BASE } from "@/app/constants";
import Head from "next/head";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState("");

  // Attendance popup
  const [attendancePopup, setAttendancePopup] = useState({ show: false, employee: null });
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("present");
  

  // Create/Edit employee popup
  const [employeePopup, setEmployeePopup] = useState({ show: false, mode: "create", employee: null });
  const [employeeData, setEmployeeData] = useState({ full_name: "", email: "", department: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    const token = localStorage.getItem("access_token");

    fetch(`${API_BASE}/employee/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch employees");
        return res.json();
      })
      .then((data) => setEmployees(data))
      .catch((err) => console.error(err));
  };

  const filtered = employees.filter(
    (e) =>
      e.full_name.toLowerCase().includes(filter.toLowerCase()) ||
      e.department.toLowerCase().includes(filter.toLowerCase())
  );
  

  // Attendance popup
  const openAttendancePopup = (emp) => {
    setAttendancePopup({ show: true, employee: emp });
    setAttendanceDate(new Date().toISOString().slice(0, 10)); // default today
    setAttendanceStatus("present");
  };
  

  const submitAttendance = async () => {
    const token = localStorage.getItem("access_token");
    if (!attendancePopup.employee) return;

    try {
      const res = await fetch(`${API_BASE}/employee/attendance/${attendancePopup.employee.employee_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: attendanceDate, status: attendanceStatus }),
      });

      if (!res.ok) throw new Error("Failed to submit attendance");

      alert(`Attendance marked as ${attendanceStatus} for ${attendancePopup.employee.full_name}`);
      setAttendancePopup({ show: false, employee: null });
    } catch (err) {
      console.error(err);
      alert("Error submitting attendance");
    }
  };

  // Validate employee fields
  const validate = () => {
    const errs = {};
    if (!employeeData.full_name.trim()) errs.full_name = "Full name is required";
    if (!employeeData.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(employeeData.email)) errs.email = "Invalid email format";
    if (!employeeData.department.trim()) errs.department = "Department is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Create or Edit employee
  const submitEmployee = async () => {
    if (!validate()) return;

    const token = localStorage.getItem("access_token");
    const isEdit = employeePopup.mode === "edit";
    const url = isEdit
      ? `${API_BASE}/employee/${employeePopup.employee.employee_id}`
      : `${API_BASE}/employee`;

    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(employeeData),
      });

      if (!res.ok) throw new Error(isEdit ? "Failed to update employee" : "Failed to create employee");

      alert(`Employee ${isEdit ? "updated" : "created"} successfully`);
      setEmployeePopup({ show: false, mode: "create", employee: null });
      setEmployeeData({ full_name: "", email: "", department: "" });
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert("Error submitting employee data");
    }
  };

  // Delete employee
  const deleteEmployee = async (empId) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`${API_BASE}/employee/${empId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete employee");

      alert("Employee deleted successfully");
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert("Error deleting employee");
    }
  };

  // Open create or edit modal
  const openEmployeePopup = (mode, emp = null) => {
    setEmployeePopup({ show: true, mode, employee: emp });
    if (mode === "edit" && emp) {
      setEmployeeData({ full_name: emp.full_name, email: emp.email, department: emp.department });
    } else {
      setEmployeeData({ full_name: "", email: "", department: "" });
      setErrors({});
    }
  };

  return (
    <>
      <Head>
        <title>Employee List</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <div className="flex-1 ml-48 flex flex-col">
          <Header />

          <main className="flex-1 p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Employee List</h2>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <input
                type="text"
                placeholder="Search by name or department"
                className="border border-gray-300 p-2 rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <button
                onClick={() => openEmployeePopup("create")}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-md"
              >
                + Create Employee
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Full Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filtered.map((emp, idx) => (
                    <tr
                      key={emp.employee_id}
                      className={`transition-colors duration-200 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-indigo-50`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-700">{emp.employee_id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{emp.full_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{emp.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{emp.department}</td>
                      <td className="px-4 py-3 text-sm flex gap-2">
                        <button
                          onClick={() => openAttendancePopup(emp)}
                          className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-200 transition"
                        >
                          Attendance
                        </button>
                        <button
                          onClick={() => openEmployeePopup("edit", emp)}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-green-200 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteEmployee(emp.employee_id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-4 text-center text-gray-400">
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Attendance Popup */}
            {attendancePopup.show && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                  <h3 className="text-lg font-semibold mb-4">Mark Attendance - {attendancePopup.employee.full_name}</h3>
                  <label className="block mb-2">
                    Date:
                    <input
                      type="date"
                      className="border border-gray-300 rounded p-2 w-full mt-1"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                    />
                  </label>

                  <div className="mb-4">
                    <label className="inline-flex items-center mr-4">
                      <input
                        type="radio"
                        className="form-radio"
                        name="status"
                        value="present"
                        checked={attendanceStatus === "present"}
                        onChange={(e) => setAttendanceStatus(e.target.value)}
                      />
                      <span className="ml-2">Present</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="status"
                        value="absent"
                        checked={attendanceStatus === "absent"}
                        onChange={(e) => setAttendanceStatus(e.target.value)}
                      />
                      <span className="ml-2">Absent</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setAttendancePopup({ show: false, employee: null })}
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitAttendance}
                      className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Create/Edit Employee Popup */}
            {employeePopup.show && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h3 className="text-lg font-semibold mb-4">{employeePopup.mode === "edit" ? "Edit Employee" : "Create Employee"}</h3>

                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={employeeData.full_name}
                      onChange={(e) => setEmployeeData({ ...employeeData, full_name: e.target.value })}
                      className="border border-gray-300 rounded p-2 w-full mt-1"
                    />
                    {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name}</p>}
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={employeeData.email}
                      onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
                      className="border border-gray-300 rounded p-2 w-full mt-1"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>

                  <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Department</label>
  <select
    value={employeeData.department}
    onChange={(e) => setEmployeeData({ ...employeeData, department: e.target.value })}
    className="border border-gray-300 rounded p-2 w-full mt-1"
  >
    <option value="">Select Department</option>
    <option value="HR">HR</option>
    <option value="Finance">Finance</option>
    <option value="IT">IT</option>
    <option value="Sales">Sales</option>
    <option value="Marketing">Marketing</option>
    <option value="Operations">Operations</option>
    <option value="Customer Support">Customer Support</option>
  </select>
  {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
</div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEmployeePopup({ show: false, mode: "create", employee: null })}
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitEmployee}
                      className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Submit
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