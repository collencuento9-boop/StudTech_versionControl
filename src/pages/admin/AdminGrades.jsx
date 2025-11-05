import React from "react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/solid";

export default function AdminGrades() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-5 border border-gray-300 border-b-red-800 border-b-4">
        <div className="flex items-center gap-4 mb-4">
          <ClipboardDocumentIcon className="w-20 h-20 text-red-800 transition-transform duration-300 hover:scale-105 translate-x-[5px]" />
          <h2 className="text-5xl pl-5 font-bold text-gray-900">Grades Management</h2>
        </div>
      </div>

      <p className="text-gray-600 mb-6">
        Monitor, update, and review student grades across all subjects.
      </p>

      <div className="bg-red-50 p-6 rounded-lg border border-red-100">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Recent Grade Updates
        </h3>
        <ul className="text-gray-700 text-sm list-disc ml-5 space-y-1">
          <li>Juan Dela Cruz — Math 95 → 97</li>
          <li>Maria Santos — English 89 → 91</li>
          <li>Mark Reyes — Science 92 → 90</li>
        </ul>
      </div>
    </div>
  );
}
