import { Metadata } from "next";
import Chat from "./_components/chat";

export const metadata: Metadata = {
  title: "Messages",
};

export default function Page() {
  return <Chat />;
}
