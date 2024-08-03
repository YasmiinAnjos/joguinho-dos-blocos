const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const player = {
    x: 50,
    y: canvas.height / 2 - 25,
    width: 50,
    height: 50,
    color: 'pink',
    speed: 5,
    dy: 0,
    colorIndex: 0 // Adicionando este índice para gerenciar a cor
};

const colors = ['pink', 'skyblue', 'lightgreen', 'lightyellow'];
let obstacles = [];
let gameRunning = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('changeColor').addEventListener('click', changeColor);
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

function startGame() {
    gameRunning = true;
    score = 0;
    player.y = canvas.height / 2 - 25;
    obstacles = [];
    gameLoop();
}

function changeColor() {
    player.colorIndex = (player.colorIndex + 1) % colors.length;
    player.color = colors[player.colorIndex];
}

function createObstacle() {
    const obstacleHeight = 50;
    const obstacleWidth = 50;
    const obstacleY = Math.floor(Math.random() * (canvas.height - obstacleHeight));
    const obstacleColor = colors[Math.floor(Math.random() * colors.length)];

    obstacles.push({
        x: canvas.width,
        y: obstacleY,
        width: obstacleWidth,
        height: obstacleHeight,
        color: obstacleColor,
        speed: 5
    });
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= obstacle.speed;
    });

    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function detectCollision() {
    for (let obstacle of obstacles) {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.height + player.y > obstacle.y) {
            if (player.color === obstacle.color) {
                score++;
                obstacles = obstacles.filter(obj => obj !== obstacle); // Remove obstacle if passed successfully
            } else {
                gameRunning = false;
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('highScore', highScore);
                }
                alert('Game Over! Sua Pontuação: ' + score + '\nRecorde: ' + highScore);
                return;
            }
        }
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Indie Flower';
    ctx.fillText('Pontuação: ' + score, 10, 30);
    ctx.fillText('Recorde: ' + highScore, 10, 60);
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.02) {
        createObstacle();
    }

    updatePlayerPosition();
    drawPlayer();
    drawObstacles();
    updateObstacles();
    detectCollision();
    drawScore();

    requestAnimationFrame(gameLoop);
}

function keyDown(e) {
    if (e.key === 'ArrowUp' || e.key === 'Up') {
        player.dy = -player.speed;
    } else if (e.key === 'ArrowDown' || e.key === 'Down') {
        player.dy = player.speed;
    }
}

function keyUp(e) {
    if (e.key === 'ArrowUp' || e.key === 'Up' || e.key === 'ArrowDown' || e.key === 'Down') {
        player.dy = 0;
    }
}

function updatePlayerPosition() {
    player.y += player.dy;

    // Ensure the player stays within the canvas boundaries
    if (player.y < 0) {
        player.y = 0;
    } else if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

window.onload = () => {
    highScore = localStorage.getItem('highScore') || 0;
    drawScore();
};
