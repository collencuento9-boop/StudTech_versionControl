import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  CalendarIcon,
  AcademicCapIcon,
  TrophyIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import axios from "../../api/axiosConfig";

export default function ReportsPage() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [subjectsData, setSubjectsData] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [stats, setStats] = useState({
    attendanceRate: 0,
    classAverage: 0,
    lateStudents: 0,
    honorStudents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportsData();
  }, [selectedSection]);

  const loadReportsData = async () => {
    try {
      setLoading(true);

      // Fetch students
      const studentsResponse = await axios.get('/students');
      let students = Array.isArray(studentsResponse.data.data) 
        ? studentsResponse.data.data 
        : Array.isArray(studentsResponse.data) 
        ? studentsResponse.data 
        : [];

      // Filter by section if selected
      if (selectedSection) {
        students = students.filter(s => `${s.gradeLevel} - ${s.section}` === selectedSection);
      }

      // Fetch attendance data
      const attendanceResponse = await axios.get('/attendance');
      const allAttendance = Array.isArray(attendanceResponse.data.data) 
        ? attendanceResponse.data.data 
        : Array.isArray(attendanceResponse.data) 
        ? attendanceResponse.data 
        : [];

      // Calculate weekly attendance (last 7 days)
      const today = new Date();
      const weekData = {};
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = days[date.getDay()];
        
        const dayRecords = allAttendance.filter(r => r.date === dateStr);
        const present = dayRecords.filter(r => r.status === 'Present').length;
        const absent = dayRecords.filter(r => r.status === 'Absent').length;
        
        weekData[dayName] = { day: dayName, present: present || 0, absent: absent || 0 };
      }

      setAttendanceData(Object.values(weekData));

      // Calculate subject averages
      const subjectAvgs = {};
      students.forEach(student => {
        if (student.grades) {
          Object.entries(student.grades).forEach(([subject, grades]) => {
            if (!subjectAvgs[subject]) {
              subjectAvgs[subject] = { subject, total: 0, count: 0 };
            }
            const q1 = grades.q1 || 0;
            if (q1 > 0) {
              subjectAvgs[subject].total += q1;
              subjectAvgs[subject].count += 1;
            }
          });
        }
      });

      const finalSubjectData = Object.values(subjectAvgs).map(s => ({
        subject: s.subject,
        average: s.count > 0 ? Math.round(s.total / s.count) : 0
      }));

      setSubjectsData(finalSubjectData.slice(0, 5));

      // Get top performing students
      const topPerformers = students
        .filter(s => s.average && s.average > 0)
        .sort((a, b) => (b.average || 0) - (a.average || 0))
        .slice(0, 3)
        .map((s, idx) => ({
          rank: idx + 1,
          name: `${s.lastName}, ${s.firstName}`,
          avg: s.average || 0
        }));

      setTopStudents(topPerformers);

      // Calculate statistics
      const totalStudents = students.length;
      const presentToday = allAttendance.filter(r => r.date === new Date().toISOString().split('T')[0] && r.status === 'Present').length;
      const lateToday = allAttendance.filter(r => r.date === new Date().toISOString().split('T')[0] && r.status === 'Late').length;
      const classAverage = students.length > 0 
        ? Math.round(students.reduce((sum, s) => sum + (s.average || 0), 0) / students.length * 10) / 10
        : 0;
      const honorStudents = students.filter(s => (s.average || 0) >= 90).length;

      setStats({
        attendanceRate: totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100 * 10) / 10 : 0,
        classAverage: classAverage,
        lateStudents: lateToday,
        honorStudents: honorStudents
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading reports data:', error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6 border border-gray-300 border-b-red-800 border-b-4 flex items-center justify-between print:hidden">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <AcademicCapIcon className="w-12 h-12 text-red-800" />
          Reports & Analytics
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-7 h-7 text-red-700" />
            <span className="font-semibold text-gray-800">Section:</span>
          </div>

          <div className="relative">
            <select
              value={selectedSection}
              onClick={() => setShowDropdown(!showDropdown)}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setShowDropdown(false);
              }}
              onBlur={() => setShowDropdown(false)}    
              className="px-5 py-3 pr-12 bg-red-50 border-2 border-red-300 rounded-xl font-bold text-red-800 text-base focus:outline-none focus:ring-3 focus:ring-red-100 appearance-none cursor-pointer transition-all"
            >
              <option value="">All Sections</option>
              <option value="Grade 1 - Love">Grade 1 - Love</option>
              <option value="Grade 1 - Humility">Grade 1 - Humility</option>
              <option value="Grade 2 - Kindness">Grade 2 - Kindness</option>
              <option value="Grade 3 - Wisdom">Grade 3 - Wisdom</option>
              <option value="Grade 3 - Diligence">Grade 3 - Diligence</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <ChevronDownIcon
                className="w-5 h-5 text-red-800 transition-transform duration-300 ease-in-out"
                style={{
                  transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)"
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-xl">
          <p className="text-4xl font-bold">{stats.attendanceRate}%</p>
          <p className="text-lg mt-2 opacity-90">Attendance Rate</p>
          <p className="text-sm opacity-80">Today</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl">
          <p className="text-4xl font-bold">{stats.classAverage}</p>
          <p className="text-lg mt-2 opacity-90">Class Average</p>
          <p className="text-sm opacity-80">All subjects</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-6 shadow-xl">
          <p className="text-4xl font-bold">{stats.lateStudents}</p>
          <p className="text-lg mt-2 opacity-90">Late Students</p>
          <p className="text-sm opacity-80">Today</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl p-6 shadow-xl">
          <p className="text-4xl font-bold">{stats.honorStudents}</p>
          <p className="text-lg mt-2 opacity-90">Honor Students</p>
          <p className="text-sm opacity-80">With honors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-2xl p-5 border border-gray-200 h-[400px] w-[550px]">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Weekly Attendance Trend</h3>
          <ResponsiveContainer width={"100%"} height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" />
              <XAxis dataKey="day" stroke="#374151" fontSize={12} />
              <YAxis domain={[0, 40]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "2px solid #dc2626", borderRadius: "12px" }}
                labelStyle={{ color: "#dc2626", fontWeight: "bold" }}
              />
              <Line type="monotone" dataKey="present" stroke="#dc2626" strokeWidth={3} dot={{ fill: "#dc2626", r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 h-[400px] w-[550px]">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Subject Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectsData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" />
              <XAxis dataKey="subject" angle={-15} textAnchor="end" height={60} fontSize={13} />
              <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
              <Tooltip />
              <Bar dataKey="average" radius={[12, 12, 0, 0]} fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

<div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 h-[400px] w-full">
  <div className="bg-gradient-to-r from-red-800 to-red-900 text-white px-6 py-5 text-center">
    <h3 className="text-2xl font-bold flex items-center justify-center gap-4">
      <TrophyIcon className="w-6 h-6" />
      Top Performing Students
    </h3>
  </div>

  <div className="p-6 h-[calc(100%-90px)] overflow-y-auto">
    <div className="space-y-6">
      {loading ? (
        <p className="text-center text-gray-500">Loading top students...</p>
      ) : topStudents.length === 0 ? (
        <p className="text-center text-gray-500">No students found</p>
      ) : (
        topStudents.map((student) => (
          <div
            key={student.rank}
            className="flex items-center justify-between p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200 hover:shadow-lg transition h-[80px]"
          >
            <div className="flex items-center gap-6">
              <div
                className={`text-xl font-bold ${
                  student.rank === 1
                    ? "text-yellow-500"
                    : student.rank === 2
                    ? "text-gray-400"
                    : "text-orange-600"
                }`}
              >
                #{student.rank}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{student.name}</p>
                <p className="text-base text-gray-600">General Average</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xl font-bold text-red-700">{student.avg}</p>
              <p className="text-base font-semibold text-red-800">With Honors</p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
</div>
    </div>
  );
}