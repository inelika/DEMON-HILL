import { Demon } from './demon.js';

let demon;

export function initCharacter() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const groundY = canvas.height - 60;
    demon = new Demon(ctx, groundY);
    return demon;
}

export function updateCharacter() {
    if (demon) demon.update();
}

export function drawCharacter(ctx) {
    if (demon) demon.draw(ctx);
}

export function handleJump() {
    if (demon) demon.jump();
}

export function handleSlide() {
    if (demon) demon.slide();
}

export function handleAttack() {
    if (demon) demon.attack();
}

export function killCharacter() {
    if (demon) demon.die();
}

export function resetCharacter() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const groundY = canvas.height - 60;
    demon = new Demon(ctx, groundY);
}

export function getCharacter() {
    return demon;
}
