"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState("");
  const pathname = usePathname();

  const toggle = (menu) => setOpenMenu(openMenu === menu ? "" : menu);

  const sections = [
    {
      title: "Employee Management",
      id: "emp",
      items: [
        { title: "Employee List", url: "/employee/list" },
        { title: "Attendance Record", url: "/attendance/list/" },
      ],
    },
  ];

  return (
    <aside className="w-48 bg-white text-gray-800 fixed h-full shadow-lg border-r border-gray-200 pt-4">
  {/* Header */}
  <div className="px-4 py-3 border-b border-gray-200">
    <div className="text-sm font-semibold text-center">HRMS Dashboard</div>
  </div>

  {/* Menu */}
  <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-56px)] mt-2">
    {sections.map((section) => {
      const isOpen = openMenu === section.id;
      return (
        <div key={section.id} className="rounded">
          {/* Section toggle */}
          <button
            onClick={() => toggle(section.id)}
            className="w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded hover:bg-gray-100 transition-colors"
            aria-expanded={isOpen}
            type="button"
          >
            <span className="truncate">{section.title}</span>
            <ChevronDown
              className={`w-4 h-4 transform transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Section items */}
          {isOpen && (
            <div className="mt-1 ml-3 border-l border-gray-200 pl-2 space-y-1">
              {section.items.map((item, idx) => {
                const href = item.url;
                const active = pathname === href;
                return (
                  <Link
                    key={idx}
                    href={href}
                    className={`block text-[13px] py-1 px-2 rounded-md transition
                      ${
                        active
                          ? "bg-gray-200 font-semibold"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    })}
  </nav>
</aside>
  );
}