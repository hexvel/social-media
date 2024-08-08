"use client";

import { logout } from "@/app/(auth)/actions"
import { cn } from "@/lib/utils"
import { useQueryClient } from "@tanstack/react-query"
import { Check, LogOutIcon, Monitor, Moon, Sun, UserIcon } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useState } from "react"
import { useSession } from "./providers/session-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import UserAvatar from "./user-avatar"

interface UserButtonProps {
  className?: string;
}

const UserButton = ({ className }: UserButtonProps) => {
  const { user } = useSession();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  return (
    <DropdownMenu open={isOpen}>
      <DropdownMenuTrigger asChild onClick={() => setIsOpen(!isOpen)}>
        <button className={cn("flex-none rounded-full", className)}>
          <UserAvatar avatarUrl={user.avatarUrl} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenu>
          <DropdownMenuLabel>Logged in as @{user.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link
            href={`/users/${user.username}`}
            onClick={() => setIsOpen(false)}
          >
            <DropdownMenuItem>
              <UserIcon className="mr-2 size-4" />
              Profile
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Monitor className="mr-2 size-4" />
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="mr-2 size-4" />
                  System default
                  {theme === "system" && <Check className="ms-2 size-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 size-4" />
                  Light
                  {theme === "light" && <Check className="ms-2 size-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 size-4" />
                  Dark
                  {theme === "dark" && <Check className="ms-2 size-4" />}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              queryClient.clear();
              logout();
            }}
          >
            <LogOutIcon className="mr-2 size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenu>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
