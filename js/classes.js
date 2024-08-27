// Define a base class `Sprite` that handles basic sprite properties and methods.
class Sprite {
  // Constructor to initialize a new sprite object with customizable properties.
  constructor({
    position,    // The position of the sprite on the canvas, provided as an object with x and y coordinates.
    imageSrc,    // The source path of the image to be used for the sprite.
    scale = 1,   // The scale factor to resize the sprite's image, defaulting to 1 (original size).
    framesMax = 1, // The total number of animation frames the sprite's image contains, defaulting to 1 (static image).
    offset = { x: 0, y: 0 }, // Offset to adjust the sprite's position relative to the `position` coordinates.
  }) {
    this.position = position; // Set the sprite's position based on the provided coordinates.
    this.width = 50; // Default width of the sprite.
    this.height = 150; // Default height of the sprite.
    this.image = new Image(); // Create a new Image object to hold the sprite's image.
    this.image.src = imageSrc; // Set the image source path to the provided `imageSrc`.
    this.scale = scale; // Set the scale factor for the sprite's image.
    this.framesMax = framesMax; // Set the maximum number of animation frames.
    this.frameCurrent = 0; // Initialize the current frame to 0 (start at the first frame).
    this.frameElapsed = 0; // Counter to keep track of how many frames have elapsed since the last animation update.
    this.framesHold = 8; // Number of frames to hold before advancing to the next animation frame, slowing down the animation.
    this.offset = offset; // Set the position offset to adjust the sprite's location on the canvas.
  }

  // Method to draw the sprite on the canvas.
  draw() {
    c.drawImage(
      this.image, // The image to be drawn.
      this.frameCurrent * (this.image.width / this.framesMax), // Source x-coordinate for cropping the image, based on the current frame.
      0, // Source y-coordinate for cropping the image (top of the image).
      this.image.width / this.framesMax, // Width of the cropped image, divided by the number of frames.
      this.image.height, // Height of the cropped image (full image height).
      this.position.x - this.offset.x, // Destination x-coordinate on the canvas, adjusted by the x-offset.
      this.position.y - this.offset.y, // Destination y-coordinate on the canvas, adjusted by the y-offset.
      (this.image.width / this.framesMax) * this.scale, // Width of the image on the canvas, adjusted by the scale factor.
      this.image.height * this.scale // Height of the image on the canvas, adjusted by the scale factor.
    );
  }

  // Method to handle frame animation by updating the current frame.
  animateFrame() {
    this.frameElapsed++; // Increment the frame elapsed counter.
    if (this.frameElapsed % this.framesHold === 0) { // Check if it's time to switch to the next frame.
      if (this.frameCurrent < this.framesMax - 1) { // If not at the last frame, increment the current frame.
        this.frameCurrent++;
      } else {
        this.frameCurrent = 0; // If at the last frame, loop back to the first frame.
      }
    }
  }

  // Method to update the sprite's state, drawing and animating it.
  update() {
    this.draw(); // Draw the sprite on the canvas.
    this.animateFrame(); // Update the frame for animation.
  }
}

