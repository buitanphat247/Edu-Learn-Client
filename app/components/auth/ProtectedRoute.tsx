"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";
import { getCurrentUser } from "@/lib/api/users";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const user = getCurrentUser();
      const token = localStorage.getItem("accessToken");

      if (!user || !token) {
        router.push("/auth");
        return;
      }

      // Kiểm tra role nếu có yêu cầu
      if (allowedRoles && allowedRoles.length > 0) {
        const userRole = user.role?.role_name?.toLowerCase();
        if (!userRole || !allowedRoles.includes(userRole)) {
          router.push("/");
          return;
        }
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

