import {
  SettingOutlined,
  BellOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Switch, Select, Button } from "antd";

export default function SettingsTab() {
  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Settings Header */}
      <div className="px-6 py-6 text-center border-b border-white/5">
        <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto mb-4 flex items-center justify-center">
          <SettingOutlined className="text-3xl text-slate-400" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Cài Đặt & Tuỳ Chọn</h2>
        <p className="text-sm text-slate-500 mt-1">Quản lý trải nghiệm của bạn</p>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar">
        {/* Section: Common */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">Chung</h3>

          <div className="bg-slate-800 p-4 rounded-xl flex items-center justify-between group hover:bg-slate-700/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <GlobalOutlined />
              </div>
              <div>
                <p className="font-medium text-slate-200 group-hover:text-white transition-colors">Ngôn ngữ</p>
                <p className="text-xs text-slate-400">Tiếng Việt</p>
              </div>
            </div>
            <RightOutlined className="text-slate-500 text-xs" />
          </div>

          <div className="bg-slate-800 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                <AppstoreOutlined />
              </div>
              <div>
                <p className="font-medium text-slate-200">Giao diện tối</p>
                <p className="text-xs text-slate-400">Luôn bật</p>
              </div>
            </div>
            <Switch defaultChecked size="small" className="bg-slate-600" />
          </div>
        </div>

        {/* Section: Notifications */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">Thông báo</h3>

          <div className="bg-slate-800 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <BellOutlined />
              </div>
              <div>
                <p className="font-medium text-slate-200">Âm thanh tin nhắn</p>
              </div>
            </div>
            <Switch defaultChecked size="small" className="bg-slate-600" />
          </div>
        </div>

        {/* Section: Privacy */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">Quyền riêng tư</h3>

          <div className="bg-slate-800 p-4 rounded-xl flex items-center justify-between group hover:bg-slate-700/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                <SafetyCertificateOutlined />
              </div>
              <div>
                <p className="font-medium text-slate-200 group-hover:text-white transition-colors">Bảo mật tài khoản</p>
                <p className="text-xs text-slate-400">Mật khẩu, 2FA</p>
              </div>
            </div>
            <RightOutlined className="text-slate-500 text-xs" />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 pb-8">
          <Button
            block
            danger
            icon={<LogoutOutlined />}
            className="bg-red-500/10 border-none h-11 text-red-500 hover:bg-red-500/20 hover:text-red-400 font-medium rounded-xl"
          >
            Đăng xuất
          </Button>
          <p className="text-center text-[10px] text-slate-600 mt-4">Version 1.0.0 • EduLearn</p>
        </div>
      </div>
    </div>
  );
}
