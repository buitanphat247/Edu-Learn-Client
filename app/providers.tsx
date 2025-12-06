"use client";

import { ConfigProvider, App } from "antd";

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
      <App>{children}</App>
    </ConfigProvider>
  );
}

