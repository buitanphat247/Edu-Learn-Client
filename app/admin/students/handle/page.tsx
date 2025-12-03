"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StudentsHandle() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to create page
    router.replace("/admin/students/create");
  }, [router]);

  return null;
}

