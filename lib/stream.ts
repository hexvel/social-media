import { StreamChat } from "stream-chat";

const streamServerClient = new StreamChat(
  process.env.NEXT_PUBLIC_STREAM_KEY!,
  process.env.STREAM_SECRET,
);

export default streamServerClient;
