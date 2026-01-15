"use client";

import React from "react";
import NavigationRail from "@/app/components/social/NavigationRail";
import SettingsModal from "@/app/components/social/SettingsModal";
import ProfileModal from "@/app/components/social/ProfileModal";
import AddFriendModal from "@/app/components/social/AddFriendModal";
import DarkConfigProvider from "@/app/components/common/DarkConfigProvider";
import { useSocial } from "./SocialContext";

export default function SocialShell({ children }: { children: React.ReactNode }) {
  const { currentUser, contacts, groupCount, isSettingsOpen, setIsSettingsOpen, isProfileOpen, setIsProfileOpen, isAddFriendOpen, setIsAddFriendOpen } = useSocial();

  return (
    <DarkConfigProvider>
      <div className="flex h-full bg-[#0f172a] overflow-hidden fixed inset-0">
        {/* Left Sidebar */}
        <NavigationRail onSettingsClick={() => setIsSettingsOpen(true)} onProfileClick={() => setIsProfileOpen(true)} user={currentUser} />

        {/* Main Content */}
        {children}

        {/* Global Modals */}
        <SettingsModal open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={currentUser}
          friendCount={contacts.length}
          groupCount={groupCount}
        />
        <AddFriendModal open={isAddFriendOpen} onClose={() => setIsAddFriendOpen(false)} />
      </div>
    </DarkConfigProvider>
  );
}
