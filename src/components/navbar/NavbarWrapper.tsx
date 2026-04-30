import { getUserSession } from "@/utils/getUserSession";
import Navbar from "./Navbar";

export default async function NavbarWrapper() {
  const user = await getUserSession();

  return <Navbar user={user} />;
}
