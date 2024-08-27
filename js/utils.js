function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}
//function that controls player/opponent victory
function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#displayText").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector("#displayText").innerHTML = "Tie";
    // condition for declaring player victory
  } else if (player.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Nino wins";
  }
  // condition for declaring enemy victory
  else if (enemy.health > player.health) {
    document.querySelector("#displayText").innerHTML = "Enemy wins";
  }
}
//function that controls the timer for the game
let timer = 60;
let timerId;
function decreaseTimer() {
  timerId = setTimeout(decreaseTimer, 1000);
  if (timer > 0) {
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  // determining who won the game based on players health
  // condition for declaring a tie
  if (timer === 0) {
    determineWinner({ player, enemy });
  }
}
