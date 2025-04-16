class GameController {
    constructor(ctx, demon, enemies) {
      this.ctx = ctx;
      this.demon = demon;
      this.enemies = enemies;
      this.gameOver = false;
    }
  

    gameLoop(deltaTime) {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height); 
  
      if (this.demon.isDead) {
        this.stopGame(); 
      } else {
        this.demon.update(deltaTime);
        this.demon.draw();
      }
  

      this.enemies = this.enemies.filter(enemy => {
        if (enemy.isDead) {
          return false; 
        }
        enemy.update(deltaTime);
        enemy.draw();
        return true;
      });
  
      if (!this.gameOver) {
        requestAnimationFrame(this.gameLoop.bind(this));
      }
    }
  

    stopGame() {
      this.gameOver = true;
      console.log("Игра остановлена! Демон мертв.");
    }
  

    startGame() {
      this.gameOver = false;
      this.gameLoop(0);
    }
  }
  