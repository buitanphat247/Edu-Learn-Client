"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Switch, Divider, message, Avatar, Spin, App } from "antd";
import {
  UserOutlined,
  LockOutlined,
  BellOutlined,
  SecurityScanOutlined,
  SaveOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { getUserInfo, type UserInfoResponse } from "@/lib/api/users";
import { getUserIdFromCookie } from "@/lib/utils/cookies";

interface SettingsFormData {
  fullname: string;
  email: string;
  phone: string;
  username: string;
}

export default function UserSettings() {
  const { message: messageApi } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(true);

  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = getUserIdFromCookie();
      if (!userId) {
        messageApi.error("Không tìm thấy thông tin người dùng");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const user = await getUserInfo(userId);
        setUserInfo(user);
        form.setFieldsValue({
          fullname: user.fullname,
          email: user.email,
          phone: user.phone,
          username: user.username,
        });
      } catch (error: any) {
        messageApi.error(error?.message || "Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [form, messageApi]);

  const handleSaveProfile = async (values: SettingsFormData) => {
    try {
      setSaving(true);
      // TODO: Call API to update user profile
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      messageApi.success("Đã cập nhật thông tin thành công");
    } catch (error: any) {
      messageApi.error(error?.message || "Không thể cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      // TODO: Call API to save notification settings
      await new Promise((resolve) => setTimeout(resolve, 500));
      messageApi.success("Đã lưu cài đặt thông báo");
    } catch (error: any) {
      messageApi.error("Không thể lưu cài đặt");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async () => {
    try {
      setSaving(true);
      // TODO: Call API to save security settings
      await new Promise((resolve) => setTimeout(resolve, 500));
      messageApi.success("Đã lưu cài đặt bảo mật");
    } catch (error: any) {
      messageApi.error("Không thể lưu cài đặt");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "A";
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  // Custom Card Component
  const CustomCard = ({ title, children }: { title?: React.ReactNode; children: React.ReactNode }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {title && <div className="mb-6">{title}</div>}
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <CustomCard
        title={
          <div className="flex items-center gap-3">
            <UserOutlined className="text-blue-600" />
            <span className="text-lg font-semibold">Thông tin tài khoản</span>
          </div>
        }
      >
        <div className="flex items-start gap-6 mb-6">
          <Avatar
            size={100}
            src={userInfo?.avatar}
            icon={<UserOutlined />}
            className="bg-blue-600 flex items-center justify-center text-white text-2xl font-bold"
          >
            {userInfo?.fullname ? getInitials(userInfo.fullname) : "A"}
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{userInfo?.fullname || "Học sinh"}</h3>
            <p className="text-gray-600 mb-1">@{userInfo?.username || "student"}</p>
            <p className="text-sm text-gray-500">{userInfo?.role?.role_name || "Học sinh"}</p>
          </div>
        </div>

        <Divider />

        <Form form={form} layout="vertical" onFinish={handleSaveProfile}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Họ và tên"
              name="fullname"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" size="large" />
            </Form.Item>

            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập tên đăng nhập" size="large" disabled />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Nhập email" size="large" />
            </Form.Item>

            <Form.Item label="Số điện thoại" name="phone">
              <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" size="large" />
            </Form.Item>
          </div>

          <div className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
              loading={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </CustomCard>

      {/* Notification Settings */}
      <CustomCard
        title={
          <div className="flex items-center gap-3">
            <BellOutlined className="text-blue-600" />
            <span className="text-lg font-semibold">Cài đặt thông báo</span>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-semibold text-gray-800">Thông báo qua email</p>
              <p className="text-sm text-gray-500">Nhận thông báo quan trọng qua email</p>
            </div>
            <Switch checked={emailNotifications} onChange={setEmailNotifications} />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-semibold text-gray-800">Thông báo đẩy</p>
              <p className="text-sm text-gray-500">Nhận thông báo ngay trên trình duyệt</p>
            </div>
            <Switch checked={pushNotifications} onChange={setPushNotifications} />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold text-gray-800">Cập nhật hệ thống</p>
              <p className="text-sm text-gray-500">Nhận thông báo về các cập nhật hệ thống</p>
            </div>
            <Switch checked={systemUpdates} onChange={setSystemUpdates} />
          </div>
        </div>

        <div className="mt-6">
          <Button
            type="primary"
            icon={<SaveOutlined />}
            size="large"
            loading={saving}
            onClick={handleSaveNotifications}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Lưu cài đặt
          </Button>
        </div>
      </CustomCard>

      {/* Security Settings */}
      <CustomCard
        title={
          <div className="flex items-center gap-3">
            <SecurityScanOutlined className="text-blue-600" />
            <span className="text-lg font-semibold">Bảo mật</span>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-semibold text-gray-800">Xác thực hai yếu tố (2FA)</p>
              <p className="text-sm text-gray-500">Bảo vệ tài khoản của bạn bằng xác thực hai yếu tố</p>
            </div>
            <Switch checked={twoFactorAuth} onChange={setTwoFactorAuth} />
          </div>

          <div className="mt-6">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              size="large"
              loading={saving}
              onClick={handleSaveSecurity}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Lưu cài đặt
            </Button>
          </div>
        </div>
      </CustomCard>

      {/* Change Password */}
      <CustomCard
        title={
          <div className="flex items-center gap-3">
            <LockOutlined className="text-blue-600" />
            <span className="text-lg font-semibold">Đổi mật khẩu</span>
          </div>
        }
      >
        <Form layout="vertical" onFinish={(values) => {
          // TODO: Implement password change
          messageApi.success("Đã đổi mật khẩu thành công");
        }}>
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu hiện tại" size="large" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" size="large" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" size="large" />
          </Form.Item>

          <div className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Đổi mật khẩu
            </Button>
          </div>
        </Form>
      </CustomCard>
    </div>
  );
}
