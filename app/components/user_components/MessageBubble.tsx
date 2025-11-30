interface MessageBubbleProps {
  text: string;
  time: string;
  sender: "me" | "other";
}

export default function MessageBubble({ text, time, sender }: MessageBubbleProps) {
  return (
    <div className={`flex ${sender === "me" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          sender === "me"
            ? "bg-blue-500 text-white"
            : "bg-white text-gray-800 border border-gray-300"
        }`}
      >
        <p className="text-sm">{text}</p>
        <span
          className={`text-xs mt-1 block ${
            sender === "me" ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {time}
        </span>
      </div>
    </div>
  );
}

