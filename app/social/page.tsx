"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Modal, Select, message as antMessage } from "antd";
import DarkConfigProvider from "@/app/components/common/DarkConfigProvider";
import NavigationRail from "@/app/components/social/NavigationRail";
import SocialSidebar from "@/app/components/social/SocialSidebar";
import ChatArea from "@/app/components/social/ChatArea";
import ContactsContent from "@/app/components/social/ContactsContent";
import { Conversation, Message, Contact } from "@/app/components/social/types";
import {
  friendSocketClient,
  sendFriendRequest,
  acceptFriendRequest as acceptFriendRequestSocket,
  rejectFriendRequest as rejectFriendRequestSocket,
  onFriendRequestReceived,
  onFriendRequestAccepted,
  onFriendRequestRejected,
  onFriendError,
} from "@/lib/socket";
import { getFriendRequests, getFriends, acceptFriendRequest, rejectFriendRequest, type FriendRequestResponse } from "@/lib/api/friends";
import { getUserIdFromCookie } from "@/lib/utils/cookies";
import {
  SearchOutlined,
  UserAddOutlined,
  TeamOutlined,
  MoreOutlined,
  SendOutlined,
  SmileOutlined,
  PaperClipOutlined,
  PictureOutlined,
  LinkOutlined,
  FileTextOutlined,
  BoldOutlined,
  CloudOutlined,
  SettingOutlined,
  VideoCameraOutlined,
  DownloadOutlined,
  HomeOutlined,
  ContactsOutlined,
  MessageOutlined,
  BellOutlined,
  CloseOutlined,
  DownOutlined,
} from "@ant-design/icons";

