"use client";

import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { Card, ConfigProvider, theme as antTheme, Tooltip } from "antd";
import { useTheme } from "@/app/context/ThemeContext";

export default function SystemStatusPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const services = [
    { name: "Website & Giao diện", status: "operational", description: "Truy cập trang web và điều hướng" },
    { name: "API Server", status: "operational", description: "Xử lý dữ liệu và yêu cầu người dùng" },
    { name: "Cơ sở dữ liệu", status: "operational", description: "Lưu trữ và truy xuất thông tin" },
    { name: "Hệ thống Video", status: "degraded", description: "Phát và tải video bài giảng", message: "Đang bảo trì server CDN Châu Á" },
    { name: "Cổng thanh toán", status: "operational", description: "Xử lý giao dịch Momo, VNPAY, Thẻ" },
    { name: "Hệ thống Email", status: "operational", description: "Gửi email xác nhận và thông báo" },
    { name: "Socket Real-time", status: "operational", description: "Chat và thông báo thời gian thực" },
    { name: "AI Services", status: "maintenance", description: "Gợi ý khóa học và Chatbot", message: "Đang nâng cấp model" },
  ];

  const incidents = [
    {
      date: "21 Tháng 01, 2026",
      title: "Bảo trì định kỳ hệ thống Video",
      status: "inprogress",
      updates: [
        { time: "22:00", text: "Bắt đầu quá trình bảo trì nâng cấp băng thông." },
        { time: "21:30", text: "Thông báo lịch bảo trì tới người dùng." },
      ]
    },
    {
      date: "15 Tháng 01, 2026",
      title: "Gián đoạn kết nối cổng thanh toán",
      status: "resolved",
      updates: [
        { time: "14:20", text: "Sự cố đã được khắc phục hoàn toàn." },
        { time: "13:45", text: "Đang điều tra nguyên nhân lỗi kết nối với đối tác ngân hàng." },
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "degraded": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "outage": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      case "maintenance": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default: return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational": return <CheckCircleOutlined />;
      case "degraded": return <WarningOutlined />;
      case "outage": return <CloseCircleOutlined />;
      case "maintenance": return <ClockCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "operational": return "Hoạt động tốt";
      case "degraded": return "Hiệu năng giảm";
      case "outage": return "Ngừng hoạt động";
      case "maintenance": return "Đang bảo trì";
      default: return "Không xác định";
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
      }}
    >
      <main className="min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors duration-500 pt-24 pb-20 px-4">
        
        {/* Header Section */}
        <div className="container mx-auto mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-6 animate-pulse">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                Hệ thống đang hoạt động ổn định
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-4">
                Trạng thái hệ thống
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Theo dõi thời gian thực trạng thái hoạt động của các dịch vụ và thành phần trong hệ thống Thư Viện Số.
            </p>
        </div>

        <div className="container mx-auto grid gap-12">
            
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {services.map((service, index) => (
                    <div 
                        key={index}
                        className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-slate-700 dark:text-slate-200">{service.name}</h3>
                            <Tooltip title={getStatusLabel(service.status)}>
                                <span className={`flex items-center justify-center w-8 h-8 rounded-full text-lg ${getStatusColor(service.status)}`}>
                                    {getStatusIcon(service.status)}
                                </span>
                            </Tooltip>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 min-h-[40px]">{service.description}</p>
                        {service.message && (
                            <div className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 inline-block">
                                {service.message}
                            </div>
                        )}
                        {!service.message && (
                             <div className="h-5"></div>
                        )}
                        
                        {/* Fake Uptime Bar */}
                        <div className="flex gap-[2px] mt-4 opacity-50">
                             {[...Array(20)].map((_, i) => (
                                 <div key={i} className="h-1 flex-1 rounded-full bg-emerald-500"></div>
                             ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Historical Uptime / Incidents */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* Uptime Legend / Info */}
                 <div className="lg:col-span-1">
                     <div className="sticky top-24">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Lịch sử sự cố</h2>
                        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
                             <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">Chú giải trạng thái</h4>
                             <div className="space-y-3">
                                 <div className="flex items-center gap-3">
                                     <CheckCircleOutlined className="text-emerald-500 text-lg" />
                                     <span className="text-slate-600 dark:text-slate-400">Hoạt động tốt</span>
                                 </div>
                                 <div className="flex items-center gap-3">
                                     <WarningOutlined className="text-amber-500 text-lg" />
                                     <span className="text-slate-600 dark:text-slate-400">Hiệu năng giảm</span>
                                 </div>
                                 <div className="flex items-center gap-3">
                                     <ClockCircleOutlined className="text-blue-500 text-lg" />
                                     <span className="text-slate-600 dark:text-slate-400">Đang bảo trì</span>
                                 </div>
                                 <div className="flex items-center gap-3">
                                     <CloseCircleOutlined className="text-rose-500 text-lg" />
                                     <span className="text-slate-600 dark:text-slate-400">Ngừng hoạt động</span>
                                 </div>
                             </div>
                        </div>
                     </div>
                 </div>

                 {/* Incident Timeline */}
                 <div className="lg:col-span-2 space-y-6">
                     {incidents.map((incident, idx) => (
                         <div key={idx} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm">
                              <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div>
                                      <div className="flex items-center gap-3 mb-1">
                                           <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${getStatusColor(incident.status)}`}>
                                               {incident.status === 'inprogress' ? 'Đang xử lý' : 'Đã giải quyết'}
                                           </span>
                                           <span className="text-slate-400 text-sm font-medium">{incident.date}</span>
                                      </div>
                                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">{incident.title}</h3>
                                  </div>
                              </div>
                              <div className="p-6 bg-slate-50/50 dark:bg-slate-900/20 space-y-6 relative">
                                  {/* Timeline Line */}
                                  <div className="absolute left-9 top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-700"></div>

                                  {incident.updates.map((update, uIdx) => (
                                      <div key={uIdx} className="relative pl-10">
                                          <div className="absolute left-[-11px] top-1.5 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-[#1e293b]"></div>
                                          <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{update.time}</div>
                                          <div className="text-slate-600 dark:text-slate-400">{update.text}</div>
                                      </div>
                                  ))}
                              </div>
                         </div>
                     ))}
                     
                     <div className="text-center pt-8">
                         <a href="#" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Xem lịch sử cũ hơn &rarr;</a>
                     </div>
                 </div>
            </div>

        </div>
      </main>
    </ConfigProvider>
  );
}
