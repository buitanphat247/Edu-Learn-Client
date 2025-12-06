"use client";

import React, { ReactNode } from "react";

interface CustomCardProps {
  children: ReactNode;
  title?: string | ReactNode;
  className?: string;
  style?: React.CSSProperties;
  headerClassName?: string;
  bodyClassName?: string;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

const paddingClasses = {
  none: "p-0",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export default function CustomCard({
  children,
  title,
  className = "",
  style,
  headerClassName = "",
  bodyClassName = "",
  padding = "md",
  onClick,
}: CustomCardProps) {
  if (title) {
    return (
      <div
        className={`bg-white border border-gray-200 rounded-xl ${className}`}
        style={style}
        onClick={onClick}
      >
        <div
          className={`px-6 py-4 border-b border-gray-200 ${headerClassName}`}
        >
          {typeof title === "string" ? (
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          ) : (
            title
          )}
        </div>
        <div className={`px-6 py-4 ${bodyClassName}`}>{children}</div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl transition-all duration-300 ${
        paddingClasses[padding]
      } ${className} ${onClick ? "cursor-pointer" : ""}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
