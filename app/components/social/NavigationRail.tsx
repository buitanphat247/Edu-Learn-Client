import React from "react";
import { useRouter } from "next/navigation";
import { MessageOutlined, ContactsOutlined, CloudOutlined, SettingOutlined, HomeOutlined } from "@ant-design/icons";

interface NavigationRailProps {
  bottomTab: "messages" | "contacts" | "cloud" | "settings";
  setBottomTab: (tab: "messages" | "contacts" | "cloud" | "settings") => void;
}

export default function NavigationRail({ bottomTab, setBottomTab }: NavigationRailProps) {
  const router = useRouter();

  return (
    <nav className="w-[64px] bg-slate-900 border-r border-slate-800 flex flex-col items-center py-6 gap-6 shrink-0 z-20">
      {/* Main Navigation Icons */}
      <div className="flex flex-col gap-4 w-full px-2">
        <button
          onClick={() => setBottomTab("messages")}
          title="Tin nhắn"
          className={`w-12 h-12 rounded-xl transition-all duration-200 border-none cursor-pointer flex items-center justify-center mx-auto ${
            bottomTab === "messages" || bottomTab === null
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "text-slate-400 hover:bg-slate-800 hover:text-white bg-transparent"
          }`}
        >
          <MessageOutlined className="text-xl" />
        </button>

        <button
          onClick={() => setBottomTab("contacts")}
          title="Danh bạ"
          className={`w-12 h-12 rounded-xl transition-all duration-200 border-none cursor-pointer flex items-center justify-center mx-auto ${
            bottomTab === "contacts"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "text-slate-400 hover:bg-slate-800 hover:text-white bg-transparent"
          }`}
        >
          <ContactsOutlined className="text-xl" />
        </button>

        <button
          onClick={() => setBottomTab("cloud")}
          title="Cloud của tôi"
          className={`w-12 h-12 rounded-xl transition-all duration-200 border-none cursor-pointer flex items-center justify-center mx-auto ${
            bottomTab === "cloud"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "text-slate-400 hover:bg-slate-800 hover:text-white bg-transparent"
          }`}
        >
          <CloudOutlined className="text-xl" />
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Actions */}
      <div className="flex flex-col gap-4 w-full px-2 mb-2">
        <button
          onClick={() => setBottomTab("settings")}
          title="Cài đặt"
          className={`w-12 h-12 rounded-xl transition-all duration-200 border-none cursor-pointer flex items-center justify-center mx-auto ${
            bottomTab === "settings"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "text-slate-400 hover:bg-slate-800 hover:text-white bg-transparent"
          }`}
        >
          <SettingOutlined className="text-xl" />
        </button>

        <div className="w-8 h-[1px] bg-slate-700/50 mx-auto my-1"></div>

        <button
          onClick={() => router.push("/")}
          title="Trang chủ"
          className="w-12 h-12 rounded-xl hover:bg-slate-800 hover:text-white text-slate-400 transition-all duration-200 border-none bg-transparent cursor-pointer flex items-center justify-center mx-auto"
        >
          <HomeOutlined className="text-xl" />
        </button>
      </div>
    </nav>
  );
}
