"use client";

import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/types";
import { useState } from "react";
import { EditProfileDialoag } from "./edit-profile-dialog";

interface EditProfileButtonProps {
  user: UserData;
}

export default function EditProfileButton({ user }: EditProfileButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button variant={"outline"} onClick={() => setShowDialog(true)}>
        Edit Profile
      </Button>
      <EditProfileDialoag
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}
