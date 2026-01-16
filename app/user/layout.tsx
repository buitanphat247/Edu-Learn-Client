import { cookies } from "next/headers";
import UserLayoutClient from "./UserLayoutClient";

async function getInitialUserData() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");

    if (userCookie?.value) {
      try {
        const userData = JSON.parse(userCookie.value);
        return {
          username: userData.username || null,
          role_name: userData.role_name || userData.role?.role_name || null,
          avatar: userData.avatar || null,
        };
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }
  } catch (error) {
    console.error("Error reading server cookie:", error);
  }

  return null;
}

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const initialUserData = await getInitialUserData();

  return <UserLayoutClient initialUserData={initialUserData}>{children}</UserLayoutClient>;
}
