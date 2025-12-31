"use client";

import { ReactNode } from "react";
import { InfoCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";

interface InfoBoxProps {
  type?: "info" | "warning" | "success";
  icon?: ReactNode;
  title?: string;
  children: ReactNode;
}

export default function InfoBox({ type = "info", icon, title, children }: InfoBoxProps) {
  const getStyles = () => {
    switch (type) {
      case "warning":
        return {
          container: "bg-yellow-50/50 rounded-lg p-3 border border-yellow-100",
          iconColor: "text-yellow-600",
        };
      case "success":
        return {
          container: "bg-green-50/50 rounded-lg p-4 border border-green-100",
          iconColor: "text-green-600",
        };
      default:
        return {
          container: "bg-blue-50/50 rounded-lg p-4 border border-blue-100",
          iconColor: "text-blue-500",
        };
    }
  };

  const styles = getStyles();
  const defaultIcon = type === "success" ? <QuestionCircleOutlined className={`${styles.iconColor} text-lg shrink-0 mt-0.5`} /> : <InfoCircleOutlined className={`${styles.iconColor} text-lg shrink-0 mt-0.5`} />;

  return (
    <div className={styles.container}>
      <div className="flex gap-3">
        {icon || defaultIcon}
        <div className="text-sm text-gray-700">
          {title && <p className="font-medium mb-1">{title}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}

