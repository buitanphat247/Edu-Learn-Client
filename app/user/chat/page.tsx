"use client";

import { useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined, EditOutlined, PhoneOutlined, MoreOutlined, SendOutlined, SmileOutlined, PaperClipOutlined, PictureOutlined, PlusOutlined } from "@ant-design/icons";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  avatar?: string;
  isGroup?: boolean;
  members?: number;
  online?: number;
  isActive?: boolean;
}

interface Message {
  id: string;
  sender: string;
  senderAvatar?: string;
  content: string;
  time: string;
  isOwn: boolean;
  replyTo?: string;
}

export default function ChatPage() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "unread" | "groups">("all");
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1");
  const [message, setMessage] = useState("");

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Design Team",
      lastMessage: "Alice: I've uploaded the new mockups.",
      time: "10:42 AM",
      unread: 3,
      isGroup: true,
      members: 5,
      online: 3,
      isActive: true,
    },
    {
      id: "2",
      name: "Sarah Jenkins",
      lastMessage: "Can we reschedule our call?",
      time: "9:15 AM",
    },
    {
      id: "3",
      name: "Project Alpha",
      lastMessage: "You: Sent a file",
      time: "Yesterday",
    },
    {
      id: "4",
      name: "David Lee",
      lastMessage: "Thanks for the update!",
      time: "Mon",
    },
    {
      id: "5",
      name: "Emma Watson",
      lastMessage: "Looking forward to it.",
      time: "Mon",
    },
  ];

  // Mock messages data
  const messages: Message[] = [
    {
      id: "1",
      sender: "Alice",
      content: "Hey team! I've just uploaded the new dashboard concepts. Let me know what you think about the color scheme.",
      time: "10:30 AM",
      isOwn: false,
    },
    {
      id: "2",
      sender: "You",
      content: "These look fantastic, Alice! 🔥",
      time: "10:35 AM",
      isOwn: true,
    },
    {
      id: "3",
      sender: "You",
      content: "I especially like the dark mode contrast. Did you use the new brand blue?",
      time: "10:35 AM",
      isOwn: true,
    },
    {
      id: "4",
      sender: "Alice",
      content: "Yes, exactly! It's the #135BEC hex code.",
      time: "10:42 AM",
      isOwn: false,
      replyTo: "Did you use the new brand blue?",
    },
  ];

  const activeConversation = conversations.find((c) => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle send message logic here
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize textarea
    e.target.style.height = "20px";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
  };

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden">
      {/* Conversations Sidebar */}
      <aside className="w-full md:w-[360px] flex flex-col bg-gray-50 border-r border-gray-200 shrink-0 h-full overflow-hidden">
        {/* Header */}
        <div className="px-4 py-5 flex flex-col gap-4">

          {/* Search */}
          <Input
            prefix={<SearchOutlined className="text-gray-500" />}
            placeholder="Search conversations..."
            className="rounded-lg"
            size="middle"
          />

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button
              type={selectedFilter === "all" ? "primary" : "default"}
              size="small"
              className={`rounded-full text-xs font-medium ${
                selectedFilter === "all" ? "" : "text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedFilter("all")}
            >
              All
            </Button>
            <Button
              type={selectedFilter === "unread" ? "primary" : "default"}
              size="small"
              className={`rounded-full text-xs font-medium ${
                selectedFilter === "unread" ? "" : "text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedFilter("unread")}
            >
              Unread
            </Button>
            <Button
              type={selectedFilter === "groups" ? "primary" : "default"}
              size="small"
              className={`rounded-full text-xs font-medium ${
                selectedFilter === "groups" ? "" : "text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedFilter("groups")}
            >
              Groups
            </Button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-l-4 ${
                conversation.isActive
                  ? "bg-white border-blue-500 shadow-sm"
                  : "border-transparent hover:bg-gray-100"
              }`}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                {conversation.isGroup ? (
                  <div className="grid grid-cols-2 gap-0.5 w-12 h-12 rounded-lg overflow-hidden">
                    <div className="bg-blue-200"></div>
                    <div className="bg-green-200"></div>
                    <div className="bg-yellow-200"></div>
                    <div className="bg-gray-700 flex items-center justify-center text-[10px] font-bold text-white">
                      +2
                    </div>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {conversation.name.charAt(0)}
                  </div>
                )}
                {!conversation.isGroup && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <p className="text-sm font-semibold truncate text-gray-900">{conversation.name}</p>
                  <p className={`text-xs ${conversation.isActive ? "text-blue-500 font-medium" : "text-gray-500"}`}>
                    {conversation.time}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 truncate pr-2">{conversation.lastMessage}</p>
                  {conversation.unread && (
                    <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-blue-500 text-white text-[10px] font-bold rounded-full">
                      {conversation.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white relative h-full overflow-hidden">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-4">
                {activeConversation.isGroup ? (
                  <div className="grid grid-cols-2 gap-0.5 w-10 h-10 rounded-lg overflow-hidden ring-1 ring-gray-100">
                    <div className="bg-blue-200"></div>
                    <div className="bg-green-200"></div>
                    <div className="bg-yellow-200"></div>
                    <div className="bg-gray-700 flex items-center justify-center text-[8px] font-bold text-white">
                      +2
                    </div>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {activeConversation.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="text-base font-bold text-gray-900 leading-tight">{activeConversation.name}</h2>
                  {activeConversation.isGroup && (
                    <p className="text-xs text-gray-500">
                      {activeConversation.members} members • {activeConversation.online} Online
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-3 text-gray-400">
                <Button
                  type="text"
                  icon={<SearchOutlined className="text-2xl" />}
                  className="p-2 rounded-lg hover:bg-gray-100 hover:text-blue-500"
                />
                <Button
                  type="text"
                  icon={<PhoneOutlined className="text-2xl" />}
                  className="p-2 rounded-lg hover:bg-gray-100 hover:text-blue-500"
                />
                <Button
                  type="text"
                  icon={<MoreOutlined className="text-2xl" />}
                  className="p-2 rounded-lg hover:bg-gray-100 hover:text-blue-500"
                />
              </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-8 py-6 flex flex-col gap-6 bg-gray-50">
              {/* Today separator */}
              <div className="flex justify-center">
                <span className="text-xs font-medium text-gray-600 bg-gray-200 px-3 py-1 rounded-full shadow-sm">
                  Today
                </span>
              </div>

              {/* Messages */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${msg.isOwn ? "flex-row-reverse self-end" : ""}`}
                >
                  {!msg.isOwn && (
                    <div className="shrink-0 flex flex-col justify-end">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                        {msg.sender.charAt(0)}
                      </div>
                    </div>
                  )}
                  {msg.isOwn && <div className="shrink-0 w-8"></div>}
                  <div className={`flex flex-col gap-1 ${msg.isOwn ? "items-end" : ""}`}>
                    {!msg.isOwn && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-700">{msg.sender}</span>
                        <span className="text-[10px] text-gray-400">{msg.time}</span>
                      </div>
                    )}
                    {msg.isOwn && (
                      <div className="flex items-center gap-2 flex-row-reverse">
                        <span className="text-[10px] text-gray-400">{msg.time}</span>
                      </div>
                    )}
                    {msg.replyTo && !msg.isOwn && (
                      <div className="flex items-center gap-2 mb-1 pl-3 border-l-2 border-gray-300 opacity-80">
                        <span className="text-xs text-gray-500">↩</span>
                        <p className="text-xs truncate max-w-[200px] text-gray-500">{msg.replyTo}</p>
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                        msg.isOwn
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white rounded-bl-none border border-gray-100 text-gray-800"
                      }`}
                    >
                      <p>{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="px-4 py-3 bg-white border-t border-gray-200 shrink-0">
              <div className="flex items-end gap-2 bg-gray-100 p-1.5 rounded-xl border border-transparent focus-within:border-blue-500/30 focus-within:bg-white focus-within:shadow-md transition-all">
                <div className="flex gap-0.5 pb-0.5 pl-0.5">
                  <button
                    type="button"
                    className="p-1.5 text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-200 transition-colors"
                    title="Attach File"
                  >
                    <PlusOutlined className="text-lg" />
                  </button>
                  <button
                    type="button"
                    className="hidden md:flex p-1.5 text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-200 transition-colors"
                    title="Image"
                  >
                    <PictureOutlined className="text-lg" />
                  </button>
                  <button
                    type="button"
                    className="hidden md:flex p-1.5 text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-200 transition-colors"
                    title="File"
                  >
                    <PaperClipOutlined className="text-lg" />
                  </button>
                </div>
                <div className="flex-1 py-1 min-w-0">
                  <textarea
                    className="w-full bg-transparent border-none p-0 text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none resize-none max-h-24 text-sm leading-relaxed"
                    placeholder="Type a message to the team..."
                    rows={1}
                    value={message}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyPress}
                    style={{ minHeight: "20px" }}
                  />
                </div>
                <div className="flex gap-0.5 pb-0.5 pr-0.5">
                  <button
                    type="button"
                    className="p-1.5 text-gray-500 hover:text-yellow-500 rounded-full hover:bg-gray-200 transition-colors"
                    title="Emoji"
                  >
                    <SmileOutlined className="text-lg" />
                  </button>
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="p-1.5 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[36px]"
                    title="Send"
                  >
                    <SendOutlined className="text-lg" />
                  </button>
                </div>
              </div>
              
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
}

