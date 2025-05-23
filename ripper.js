export class Ripper {
    constructor(ctx, x) {
      this.ctx = ctx;
      this.x = x;
      this.y = 330;
      this.width = 70;
      this.height = 70;
  
      this.frameIndex = 0;
      this.frameTimer = 0; 
      this.frameInterval = 100;
  
      this.state = 'stand';
      this.frameCount = {
        stand: 18,
        death: 15
      };
  
      this.sprites = {
        stand: { img: new Image(), loaded: false, src: "images/ripperstand.png" },
        death: { img: new Image(), loaded: false, src: "images/ripperdeath.png" }
      };
  
      this.loadImages();
    }
  
    loadImages() {
      Object.keys(this.sprites).forEach(key => {
        this.sprites[key].img.onload = () => {
          this.sprites[key].loaded = true;
        };
        this.sprites[key].img.src = this.sprites[key].src;
      });
    }
  
    update(speed) {
      if (this.isDead) return;
  
      this.x -= speed;
  
      if (this.state === 'stand') {
        this.frameTimer += 1;
        if (this.frameTimer >= this.frameInterval) {
          this.frameTimer = 0;
          this.frameIndex = (this.frameIndex + 1) % this.frameCount.stand;
        }
      }
    }
  
    draw() {
      const sprite = this.sprites[this.state];
      if (sprite.loaded) {
        const frameWidth = sprite.img.width / this.frameCount[this.state];
        this.ctx.drawImage(
          sprite.img,
          this.frameIndex * frameWidth, 0,
          frameWidth, sprite.img.height,
          this.x, this.y,
          this.width, this.height
        );
      } else {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
  
    die() {
      this.isDead = true;
      this.state = 'death';
    }
  }
  
