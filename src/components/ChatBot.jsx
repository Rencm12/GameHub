import { useEffect } from "react";

function ChatBot() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.async = true;
    script.setAttribute("chatbotId", "aTBYpL_edqqmiRzSa-7Dp");

    document.body.appendChild(script);
  }, []);

  return null;
}

export default ChatBot;