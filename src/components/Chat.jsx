import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Chat = () => {
  const { user, username, logout } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    socket.emit("join", username);

    socket.on("message", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("message", { user: username, text: message });
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Chat App</h1>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-blue-100"
        >
          Logout
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 max-w-xs rounded-lg ${
              msg.user === username
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-white border text-gray-800"
            }`}
          >
            <p className="text-sm font-semibold">{msg.user}</p>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <form onSubmit={sendMessage} className="flex p-4 border-t bg-white">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded-l px-4 py-2 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
