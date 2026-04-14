let stompClient = null;

const BASE_URL = "https://realtimechat-viy1.onrender.com";

// 🔥 Wake server first (Render fix)
function wakeServerAndConnect() {
    fetch(BASE_URL)
        .then(() => {
            console.log("Server awake");
            connect();
        })
        .catch(() => {
            console.log("Waking server...");
            setTimeout(wakeServerAndConnect, 3000);
        });
}

// 🔌 WebSocket connect
function connect() {

    const socket = new SockJS(`${BASE_URL}/chat`);
    stompClient = Stomp.over(socket);

    // Disable debug logs
    stompClient.debug = null;

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

// 📡 Load previous chat (API)
function loadChat() {
    const sender = document.getElementById('sender').value;
    const receiver = document.getElementById('receiver').value;

    fetch(`${BASE_URL}/api/chat/${sender}/${receiver}`)
        .then(res => res.json())
        .then(data1 => {

            fetch(`${BASE_URL}/api/chat/${receiver}/${sender}`)
                .then(res => res.json())
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
        .catch(err => console.error("API error", err));
}

// 🚀 Start app (IMPORTANT)
setTimeout(() => {
    wakeServerAndConnect();
}, 2000);

// Optional polling
setInterval(loadChat, 3000);