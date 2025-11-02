import { Button } from "@/components/ui/button";
import { useLogout } from "@refinedev/core";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { mutate: logout } = useLogout();
  return (
    <Button variant="destructive" onClick={() => logout()}>
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}
