const userAvatarUrl = "image.png";  // You can change this to your preferred user image
const botAvatarUrl = "image1.png";   // Jim's avatar

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("user-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // ✅ Auto-greeting by the bot
  addMessage("Hi! I'm Akhil, your virtual assistant. How can I help you today?", "bot-msg");
});

function formatReply(text) {
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/(⭐+)/g, "<span style='color:gold;'>$1</span>");
  text = text.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" style="color:#007bff;">$1</a>'
  );
  return text;
}

function addMessage(text, className) {
  const chatBox = document.getElementById("chat-box");

  const messageDiv = document.createElement("div");
  messageDiv.className = className;

  const avatar = document.createElement("img");
  avatar.className = "avatar";
  avatar.src = className === "user-msg"
    ? "image.png"
    : "image1.png";

  const textBubble = document.createElement("div");
  textBubble.innerHTML = formatReply(text);

  const timestamp = document.createElement("div");
  timestamp.className = "timestamp";
  timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const container = document.createElement("div");
  container.appendChild(textBubble);
  container.appendChild(timestamp);

  messageDiv.appendChild(avatar);
  messageDiv.appendChild(container);

  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  return messageDiv;
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user-msg");
  input.value = "";

  try {
    const res = await fetch("https://ai-tools-5urn.onrender.com/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text })
    });

    const data = await res.json();
    addMessage(data.reply || "No response", "bot-msg");
  } catch (err) {
    console.error("Frontend fetch error:", err);
    addMessage("⚠️ Error contacting backend", "bot-msg");
  }
}


async function getBotReply(userMessage) {
  try {
    const response = await fetch("https://ai-tools-5urn.onrender.com/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userMessage }) // ✅ fix key here
    });

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Error:", error);
    return "⚠️ Sorry, I couldn’t reach Gemini AI.";
  }
}




document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("user-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
