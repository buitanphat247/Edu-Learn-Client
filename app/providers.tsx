"use client";

import { ConfigProvider } from "antd";
import { SidebarColorProvider } from "@/app/contexts/SidebarColorContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "inherit",
        },
        components: {
          Button: {
            colorPrimary: "#1c91e3",
          },
        },
      }}
    >
      <SidebarColorProvider>{children}</SidebarColorProvider>
    </ConfigProvider>
  );
}

