"use client";

import { ConfigProvider, App, theme as antTheme } from "antd";
import { ThemeProvider, useTheme } from "@/app/context/ThemeContext";

function AntdConfigProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          fontFamily: "inherit",
          colorBgContainer: theme === "dark" ? "#1f2937" : "#ffffff",
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

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AntdConfigProvider>{children}</AntdConfigProvider>
    </ThemeProvider>
  );
}

