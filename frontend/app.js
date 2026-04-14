let stompClient = null;

function connect() {
    const socket = new SockJS('http://localhost:8080/chat');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function () {

        stompClient.subscribe('/user/queue/messages', function (msg) {
            showMessage(JSON.parse(msg.body));
        });
    });
}

function sendMessage() {
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
        div.classList.add("sent");     // right side
    } else {
        div.classList.add("received"); // left side
    }

    div.innerHTML = `
        <div class="sender">${message.sender}</div>
        <div>${message.content}</div>
        <div class="time">${formattedTime}</div>
    `;

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function loadChat() {
    const sender = document.getElementById('sender').value;
    const receiver = document.getElementById('receiver').value;

    fetch(`http://localhost:8080/api/chat/${sender}/${receiver}`)
        .then(res => res.json())
        .then(data => {

            const chat = document.getElementById('chat');
            chat.innerHTML = "";

            data.forEach(msg => showMessage(msg));
        });
}

connect();