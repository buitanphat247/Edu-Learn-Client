"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import SignIn from "./auth_components/SignIn";
import SignUp from "./auth_components/SignUp";

export default function Header() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isFeatureDropdownOpen, setIsFeatureDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/news", label: "Tin tức" },
    { to: "/events", label: "Sự kiện" },
    { to: "/about", label: "Về chúng tôi" },
  ];

  const featureItems: MenuProps["items"] = [
    { key: "translator", label: "Dịch thuật" },
    { key: "vocabulary", label: "Học từ vựng" },
    { key: "writing", label: "Luyện viết" },
    { key: "listening", label: "Luyện nghe" },
  ];
  
  interface AuthItem {
    key: string;
    label: string;
    onClick: () => void;
  }
  
  const authItems: AuthItem[] = [
    { key: "login", label: "Đăng nhập", onClick: () => setIsSignInOpen(true) },
    { key: "register", label: "Đăng ký", onClick: () => setIsSignUpOpen(true) },
  ];

  const handleFeatureClick: MenuProps["onClick"] = ({ key }) => {
    router.push(`/features/${key}`);
    setIsFeatureDropdownOpen(false);
  };

  const isFeatureActive = pathname?.startsWith("/features") || false;

  return (
    <>
      <SignIn
        open={isSignInOpen}
        onCancel={() => setIsSignInOpen(false)}
        onSwitchToSignUp={() => {
          setIsSignInOpen(false);
          setIsSignUpOpen(true);
        }}
      />
      <SignUp
        open={isSignUpOpen}
        onCancel={() => setIsSignUpOpen(false)}
        onSwitchToSignIn={() => {
          setIsSignUpOpen(false);
          setIsSignInOpen(true);
        }}
      />
      <header className="bg-[#1c91e3] shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 relative transform group-hover:scale-105 transition-transform flex items-center justify-center">
              <img src="/images/logo/1.png" alt="Thư viện số" width={48} height={48} className="object-contain" />
            </div>
            <span className="text-2xl font-bold text-white capitalize">Thư viện số</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.slice(0, 3).map((link) => {
              const isActive = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  href={link.to}
                  className={`transition-all relative py-2 ${
                    isActive
                      ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white after:rounded-full"
                      : "hover:opacity-80"
                  }`}
                >
                  <span className="font-bold text-white">{link.label}</span>
                </Link>
              );
            })}
           
            <Dropdown
              menu={{
                items: featureItems,
                onClick: handleFeatureClick,
              }}
              placement="bottom"
              open={isFeatureDropdownOpen}
              onOpenChange={setIsFeatureDropdownOpen}
              classNames={{ root: "feature-dropdown" }}
            >
              <button
                className={`transition-all relative py-2 flex items-center gap-1 ${
                  isFeatureActive || isFeatureDropdownOpen
                    ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white after:rounded-full"
                    : "hover:opacity-80"
                }`}
              >
                <span className="font-bold text-white">Tính năng</span>
              </button>
            </Dropdown>
            
            {navLinks.slice(3, 4).map((link) => {
              const isActive = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  href={link.to}
                  className={`transition-all relative py-2 ${
                    isActive
                      ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white after:rounded-full"
                      : "hover:opacity-80"
                  }`}
                >
                  <span className="font-bold text-white">{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-5">
            {authItems.map((item) => (
              <Button key={item?.key} onClick={item?.onClick} className=" font-medium px-0  border-none cursor-pointer text-white">
                {item?.label}
              </Button>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
}

