let secretNumber = Math.floor(Math.random() * 20) + 1;
let attempts = 0;
let timeLeft = 30;
let timer;
let musicPlaying = true;

let playerTurn = 1;
let score1 = 0;
let score2 = 0;

function setLevel() {
    let level = document.getElementById("level").value;
    if (level === "easy") timeLeft = 30;
    else if (level === "medium") timeLeft = 20;
    else timeLeft = 10;
    resetGame();
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        document.getElementById("timer").innerText = `⏳ Time: ${timeLeft}s`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timer);
            document.getElementById("message").innerHTML = `⏰ Time Over! 😢 Number tha ${secretNumber}`;
            document.getElementById("message").style.color = "red";
            saveLeaderboard();
        }
    }, 1000);
}

function checkGuess() {
    let guess = parseInt(document.getElementById("guess").value);
    let message = document.getElementById("message");
    attempts++;

    if (timeLeft < 0) {
        message.innerHTML = "⚠️ Time khatam ho gaya!";
        return;
    }

    if (guess < 1 || guess > 20 || isNaN(guess)) {
        message.innerHTML = "⚠️ Sirf 1 se 20 ke beech number guess karo!";
        message.style.color = "yellow";
        return;
    }

    if (guess === secretNumber) {
        message.innerHTML = `🎉 Wah! Sahi jawab! Number tha ${secretNumber}.`;
        message.style.color = "lightgreen";
        clearInterval(timer);

        if (playerTurn === 1) score1 += 10;
        else score2 += 10;
        saveLeaderboard();
    } else {
        message.innerHTML = guess > secretNumber ? "📉 Chhota number guess karo!" : "📈 Bada number guess karo!";
        message.style.color = "orange";

        // Wrong guess → -2 points
        if (playerTurn === 1) score1 -= 2;
        else score2 -= 2;

        // Switch turn
        playerTurn = playerTurn === 1 ? 2 : 1;
        document.getElementById("turn").innerText = `🎮 Player ${playerTurn} ka turn`;
    }

    updateScore();
}

function resetGame() {
    secretNumber = Math.floor(Math.random() * 20) + 1;
    attempts = 0;
    document.getElementById("guess").value = "";
    document.getElementById("message").innerHTML = "";
    clearInterval(timer);
    startTimer();
    playerTurn = 1;
    document.getElementById("turn").innerText = "🎮 Player 1 ka turn";
    updateScore();
}

function updateScore() {
    document.getElementById("score").innerText = `🏆 Player1: ${score1} | Player2: ${score2}`;
}

function toggleMusic() {
    let music = document.getElementById("bg-music");
    if (musicPlaying) {
        music.pause();
        musicPlaying = false;
    } else {
        music.play();
        musicPlaying = true;
    }
}

function saveLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ p1: score1, p2: score2, date: new Date().toLocaleString() });
    leaderboard.sort((a, b) => (b.p1 + b.p2) - (a.p1 + a.p2)); // Highest score first
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard.slice(0, 5)));
    showLeaderboard();
}

function showLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let html = "";
    leaderboard.forEach((item, index) => {
        html += `#${index + 1} 🥇 P1: ${item.p1} | P2: ${item.p2} (${item.date})<br>`;
    });
    document.getElementById("leaderboard").innerHTML = html;
}

startTimer();
showLeaderboard();
