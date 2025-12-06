"use client";

export default function ClassChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full border border-gray-200 rounded-md overflow-hidden">{children}</div>;
}