// Define a `Fighter` class that extends `Sprite` to include additional properties and methods for a fighting game character.
class Fighter extends Sprite {
  // Constructor to initialize a new fighter object with additional properties.
  constructor({
    position,    // Position of the fighter on the canvas.
    velocity,    // Velocity of the fighter, which affects its movement.
    color = "red", // The color used for the fighter's visual elements, defaulting to red.
    imageSrc,    // The source path of the fighter's image.
    scale = 1,   // The scale factor to resize the fighter's image.
    framesMax = 1, // The total number of animation frames the fighter's image contains.
    offset = { x: 0, y: 0 }, // Offset to adjust the fighter's position on the canvas.
    sprites,     // An object containing the different sprite states for the fighter (e.g., idle, run, jump).
    attackBox = { offset: {}, width: undefined, height: undefined } // Attack box properties, including offset, width, and height.
  }) {
    super({
      position, // Pass the position to the `Sprite` constructor.
      imageSrc, // Pass the image source path to the `Sprite` constructor.
      scale, // Pass the scale factor to the `Sprite` constructor.
      framesMax, // Pass the maximum number of frames to the `Sprite` constructor.
      offset, // Pass the offset to the `Sprite` constructor.
    });

    this.velocity = velocity; // Set the velocity of the fighter.
    this.width = 50; // Default width of the fighter.
    this.height = 150; // Default height of the fighter.
    this.lastKey; // Variable to track the last key pressed for movement.
    this.attackBox = {
      position: {
        x: this.position.x, // Initialize the x-coordinate of the attack box based on the fighter's position.
        y: this.position.y, // Initialize the y-coordinate of the attack box based on the fighter's position.
      },
      offset: attackBox.offset, // Set the attack box offset to adjust its position relative to the fighter.
      width: attackBox.width, // Set the width of the attack box.
      height: attackBox.height, // Set the height of the attack box.
    };
    this.color = color; // Set the fighter's color.
    this.isAttacking = false; // Boolean to track if the fighter is currently attacking.
    this.health = 100; // Initialize the fighter's health to 100.
    this.sprites = sprites; // Store the different sprite states for the fighter.
    this.dead = false; // Boolean to track if the fighter is dead.

    // Load the images for each sprite state.
    for (const sprite in this.sprites) {
      this.sprites[sprite].image = new Image(); // Create a new Image object for each sprite state.
      this.sprites[sprite].image.src = this.sprites[sprite].imageSrc; // Set the image source for each sprite state.
    }
  }

  // Update method to manage the fighter's state, including movement, attack, and gravity.
  update() {
    // Prevent further updates if dead
    if (this.dead) return;

    this.draw(); // Draw the fighter on the canvas.
    this.animateFrame(); // Update the frame for animation.

    // Update attack box position to match the fighter's current position.
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // Update fighter's position based on velocity.
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Implement gravity by adjusting the fighter's vertical position.
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0; // Stop downward movement if the fighter reaches the ground.
      this.position.y = 330; // Set the y-coordinate to prevent the fighter from sinking into the ground.
    } else {
      this.velocity.y += gravity; // Apply gravity to the fighter's velocity.
    }
  }

  // Method to initiate an attack action for the fighter.
  attack() {
    if (this.dead) return; // Prevent attacking if dead
    this.SwitchSprite('attack1'); // Switch to the attack sprite.
    this.isAttacking = true; // Set the attacking flag to true.
  }

  // Method to handle when the fighter takes a hit.
  takeHit() {
    if (this.dead) return; // Prevent taking a hit if dead
    this.health -= 20; // Decrease the fighter's health by 20.

    if (this.health <= 0) {
      this.SwitchSprite('death'); // Switch to the death sprite if health is depleted.
    } else {
      this.SwitchSprite('takeHit'); // Switch to the take hit sprite if still alive.
    }
  }

  // Method to switch the fighter's sprite based on its current action.
  SwitchSprite(sprite) {
    // Prevent switching if dead and animation is complete
    if (this.dead && this.frameCurrent === this.sprites.death.framesMax - 1) return;

    // Prevent overriding attack or hit animations
    if (
      (this.image === this.sprites.attack1.image && this.frameCurrent < this.sprites.attack1.framesMax - 1) ||
      (this.image === this.sprites.takeHit.image && this.frameCurrent < this.sprites.takeHit.framesMax - 1)
    ) return;

    // Handle death sprite
    if (this.image === this.sprites.death.image) {
      if (this.frameCurrent === this.sprites.death.framesMax - 1) {
        this.dead = true; // Set the dead flag to true when the death animation completes.
      }
      return;
    }

    // Switch sprite based on the current action
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.frameCurrent = 0;
        }
        break;
    }
  }
}
