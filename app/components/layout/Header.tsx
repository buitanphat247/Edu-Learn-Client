import { getServerAuthState } from "@/lib/utils/auth-server";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const initialAuth = await getServerAuthState();

  return <HeaderClient initialAuth={initialAuth} />;
}
