import React from "react";
import { BuildingLibraryIcon } from "@heroicons/react/24/solid";

export default function AdminClasses() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-5 border border-gray-300 border-b-red-800 border-b-4">
        <div className="flex items-center gap-4 mb-4">
          <BuildingLibraryIcon className="w-20 h-20 text-red-800 transition-transform duration-300 hover:scale-105 translate-x-[5px]" />
          <h2 className="text-5xl pl-5 font-bold text-gray-900">Classes Management</h2>
        </div>
      </div>

      <p className="text-gray-600 mb-6">
        Manage class sections, subjects, and teacher assignments.
      </p>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-red-50 rounded-lg p-4 border border-red-100 text-center">
          <h3 className="text-lg font-semibold text-red-800">Total Classes</h3>
          <p className="text-2xl font-bold">25</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-100 text-center">
          <h3 className="text-lg font-semibold text-red-800">Active Sections</h3>
          <p className="text-2xl font-bold">23</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-100 text-center">
          <h3 className="text-lg font-semibold text-red-800">Subjects Offered</h3>
          <p className="text-2xl font-bold">62</p>
        </div>
      </div>
    </div>
  );
}