export default function SocialPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<"all" | "unread" | "categorized">("all");
  const [selectedConversation, setSelectedConversation] = useState<string | null>("2");
  const [message, setMessage] = useState("");
  const [bottomTab, setBottomTab] = useState<"messages" | "contacts" | "cloud" | "settings">("messages");
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [contactSubTab, setContactSubTab] = useState<"friends" | "groups" | "requests" | "sent_requests">("friends");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [inputType, setInputType] = useState<"phone" | "email">("phone");
  const [countryCode, setCountryCode] = useState("+84");
  const [friendRequests, setFriendRequests] = useState<FriendRequestResponse[]>([]);
  const [loadingFriendRequests, setLoadingFriendRequests] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);

  // Filter: Only show friend requests where current user is the addressee (received requests)
  // Don't show requests where current user is the requester (sent requests)
  const currentUserId = getUserIdFromCookie();
  const currentUserIdNumber =
    typeof currentUserId === "string" ? parseInt(currentUserId, 10) : typeof currentUserId === "number" ? currentUserId : null;
  const receivedFriendRequests = useMemo(() => {
    if (currentUserIdNumber === null) return [];
    return friendRequests.filter((request) => String(request.addressee_id) === String(currentUserIdNumber));
  }, [friendRequests, currentUserIdNumber]);

  const sentFriendRequests = useMemo(() => {
    if (currentUserIdNumber === null) return [];
    return friendRequests.filter((request) => String(request.requester_id) === String(currentUserIdNumber));
  }, [friendRequests, currentUserIdNumber]);

  // Mock conversations data theo mô tả
  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Cloud của tôi",
      lastMessage: "Lưu trữ file quan trọng...",
      time: "",
      isCloud: true,
    },
    {
      id: "2",
      name: "Team Marketing",
      lastMessage: "Bạn: File thiết kế mới nhất...",
      time: "10:30 AM",
      isGroup: true,
      members: 5,
      lastAccess: "Vừa truy cập",
    },
    {
      id: "3",
      name: "Nguyễn Văn B",
      lastMessage: "Ok, để mình check nhé.",
      time: "5 phút",
      unread: 1,
    },
    {
      id: "4",
      name: "Lê Thị C",
      lastMessage: "Đã gửi một ảnh.",
      time: "Hôm qua",
    },
    {
      id: "5",
      name: "Dev Team",
      lastMessage: "Project Manager: Deadline vào th...",
      time: "Hôm qua",
      isGroup: true,
    },
    {
      id: "6",
      name: "Thông báo HR",
      lastMessage: "Lịch nghỉ lễ sắp tới",
      time: "20/10",
      isNotification: true,
    },
  ];

  // Mock messages data theo mô tả
  const messages: Message[] = [
    {
      id: "1",
      sender: "Nguyễn Văn B",
      content: "Chào mọi người, mình vừa cập nhật file thiết kế Landing Page mới. Mọi người xem qua và feedback giúp mình nhé.",
      time: "10:30 AM",
      isOwn: false,
    },
    {
      id: "2",
      sender: "Nguyễn Văn B",
      content: "",
      time: "10:30 AM",
      isOwn: false,
      fileAttachment: {
        name: "Landing_Page_V2.pdf",
        size: "2.4 MB",
        type: "pdf",
      },
    },
    {
      id: "3",
      sender: "You",
      content: "Tuyệt vời! Để mình check ngay bây giờ.",
      time: "10:35 AM",
      isOwn: true,
    },
    {
      id: "4",
      sender: "You",
      content: "Phần header nhìn thoáng hơn bản cũ nhiều đó 👍",
      time: "10:36 AM",
      isOwn: true,
    },
    {
      id: "5",
      sender: "Lê Thị C",
      content: "@Nguyễn Văn B phần footer màu có vẻ hơi tối không nhỉ?",
      time: "10:40 AM",
      isOwn: false,
    },
  ];

  // Create a state for friends list to replace mock data
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Mock contacts data removed as requested
  /* 
  const contacts: Contact[] = [
    ... removed mock data ...
  ];
  */

  const activeConversation = conversations.find((c) => c.id === selectedConversation);

  // Mock data for add friend modal
  const recentSearchResults = [
    {
      id: "r1",
      name: "Như Quỳnh | Cao Thiên I",
      phone: "(+84) 0936 774 373",
      avatar: "N",
    },
    {
      id: "r2",
      name: "Feli Home",
      phone: "(+84) 0707 175 937",
      avatar: "F",
    },
    {
      id: "r3",
      name: "Tam X",
      phone: "(+84) 0347 979 595",
      avatar: "T",
    },
  ];

  const suggestedFriends = [
    {
      id: "s1",
      name: "An Mmo",
      avatar: "A",
    },
    {
      id: "s2",
      name: "Bảo Trâm",
      avatar: "B",
    },
    {
      id: "s3",
      name: "Clone Tiktok Job SII",
      avatar: "C",
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle send message logic here
      setMessage("");
    }
  };

  const handleAddFriendClick = () => {
    setIsAddFriendModalOpen(true);
  };

  const handleSendFriendRequest = async () => {
    const userId = getUserIdFromCookie();
    if (!userId) {
      antMessage.error("Vui lòng đăng nhập để gửi lời mời kết bạn");
      return;
    }

    if (inputType === "phone") {
      if (!phoneNumber.trim()) {
        antMessage.warning("Vui lòng nhập số điện thoại");
        return;
      }
    } else {
      if (!email.trim()) {
        antMessage.warning("Vui lòng nhập email");
        return;
      }
    }

    setSendingRequest(true);
    try {
      const userIdNumber = typeof userId === "string" ? parseInt(userId, 10) : userId;
      if (isNaN(userIdNumber)) {
        throw new Error("User ID không hợp lệ");
      }

      const requestData = {
        requester_id: userIdNumber,
        ...(inputType === "phone" ? { phone: phoneNumber.trim() } : { email: email.trim() }),
      };

      await sendFriendRequest(requestData);

      antMessage.success("Đã gửi lời mời kết bạn thành công!");

      // Reset form
      setPhoneNumber("");
      setEmail("");
      setIsAddFriendModalOpen(false);

      // Refresh friend requests list
      fetchFriendRequests();
    } catch (error: any) {
      console.error("Error sending friend request:", error);
      antMessage.error(error.message || "Không thể gửi lời mời kết bạn. Vui lòng thử lại.");
    } finally {
      setSendingRequest(false);
    }
  };

  const handleAddFriendFromSuggestion = (friendId: string) => {
    // Handle add friend from suggestion
    console.log("Adding friend:", friendId);
  };

  // Fetch friend requests
  const fetchFriendRequests = useCallback(async () => {
    const userId = getUserIdFromCookie();
    if (!userId) {
      console.warn("No user ID found, skipping friend requests fetch");
      return;
    }

    setLoadingFriendRequests(true);
    try {
      const userIdNumber = typeof userId === "string" ? parseInt(userId, 10) : userId;
      if (isNaN(userIdNumber)) {
        throw new Error("User ID không hợp lệ");
      }

      console.log("Fetching friend requests for userId:", userIdNumber);
      const result = await getFriendRequests({ userId: userIdNumber, limit: 50 });
      console.log("Friend requests result:", result);
      setFriendRequests(result.requests || []);

      if (result.requests && result.requests.length > 0) {
        console.log("Loaded", result.requests.length, "friend requests");
      } else {
        console.log("No friend requests found");
      }
    } catch (error: any) {
      console.error("Error fetching friend requests:", error);
      const errorMessage = error?.message || "Không thể tải danh sách lời mời kết bạn";
      // Don't show error message if it's just an empty result
      if (!errorMessage.includes("endpoint không tồn tại") && !errorMessage.includes("404")) {
        antMessage.error(errorMessage);
      }
      // Also log to console for debugging
      if (error?.response) {
      }
    } finally {
      setLoadingFriendRequests(false);
    }
  }, []);

  // Fetch friends list
  const fetchContacts = useCallback(async () => {
    const userId = getUserIdFromCookie();
    if (!userId) return;

    try {
      const response = await getFriends({ userId });

      // Map friend data to Contact interface
      const mappedContacts: Contact[] = response.data.map((friend) => {
        const userIdStr = String(userId);
        const isRequester = String(friend.requester_id) === userIdStr;
        const friendUser = isRequester ? friend.addressee : friend.requester;

        return {
          id: String(friendUser?.user_id),
          name: friendUser?.fullname || friendUser?.username || "Unknown",
          avatar: friendUser?.avatar || undefined,
          status: (friendUser?.status as any) || "offline",
          isFriend: true,
        };
      });

      setContacts(mappedContacts);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Handle accept friend request (using socket)
  const handleAcceptFriendRequest = async (friendRequestId: number) => {
    const userId = getUserIdFromCookie();
    if (!userId) {
      antMessage.error("Vui lòng đăng nhập");
      return;
    }

    try {
      const userIdNumber = typeof userId === "string" ? parseInt(userId, 10) : userId;
      if (isNaN(userIdNumber)) {
        throw new Error("User ID không hợp lệ");
      }

      // Find the friend request to get requester_id for validation
      const friendRequest = friendRequests.find((req) => req.id === friendRequestId);
      if (!friendRequest) {
        throw new Error("Không tìm thấy lời mời kết bạn");
      }

      // Verify that current user is the addressee (receiver) - only addressee can accept
      if (String(friendRequest.addressee_id) !== String(userIdNumber)) {
        throw new Error("Bạn không có quyền chấp nhận lời mời này");
      }

      // Backend expects requester_id (the person who sent the request) for validation
      // But user_id should be the addressee (current user) who is accepting
      const requesterId = friendRequest.requester_id || friendRequest.requester?.user_id;
      if (!requesterId) {
        throw new Error("Không tìm thấy thông tin người gửi lời mời");
      }

      // Use socket to accept friend request
      // Backend validates that user_id === addressee_id of the friend request
      await acceptFriendRequestSocket({
        user_id: userIdNumber, // Current user (addressee)
        friend_id: friendRequestId, // Friend request ID
        requester_id: requesterId, // Person who sent the request (for backend validation)
      });
      antMessage.success("Đã chấp nhận lời mời kết bạn");

      // Remove from pending list
      setFriendRequests((prev) => prev.filter((req) => req.id !== friendRequestId));
    } catch (error: any) {
      console.error("Error accepting friend request:", error);
      antMessage.error(error.message || "Không thể chấp nhận lời mời kết bạn");
    }
  };

  // Handle reject friend request (using socket)
  const handleRejectFriendRequest = async (friendRequestId: number) => {
    const userId = getUserIdFromCookie();
    if (!userId) {
      antMessage.error("Vui lòng đăng nhập");
      return;
    }

    try {
      const userIdNumber = typeof userId === "string" ? parseInt(userId, 10) : userId;
      if (isNaN(userIdNumber)) {
        throw new Error("User ID không hợp lệ");
      }

      // Find the friend request to get requester_id for validation
      const friendRequest = friendRequests.find((req) => req.id === friendRequestId);
      if (!friendRequest) {
        throw new Error("Không tìm thấy lời mời kết bạn");
      }

      // Verify that current user is related to the request
      if (String(friendRequest.addressee_id) !== String(userIdNumber) && String(friendRequest.requester_id) !== String(userIdNumber)) {
        throw new Error("Bạn không có quyền từ chối hoặc hủy lời mời này");
      }

      // Backend expects requester_id (the person who sent the request) for validation
      // But user_id should be the addressee (current user) who is rejecting
      const requesterId = friendRequest.requester_id || friendRequest.requester?.user_id;
      if (!requesterId) {
        throw new Error("Không tìm thấy thông tin người gửi lời mời");
      }

      // Use socket to reject friend request
      // Backend validates that user_id === addressee_id of the friend request
      await rejectFriendRequestSocket({
        user_id: userIdNumber, // Current user (addressee)
        friend_id: friendRequestId, // Friend request ID
        requester_id: requesterId, // Person who sent the request (for backend validation)
      });

      const isRevoke = String(friendRequest.requester_id) === String(userIdNumber);
      antMessage.success(isRevoke ? "Đã thu hồi lời mời kết bạn" : "Đã từ chối lời mời kết bạn");

      // Remove from pending list
      setFriendRequests((prev) => prev.filter((req) => req.id !== friendRequestId));
    } catch (error: any) {
      console.error("Error rejecting friend request:", error);
      antMessage.error(error.message || "Không thể thực hiện hành động này");
    }
  };

  // Fetch friend requests when component mounts or when switching to contacts tab
  useEffect(() => {
    if (bottomTab === "contacts") {
      fetchFriendRequests();
    }
  }, [bottomTab, fetchFriendRequests]);

  // Setup socket connection and listeners
  useEffect(() => {
    // Connect to friend socket namespace
    friendSocketClient.connect();

    // Listen for friend request received (new request)
    const unsubscribeReceived = onFriendRequestReceived((payload) => {
      console.log("Friend request received:", payload);

      // Map socket friend data to FriendRequestResponse
      const newRequest: FriendRequestResponse = {
        id: payload.friend.id,
        requester_id: payload.friend.requester_id,
        addressee_id: payload.friend.addressee_id,
        status: payload.friend.status === "blocked" ? "pending" : (payload.friend.status as "pending" | "accepted" | "rejected"),
        created_at: payload.friend.created_at,
        accepted_at: payload.friend.accepted_at || null,
        requester: payload.friend.requester
          ? {
              user_id: payload.friend.requester.user_id,
              username: payload.friend.requester.username,
              fullname: payload.friend.requester.fullname,
              email: payload.friend.requester.email || "",
              phone: payload.friend.requester.phone || null,
              avatar: payload.friend.requester.avatar || null,
            }
          : undefined,
        addressee: payload.friend.addressee
          ? {
              user_id: payload.friend.addressee.user_id,
              username: payload.friend.addressee.username,
              fullname: payload.friend.addressee.fullname,
              email: payload.friend.addressee.email || "",
              phone: payload.friend.addressee.phone || null,
              avatar: payload.friend.addressee.avatar || null,
            }
          : undefined,
      };

      // Add to friend requests list if not already exists
      setFriendRequests((prev) => {
        const exists = prev.some((req) => req.id === newRequest.id);
        if (!exists) {
          return [newRequest, ...prev];
        }
        return prev;
      });

      antMessage.info(`Bạn có lời mời kết bạn mới từ ${payload.friend.requester?.fullname || "ai đó"}`);
    });

    // Listen for friend request accepted
    const unsubscribeAccepted = onFriendRequestAccepted((payload) => {
      console.log("Friend request accepted:", payload);

      // Remove from pending list if it's a request we sent (not received)
      // Or if we accepted it, it will be removed when we handle accept action
      setFriendRequests((prev) => prev.filter((req) => req.id !== payload.friend.id));

      // Only show notification if we are the requester (the one who sent the invite)
      // If we are the addressee (the one accepting), we already see the button action feedback
      const userId = getUserIdFromCookie();
      const userIdNum = typeof userId === "string" ? parseInt(userId, 10) : userId;

      if (userIdNum === payload.friend.requester_id) {
        antMessage.success(`${payload.friend.addressee?.fullname || "Ai đó"} đã chấp nhận lời mời kết bạn của bạn`);
      }

      // Refresh friends list for both users
      fetchContacts();
    });

    // Listen for friend request rejected
    const unsubscribeRejected = onFriendRequestRejected((payload) => {
      console.log("Friend request rejected:", payload);

      // Remove from pending list
      setFriendRequests((prev) => prev.filter((req) => req.id !== payload.friend_id));

      // Message removed or optional
      // antMessage.info(`${payload.requester_id ? "Lời mời đã bị từ chối" : "Đã từ chối lời mời"}`);
    });

    // Listen for friend request errors
    const unsubscribeError = onFriendError((payload) => {
      console.error("Friend request error:", payload);
      // antMessage.error(payload.error || "Có lỗi xảy ra"); // Removed to prevent duplicate toasts since actions have their own handlers
    });

    // Cleanup
    return () => {
      unsubscribeReceived();
      unsubscribeAccepted();
      unsubscribeRejected();
      unsubscribeError();
      // Don't disconnect socket here - keep it connected while component is mounted
    };
  }, []);

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
    <DarkConfigProvider>
      <div className="flex h-full bg-[#0f172a] overflow-hidden">
        {/* Left Sidebar */}
        <NavigationRail bottomTab={bottomTab} setBottomTab={setBottomTab} />

        <SocialSidebar
          bottomTab={bottomTab}
          contactSubTab={contactSubTab}
          setContactSubTab={setContactSubTab}
          conversations={conversations}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          receivedFriendRequestsCount={receivedFriendRequests.length}
          handleAddFriendClick={handleAddFriendClick}
        />

        <main className="flex-1 flex flex-col min-w-0 bg-slate-900 relative h-full overflow-hidden">
          {bottomTab === "messages" ? (
            <ChatArea
              activeConversation={activeConversation}
              messages={messages}
              message={message}
              handleTextareaChange={handleTextareaChange}
              handleKeyPress={handleKeyPress}
              handleSendMessage={handleSendMessage}
            />
          ) : bottomTab === "contacts" ? (
            <ContactsContent
              contactSubTab={contactSubTab}
              receivedFriendRequests={receivedFriendRequests}
              sentFriendRequests={sentFriendRequests}
              contacts={contacts}
              loadingFriendRequests={loadingFriendRequests}
              handleAcceptFriendRequest={handleAcceptFriendRequest}
              handleRejectFriendRequest={handleRejectFriendRequest}
            />
          ) : (
            <div className="flex-1 bg-slate-900" />
          )}
        </main>

        {/* Add Friend Modal */}
        <Modal
          open={isAddFriendModalOpen}
          onCancel={() => setIsAddFriendModalOpen(false)}
          footer={null}
          closeIcon={null}
          width={360}
          centered
          styles={{
            mask: {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(2px)",
            },
          }}
          className="add-friend-modal"
        >
          <div className="flex flex-col text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-white leading-none mb-0 tracking-tight text-base">Thêm Bạn</h2>
              <button
                onClick={() => setIsAddFriendModalOpen(false)}
                className="flex items-center justify-center rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all border-none bg-transparent cursor-pointer w-7 h-7"
              >
                <CloseOutlined className="text-xs" />
              </button>
            </div>

            {/* Input Type Toggle */}
            <div className="flex gap-1.5 mb-3  bg-slate-800 rounded-lg">
              <button
                onClick={() => setInputType("phone")}
                className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
                  inputType === "phone" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                Số điện thoại
              </button>
              <button
                onClick={() => setInputType("email")}
                className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
                  inputType === "email" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                Email
              </button>
            </div>

            {/* Input Field */}
            <div className="mb-3">
              {inputType === "phone" ? (
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Nhập số điện thoại"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    size="small"
                    className="flex-1 bg-[#303134] hover:bg-[#303134] focus:bg-[#303134] border-none text-white placeholder:text-slate-400 text-sm [&>input]:text-white [&>input]:bg-transparent [&>input]:text-sm"
                    onPressEnter={handleSendFriendRequest}
                  />
                </div>
              ) : (
                <Input
                  type="email"
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="small"
                  className="w-full bg-[#303134] hover:bg-[#303134] focus:bg-[#303134] border-none text-white placeholder:text-slate-400 text-sm [&>input]:text-white [&>input]:bg-transparent [&>input]:text-sm"
                  onPressEnter={handleSendFriendRequest}
                />
              )}
            </div>

            {/* Send Button */}
            <Button
              type="primary"
              size="small"
              block
              onClick={handleSendFriendRequest}
              disabled={inputType === "phone" ? !phoneNumber.trim() : !email.trim() || sendingRequest}
              loading={sendingRequest}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium mb-3 text-sm"
            >
              {sendingRequest ? "Đang gửi..." : "Gửi lời mời kết bạn"}
            </Button>

            {/* Friend Requests List removed from modal as requested */}
          </div>
        </Modal>
      </div>
    </DarkConfigProvider>
  );
}
