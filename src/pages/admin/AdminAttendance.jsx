import React from "react";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/solid";

export default function AdminAttendance() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-5 border border-gray-300 border-b-red-800 border-b-4">
        <div className="flex items-center gap-4 mb-4">
          <ClipboardDocumentCheckIcon className="w-20 h-20 text-red-800 transition-transform duration-300 hover:scale-105 translate-x-[5px]" />
          <h2 className="text-5xl pl-5 font-bold text-gray-900">Attendance Monitoring</h2>
        </div>
      </div>

      <p className="text-gray-600 mb-6">
        Track daily attendance, absences, and tardiness across all classes.
      </p>

      <div className="bg-red-50 p-6 rounded-lg border border-red-100">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Today's Attendance Summary
        </h3>
        <ul className="text-gray-700 text-sm list-disc ml-5 space-y-1">
          <li>Present: 2,760 students</li>
          <li>Absent: 150 students</li>
          <li>Late: 90 students</li>
        </ul>
      </div>
    </div>
  );
}
