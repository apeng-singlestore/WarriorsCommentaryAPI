import { useEffect, useRef, useState } from "react";

export default function CommentarySidebar({
  commentary,
  onSendMessage,
  showAIMessages,
  onToggleAIMessages,
}) {
  const chatBoxRef = useRef(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [commentary]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="bg-gray-100 h-full flex flex-col commentary">
      <div className="p-4 bg-white border-b">
        <h2 className="text-2xl font-bold mb-2">Live Chat</h2>
        <button
          onClick={onToggleAIMessages}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          {showAIMessages ? "Hide AI Messages" : "Show AI Messages"}
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-4" ref={chatBoxRef}>
        <div className="space-y-4">
          {commentary.map((comment, index) => (
            <div
              key={index}
              className={`p-3 rounded shadow ${comment.type === "user" ? "bg-blue-100 text-right" : "bg-white"}`}
            >
              <p className="text-sm text-gray-600">
                {new Date(comment.timestamp).toLocaleTimeString()}
              </p>
              <p className="mt-1">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
