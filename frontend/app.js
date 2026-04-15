let stompClient = null;

const DEFAULT_BASE_URL = "https://realtimechatapp24.onrender.com";
const BASE_URL = document.querySelector('meta[name="api-base-url"]')?.content?.trim() || DEFAULT_BASE_URL;
const HEALTH_URL = `${BASE_URL}/api/health`;

// 🔥 Wake server first (Render fix + 503 handling)
function wakeServerAndConnect() {
    fetch(HEALTH_URL)
        .then(res => {
            if (!res.ok) throw new Error("Server not ready");
            console.log("Server awake ✅");
            connect();
        })
        .catch(() => {
            console.log("Waking server...");
            setTimeout(wakeServerAndConnect, 5000);
        });
}

// 🔌 WebSocket connect
function connect() {

    const socket = new SockJS(`${BASE_URL}/chat`);
    stompClient = Stomp.over(socket);

    stompClient.debug = null; // disable logs

    stompClient.connect({}, function () {
        console.log("Connected ✅");

        stompClient.subscribe('/user/queue/messages', function (msg) {
            showMessage(JSON.parse(msg.body));
        });

    }, function (error) {
        console.error("WebSocket error:", error);

        // retry connection
        setTimeout(connect, 5000);
    });
}

// 📤 Send message
function sendMessage() {
    if (!stompClient || !stompClient.connected) {
        alert("Connecting... please wait");
        return;
    }

    const sender = document.getElementById('sender').value;
    const receiver = document.getElementById('receiver').value;
    const content = document.getElementById('message').value;

    stompClient.send("/app/private-message", {}, JSON.stringify({
        sender,
        receiver,
        content
    }));

    document.getElementById('message').value = "";
}

// 📥 Show message
function showMessage(message) {
    const chat = document.getElementById('chat');

    const div = document.createElement('div');
    const currentUser = document.getElementById('sender').value;

    const time = new Date(message.timestamp);
    const formattedTime =
        time.getHours() + ":" +
        String(time.getMinutes()).padStart(2, '0');

    div.classList.add("message");

    if (message.sender === currentUser) {
        div.classList.add("sent");
    } else {
        div.classList.add("received");
    }

    div.innerHTML = `
        <div class="sender">${message.sender}</div>
        <div>${message.content}</div>
        <div class="time">${formattedTime}</div>
    `;

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

// 📡 Load previous chat (with error handling)
function loadChat() {
    const sender = document.getElementById('sender').value;
    const receiver = document.getElementById('receiver').value;

    if (!sender || !receiver) {
        return;
    }

    const encodedSender = encodeURIComponent(sender);
    const encodedReceiver = encodeURIComponent(receiver);

    fetch(`${BASE_URL}/api/chat/${encodedSender}/${encodedReceiver}`)
        .then(res => {
            if (!res.ok) throw new Error("API failed");
            return res.json();
        })
        .then(data1 => {

            fetch(`${BASE_URL}/api/chat/${encodedReceiver}/${encodedSender}`)
                .then(res => {
                    if (!res.ok) throw new Error("API failed");
                    return res.json();
                })
                .then(data2 => {

                    const chat = document.getElementById('chat');
                    chat.innerHTML = "";

                    const allMessages = [...data1, ...data2];

                    allMessages.sort((a, b) =>
                        new Date(a.timestamp) - new Date(b.timestamp)
                    );

                    allMessages.forEach(msg => showMessage(msg));
                });
        })
        .catch(err => console.log("API not ready yet..."));
}

// 🚀 Start app (BEST METHOD)
window.onload = () => {
    wakeServerAndConnect();
};

// Optional polling
setInterval(loadChat, 5000);