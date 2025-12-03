"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, Input, Button, Space } from "antd";
import { SendOutlined, PaperClipOutlined, SmileOutlined, UserOutlined, PhoneOutlined, VideoCameraOutlined } from "@ant-design/icons";
import CustomCard from "@/app/components/CustomCard";
import type { ChatMessage } from "./types";

interface ChatCenterProps {
  messages: ChatMessage[];
  currentUserId: string;
  groupName: string;
  onSendMessage: (content: string) => void;
}

export default function ChatCenter({ messages, currentUserId, groupName, onSendMessage }: ChatCenterProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar size={40} icon={<UserOutlined />} className="bg-linear-to-br from-blue-400 to-purple-400">
              {groupName.charAt(0)}
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-800">{groupName}</h3>
              <p className="text-xs text-gray-500">Nhóm chat lớp học</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              icon={<PhoneOutlined />}
              className="cursor-pointer"
              onClick={() => {
                // Handle normal call
                console.log("Normal call clicked");
              }}
            />
            <Button
              icon={<VideoCameraOutlined />}
              className="cursor-pointer"
              onClick={() => {
                // Handle video call
                console.log("Video call clicked");
              }}
            />
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-3">
          {messages.map((message) => {
            const isOwn = message.isOwn || message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar
                  size={36}
                  icon={<UserOutlined />}
                  src={message.senderAvatar}
                  className="bg-linear-to-br from-blue-400 to-purple-400 flex-shrink-0"
                >
                  {message.senderName.charAt(0).toUpperCase()}
                </Avatar>
                <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-[70%]`}>
                  {!isOwn && (
                    <span className="text-xs text-gray-500 mb-1 px-1">{message.senderName}</span>
                  )}
                  <div
                    className={`rounded px-3 py-2 ${
                      isOwn
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words m-0">{message.content}</p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 px-1">{message.timestamp}</span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-2">
          <Button icon={<PaperClipOutlined />} className="cursor-pointer flex-shrink-0" />
          <Input.TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="cursor-text rounded"
          />
          <Button icon={<SmileOutlined />} className="cursor-pointer flex-shrink-0" />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="cursor-pointer flex-shrink-0"
          >
            Gửi
          </Button>
        </div>
      </div>
    </div>
  );
}
