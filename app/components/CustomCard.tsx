"use client";

import React from "react";

interface CustomCardProps {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  headerClassName?: string;
  bodyClassName?: string;
}

export default function CustomCard({
  children,
  title,
  className = "",
  style,
  headerClassName = "",
  bodyClassName = "",
}: CustomCardProps) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded ${className}`}
      style={style}
    >
      {title && (
        <div className={`px-6 py-4 border-b border-gray-200 ${headerClassName}`}>
          {typeof title === "string" ? (
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          ) : (
            title
          )}
        </div>
      )}
      <div className={`px-6 py-4 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
