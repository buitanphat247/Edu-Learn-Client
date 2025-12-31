"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Select } from "antd";
import { ArrowLeftOutlined, LeftOutlined, RightOutlined, PrinterOutlined } from "@ant-design/icons";
import CustomCard from "@/app/components/common/CustomCard";

const { Option } = Select;

interface ScheduleItem {
  id: string;
  day: number; // 1 = Monday, 7 = Sunday
  periodStart: number;
  periodEnd: number;
  location: string;
  course: string;
  courseCode: string;
  classGroup: string;
  periods: number;
  startTime: string;
  teacher: string;
  email: string;
  link?: string;
}

export default function ClassSchedule() {
  const router = useRouter();
  const params = useParams();
  const classId = params?.id as string;

  const [selectedYear, setSelectedYear] = useState("2025-2026");
  const [selectedSemester, setSelectedSemester] = useState("Học kỳ 1");
  const [selectedWeek, setSelectedWeek] = useState("22/12/2025-28/12/2025");

  // Mock schedule data - Replace with API data later
  const scheduleData: ScheduleItem[] = [
    {
      id: "1",
      day: 1, // Monday
      periodStart: 7,
      periodEnd: 11,
      location: "V403",
      course: "Toán 1",
      courseCode: "MATH132401",
      classGroup: "251MATH132401_68",
      periods: 5,
      startTime: "12g45",
      teacher: "Lê Thanh Cường",
      email: "cuongday09101999@gmail.com",
    },
    {
      id: "2",
      day: 3, // Wednesday
      periodStart: 7,
      periodEnd: 11,
      location: "A109",
      course: "Pháp luật đại cương",
      courseCode: "GELA236939",
      classGroup: "251GELA236939_19",
      periods: 5,
      startTime: "12g45",
      teacher: "Trương Thị Tường Vi",
      email: "vittt@hcmute.edu.vn",
    },
    {
      id: "3",
      day: 5, // Friday
      periodStart: 7,
      periodEnd: 11,
      location: "ONLINE",
      course: "Nhập môn lập trình",
      courseCode: "INPR140285",
      classGroup: "251INPR140285_02",
      periods: 5,
      startTime: "12g45",
      teacher: "Nguyễn Trần Thi Văn",
      email: "nttvan@hcmute.edu.vn",
      link: "https://meet.google.com/opv-ebwz-gyi",
    },
    {
      id: "4",
      day: 6, // Saturday
      periodStart: 7,
      periodEnd: 10,
      location: "A2-301",
      course: "Nhập môn lập trình",
      courseCode: "INPR140285",
      classGroup: "251INPR140285_02",
      periods: 4,
      startTime: "12g45",
      teacher: "Nguyễn Trần Thi Văn",
      email: "nttvan@hcmute.edu.vn",
    },
  ];

  // Get current week dates
  const weekDates = useMemo(() => {
    const [startDate, endDate] = selectedWeek.split("-");
    const start = new Date(startDate.split("/").reverse().join("-"));
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [selectedWeek]);

  // Get day names in Vietnamese
  const dayNames = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

  // Format date as DD/MM/YYYY
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Get schedule items for a specific day and period
  const getScheduleItem = (day: number, period: number): ScheduleItem | null => {
    return scheduleData.find(
      (item) => item.day === day && period >= item.periodStart && period <= item.periodEnd
    ) || null;
  };

  const handlePreviousWeek = () => {
    // Implement week navigation logic
  };

  const handleCurrentWeek = () => {
    // Implement current week logic
  };

  const handleNextWeek = () => {
    // Implement week navigation logic
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <CustomCard>
        <div className="space-y-4">
          {/* Dropdowns and Navigation */}
          <div className="flex flex-wrap items-center gap-4">
            <Select
              value={selectedYear}
              onChange={setSelectedYear}
              style={{ width: 150 }}
              size="middle"
            >
              <Option value="2025-2026">2025-2026</Option>
              <Option value="2024-2025">2024-2025</Option>
            </Select>

            <Select
              value={selectedSemester}
              onChange={setSelectedSemester}
              style={{ width: 150 }}
              size="middle"
            >
              <Option value="Học kỳ 1">Học kỳ 1</Option>
              <Option value="Học kỳ 2">Học kỳ 2</Option>
            </Select>

            <Select
              value={selectedWeek}
              onChange={setSelectedWeek}
              style={{ width: 250 }}
              size="middle"
            >
              <Option value="22/12/2025-28/12/2025">22/12/2025-28/12/2025</Option>
              <Option value="15/12/2025-21/12/2025">15/12/2025-21/12/2025</Option>
            </Select>

            <div className="flex items-center gap-2 ml-auto">
              <Button icon={<LeftOutlined />} onClick={handlePreviousWeek} size="middle" />
              <Button onClick={handleCurrentWeek} size="middle">
                Hiện tại
              </Button>
              <Button icon={<RightOutlined />} onClick={handleNextWeek} size="middle" />
              <Button icon={<ArrowLeftOutlined />} onClick={() => router.push(`/user/classes/${classId}`)} size="middle">
                Quay lại
              </Button>
            </div>
          </div>

          {/* Print Button */}
          <div>
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              onClick={handlePrint}
              size="middle"
            >
              In thời khóa biểu
            </Button>
          </div>
        </div>
      </CustomCard>

      {/* Timetable Grid */}
      <CustomCard>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-blue-600 text-white p-3 text-center font-semibold border border-blue-700 min-w-[80px]">
                  Tiết
                </th>
                {dayNames.map((dayName, index) => (
                  <th
                    key={index}
                    className="bg-blue-600 text-white p-3 text-center font-semibold border border-blue-700 min-w-[150px]"
                  >
                    {dayName} {formatDate(weekDates[index])}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 16 }, (_, i) => i + 1).map((period) => (
                <tr key={period}>
                  <td className="bg-blue-600 text-white p-2 text-center font-semibold border border-blue-700">
                    {period}
                  </td>
                  {dayNames.map((_, dayIndex) => {
                    const day = dayIndex + 1;
                    const item = getScheduleItem(day, period);
                    const isFirstPeriod = item && period === item.periodStart;

                    return (
                      <td
                        key={dayIndex}
                        className="border border-gray-300 p-0 align-top relative"
                        style={{ height: "60px" }}
                      >
                        {isFirstPeriod && item && (
                          <div
                            className="bg-blue-100 p-2 text-xs border border-blue-300 rounded h-full"
                            style={{
                              height: `${(item.periodEnd - item.periodStart + 1) * 60}px`,
                            }}
                          >
                            <div className="font-semibold text-gray-800">{item.location}</div>
                            <div className="text-gray-700">
                              {item.course} <span className="text-red-600">({item.courseCode})</span>
                            </div>
                            <div className="text-gray-600">LHP: {item.classGroup}</div>
                            <div className="text-gray-600">Tiết: {item.periodStart}-{item.periodEnd} | {item.startTime}</div>
                            <div className="text-gray-600">GV: {item.teacher}</div>
                            {item.link && (
                              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">
                                Link
                              </a>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CustomCard>
    </div>
  );
}


