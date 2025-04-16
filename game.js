const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const gameOverMessage = document.getElementById("gameOverMessage");

import { Demon } from './demon.js';
import { Skeleton } from './skeleton.js';
import { Ripper } from './ripper.js';
import { Stgom } from './stgom.js';
import { Ghost } from './ghost.js';

let loadedSprites = {};
let lastTime = 0;

fetch('assetses.json')
  .then(response => response.json())
  .then(data => loadSprites(data))
  .catch(error => console.error('Ошибка при загрузке JSON:', error));

function loadSprites(data) {
  const image = new Image();
  image.src = data.meta.image;
  image.onload = () => {
    Object.keys(data.frames).forEach((key) => {
      const frame = data.frames[key].frame;
      loadedSprites[key] = {
        image: image,
        x: frame.x,
        y: frame.y,
        w: frame.w,
        h: frame.h
      };
    });
  };
}

export function drawSprite(spriteName, dx, dy, dw, dh) {
  const sprite = loadedSprites[spriteName];
  if (!sprite) return;
  ctx.drawImage(
    sprite.image,
    sprite.x,
    sprite.y,
    sprite.w,
    sprite.h,
    dx,
    dy,
    dw || sprite.w,
    dh || sprite.h
  );
}

let demon, enemies = [];
let gameSpeed = 3;
let gameInterval = false;
let spawnInterval = null;
let difficulty = 'easy';

function startGame() {
  enemies = [];
  gameOverMessage.style.display = "none";
  difficulty = document.getElementById("difficulty").value;
  gameSpeed = getGameSpeed(difficulty);
  demon = new Demon(ctx, canvas.height - 110);

  if (spawnInterval) clearInterval(spawnInterval);
  spawnInterval = setInterval(spawnEnemy, 2000);

  lastTime = 0;
  gameInterval = true;
  requestAnimationFrame(gameLoop);
}

function getGameSpeed(diff) {
  return {
    easy: 3,
    medium: 5,
    hard: 7
  }[diff];
}

function spawnEnemy() {
  const types = ['skeleton', 'ripper', 'stgom'];

  if (difficulty !== 'easy' && Math.random() > 0.6) {
    enemies.push(new Ghost(ctx, canvas.width, difficulty));
  } else {
    const type = types[Math.floor(Math.random() * types.length)];
    switch (type) {
      case 'skeleton': enemies.push(new Skeleton(ctx, canvas.width)); break;
      case 'ripper': enemies.push(new Ripper(ctx, canvas.width)); break;
      case 'stgom': enemies.push(new Stgom(ctx, canvas.width)); break;
    }
  }
}

function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#333';
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

  demon.update(deltaTime);
  demon.draw(deltaTime);

  enemies.forEach((enemy) => {
    enemy.update(gameSpeed);
    enemy.draw();

    if (!enemy.isDead && demon.state === 'attack' && checkCollision(demon, enemy, 20)) {
      enemy.die();
    }

    if (!enemy.isDead && demon.state !== 'dead' && checkCollision(demon, enemy, 10)) {
      demon.die();
    }
  });

  enemies = enemies.filter(enemy => !enemy.isDead || !enemy.deathAnimationFinished());

  if (gameInterval && demon.state !== 'dead') {
    requestAnimationFrame(gameLoop);
  } else if (demon.state === 'dead') {
    endGame();
  }
}

function checkCollision(obj1, obj2, offset = 0) {
  return (
    obj1.x + obj1.width > obj2.x + offset &&
    obj1.x + offset < obj2.x + obj2.width &&
    obj1.y + obj1.height > obj2.y + offset &&
    obj1.y + offset < obj2.y + obj2.height
  );
}

function endGame() {
  gameInterval = false;
  clearInterval(spawnInterval);
  gameOverMessage.textContent = `Игра окончена!`;
  gameOverMessage.style.display = "block";
  startBtn.disabled = false;
}

startBtn.addEventListener("click", () => {
  if (gameInterval) return;
  startGame();
  startBtn.disabled = true;
});

restartBtn.addEventListener("click", () => {
  startGame();
  startBtn.disabled = true;
});

document.addEventListener("keydown", (e) => {
  if (!gameInterval) return;
  if (demon.state === 'dead') return;

  switch (e.key.toLowerCase()) {
    case 'w':
    case 'arrowup':
      demon.jump();
      break;
    case 's':
    case 'arrowdown':
      demon.slide();
      break;
    case 'a':
    case ' ':
      demon.attack();
      break;
  }
});
