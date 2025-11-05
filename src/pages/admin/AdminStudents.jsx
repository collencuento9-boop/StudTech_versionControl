import React from "react";
import { AcademicCapIcon } from "@heroicons/react/24/solid";

export default function AdminStudents() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-5 border border-gray-300 border-b-red-800 border-b-4">
        <div className="flex items-center gap-4 mb-4">
          <AcademicCapIcon className="w-20 h-20 text-red-800 transition-transform duration-300 hover:scale-105 translate-x-[5px]" />
          <h2 className="text-5xl pl-5 font-bold text-gray-900">Students Management</h2>
        </div>
      </div>

      <p className="text-gray-600 mb-6">
        View, edit, and organize student profiles, LRNs, and enrollment data.
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-100">
          <h3 className="text-lg font-semibold text-red-800">Total Students</h3>
          <p className="text-2xl font-bold">3,000</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-100">
          <h3 className="text-lg font-semibold text-red-800">Enrolled This Semester</h3>
          <p className="text-2xl font-bold">2,850</p>
        </div>
      </div>
    </div>
  );
}
