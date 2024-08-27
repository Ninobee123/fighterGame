// Select the canvas element and get its 2D rendering context
let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 1024;
canvas.height = 576;

// Fill the entire canvas with a black rectangle
c.fillRect(0, 0, canvas.width, canvas.height);

// Define gravity, which will affect the player's jump
const gravity = 0.7; 

// Initialize the background sprite with its position and image source
let background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./images/background.png",
});

// Initialize the shop sprite with its position, image source, scale, and frame settings
let shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./images/shop.png",
  scale: 2.75,
  framesMax: 6,
});

// Create the player sprite with various properties like position, velocity, image source, and sprite animations
let player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./images/samuraiMack/idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./images/samuraiMack/idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./images/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./images/samuraiMack/jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./images/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./images/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./images/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./images/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

// Create the enemy sprite with similar properties as the player but with different positions, images, and settings
let enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./images/kenji/idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "./images/kenji/idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./images/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./images/kenji/jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./images/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./images/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./images/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./images/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});

// Keypress states for player and enemy controls
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
  ArrowDown: {
    pressed: false,
  },
  b: {
    pressed: false,
  },
};

// Function to decrease the game timer
decreaseTimer();

// Animation loop to update the game state on each frame
function animate() {
  window.requestAnimationFrame(animate);

  // Clear the canvas for each frame and fill it with a black rectangle
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // Update background and shop sprites
  background.update();
  shop.update();
  c.fillStyle = 'rgba(255, 255,255,0.15)' // for contast color
c.fillRect(0, 0, canvas.width, canvas.height)
  // Update player and enemy sprites
  player.update();
  enemy.update();

  // Reset player and enemy velocities
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // Handle player movement
  if (!player.dead) {
    if (keys.a.pressed && player.lastKey === "a") {
      player.velocity.x = -5;
      player.SwitchSprite("run");
    } else if (keys.d.pressed && player.lastKey === "d") {
      player.velocity.x = 5;
      player.SwitchSprite("run");
    } else {
      player.SwitchSprite("idle");
    }

    if (player.velocity.y < 0) {
      player.SwitchSprite("jump");
    } else if (player.velocity.y > 0) {
      player.SwitchSprite("fall");
    }
  }

  // Handle enemy movement
  if (!enemy.dead) {
    if (keys.ArrowUp.pressed && enemy.lastKey === "ArrowUp") {
      enemy.velocity.x = -5;
      enemy.SwitchSprite("run");
    } else if (keys.ArrowDown.pressed && enemy.lastKey === "ArrowDown") {
      enemy.velocity.x = 5;
      enemy.SwitchSprite("run");
    } else {
      enemy.SwitchSprite("idle");
    }

    if (enemy.velocity.y < 0) {
      enemy.SwitchSprite("jump");
    } else if (enemy.velocity.y > 0) {
      enemy.SwitchSprite("fall");
    }
  }

  // Check if player collides with the enemy and handle the attack
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.frameCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;

    //document.querySelector("#enemyHealth").style.width = enemy.health + "%"
    //animates the enemy health bar
    gsap.to('#enemyHealth', {
      width: enemy.health + "%"
    })
  }

  // Reset player attack if it misses
  if (player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false;
  }

  // Check if enemy collides with the player and handle the attack
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.frameCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    //document.querySelector("#playerHealth").style.width = player.health + "%";
     //animates the player health bar
     gsap.to('#playerHealth', {
      width: player.health + "%"
    })
  }

  // Reset enemy attack if it misses
  if (enemy.isAttacking && enemy.frameCurrent === 2) {
    enemy.isAttacking = false;
  }

  // Determine the winner if either player or enemy health is 0
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

// Event listeners for keydown events to control player and enemy movement
window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        keys.w.pressed = true;
        if (player.velocity.y === 0) {
          player.velocity.y = -20;
        }
        break;
      case " ":
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowUp":
        keys.ArrowUp.pressed = true;
        enemy.lastKey = "ArrowUp";
        break;
      case "ArrowDown":
        keys.ArrowDown.pressed = true;
        enemy.lastKey = "ArrowDown";
        break;
      case "b":
        keys.b.pressed = true;
        if (enemy.velocity.y === 0) {
          enemy.velocity.y = -20;
        }
        break;
      case "n":
        enemy.attack();
        break;
    }
  }
});

// Event listeners for keyup events to stop player and enemy movement
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
  }

  switch (event.key) {
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
    case "ArrowDown":
      keys.ArrowDown.pressed = false;
      break;
    case "b":
      keys.b.pressed = false;
      break;
  }
});
