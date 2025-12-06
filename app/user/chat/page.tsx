"use client";

import { useState } from "react";
import { Input, Button } from "antd";
import { SendOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import ConversationItem from "@/app/components/user/chat/ConversationItem";
import MessageBubble from "@/app/components/user/chat/MessageBubble";
import ChatHeader from "@/app/components/user/chat/ChatHeader";

const { TextArea } = Input;

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    avatar: "A",
    lastMessage: "Cảm ơn bạn đã giúp đỡ!",
    time: "10:30",
    unread: 2,
    messages: [
      { id: "1", text: "Xin chào!", sender: "other", time: "09:00" },
      { id: "2", text: "Chào bạn, có gì cần giúp không?", sender: "me", time: "09:05" },
      { id: "3", text: "Mình có câu hỏi về bài tập Toán", sender: "other", time: "09:10" },
      { id: "4", text: "Được thôi, bạn hỏi đi", sender: "me", time: "09:12" },
      { id: "5", text: "Cảm ơn bạn đã giúp đỡ!", sender: "other", time: "10:30" },
    ],
  },
  {
    id: "2",
    name: "Trần Thị B",
    avatar: "B",
    lastMessage: "Bạn có thể gửi tài liệu được không?",
    time: "Hôm qua",
    unread: 0,
    messages: [
      { id: "1", text: "Chào bạn!", sender: "other", time: "14:00" },
      { id: "2", text: "Bạn có thể gửi tài liệu được không?", sender: "other", time: "14:05" },
    ],
  },
  {
    id: "3",
    name: "Lê Văn C",
    avatar: "C",
    lastMessage: "Ok, cảm ơn bạn nhé!",
    time: "2 ngày trước",
    unread: 0,
    messages: [
      { id: "1", text: "Xin chào!", sender: "other", time: "08:00" },
      { id: "2", text: "Ok, cảm ơn bạn nhé!", sender: "other", time: "08:30" },
    ],
  },
  {
    id: "4",
    name: "Phạm Thị D",
    avatar: "D",
    lastMessage: "Mình sẽ gửi sau nhé",
    time: "3 ngày trước",
    unread: 1,
    messages: [
      { id: "1", text: "Bạn có thể giúp mình không?", sender: "other", time: "10:00" },
      { id: "2", text: "Được thôi, bạn cần gì?", sender: "me", time: "10:05" },
      { id: "3", text: "Mình sẽ gửi sau nhé", sender: "other", time: "10:10" },
    ],
  },
];

export default function UserChat() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [messageText, setMessageText] = useState("");
  const [searchText, setSearchText] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      setMessageText("");
    }
  };

  return (
    <div className="flex h-full bg-white rounded-lg overflow-hidden border border-gray-300 ">
      <div className="w-80 border-r border-gray-300 flex flex-col">
        <div className="h-16 flex items-center p-4 border-b border-gray-300 shrink-0">
          <Input
            placeholder="Tìm kiếm cuộc trò chuyện..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              id={conversation.id}
              name={conversation.name}
              avatar={conversation.avatar}
              lastMessage={conversation.lastMessage}
              time={conversation.time}
              unread={conversation.unread}
              isSelected={selectedConversation?.id === conversation.id}
              onClick={() => setSelectedConversation(conversation)}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <ChatHeader
              name={selectedConversation.name}
              avatar={selectedConversation.avatar}
            />

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
              {selectedConversation.messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  text={message.text}
                  time={message.time}
                  sender={message.sender}
                />
              ))}
            </div>

            <div className="p-4 border-t border-gray-300 bg-white">
              <div className="flex items-end gap-2">
                <TextArea
                  rows={1}
                  placeholder="Nhập tin nhắn..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onPressEnter={(e) => {
                    if (e.shiftKey) return;
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="resize-none flex-1"
                  autoSize={{ minRows: 1, maxRows: 4 }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  size="large"
                >
                  Gửi
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <UserOutlined className="text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

