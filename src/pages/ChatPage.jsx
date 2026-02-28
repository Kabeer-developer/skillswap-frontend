import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  fetchMessages,
  clearChat,
} from "../features/chat/chatSlice";
import useSocket from "../hooks/useSocket";

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function formatTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

export default function ChatPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const [text, setText] = useState("");

  useEffect(() => {
    dispatch(fetchMessages(id));
    return () => dispatch(clearChat());
  }, [dispatch, id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { sendMessage } = useSocket(id, (message) => {
    dispatch(addMessage(message));
  });

  const handleSend = () => {
    if (!text.trim()) return;
    const messageData = { barterId: id, senderId: user._id, text };
    sendMessage(messageData);
    dispatch(addMessage({ ...messageData, createdAt: new Date().toISOString() }));
    setText("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isMine = (msg) =>
    (msg.senderId?._id ?? msg.senderId) === user._id;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-2xl w-full mx-auto flex flex-col flex-1 px-4 py-8">

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm mb-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            💬
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-none">Barter Chat</p>
            <p className="text-xs text-gray-400 mt-0.5">#{id.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden mb-4">
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-0 max-h-[500px]">

            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-300 text-center">No messages yet. Say hello! 👋</p>
              </div>
            )}

            {messages.map((msg, i) => {
              const mine = isMine(msg);
              return (
                <div key={i} className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : "flex-row"}`}>

                  {/* Avatar */}
                  {!mine && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-0.5">
                      {getInitials(msg.senderId?.name ?? "?")}
                    </div>
                  )}

                  {/* Bubble */}
                  <div className={`max-w-[70%] group`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      mine
                        ? "bg-violet-600 text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}>
                      {msg.text}
                    </div>
                    <p className={`text-xs text-gray-300 mt-1 ${mine ? "text-right" : "text-left"}`}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>

                </div>
              );
            })}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-3">
            <input
              ref={inputRef}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition"
              placeholder="Type a message…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-white flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-300">Press Enter to send</p>

      </div>
    </div>
  );
}