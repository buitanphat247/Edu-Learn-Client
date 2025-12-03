"use client";

export default function AdminWelcomeBanner() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <h1 className="text-3xl font-bold mb-2">{getGreeting()}, Admin Teacher!</h1>
      <p className="text-blue-100 text-lg">Chào mừng bạn quay trở lại. Dưới đây là tổng quan về hệ thống của bạn.</p>
    </div>
  );
}
