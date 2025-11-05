import React from "react";
import { DocumentChartBarIcon } from "@heroicons/react/24/solid";

export default function AdminReports() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-5 border border-gray-300 border-b-red-800 border-b-4">
        <div className="flex items-center gap-4 mb-4">
          <DocumentChartBarIcon className="w-20 h-20 text-red-800 transition-transform duration-300 hover:scale-105 translate-x-[5px]" />
          <h2 className="text-5xl pl-5 font-bold text-gray-900">Reports and Analytics</h2>
        </div>
      </div>

      <p className="text-gray-600 mb-6">
        Visualize trends in grades, attendance, and performance statistics.
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 className="text-lg font-semibold text-red-800">Top Performing Class</h3>
          <p className="text-2xl font-bold">Grade 6 - Section A</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 className="text-lg font-semibold text-red-800">Average Passing Rate</h3>
          <p className="text-2xl font-bold">93%</p>
        </div>
      </div>
    </div>
  );
}
