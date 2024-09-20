document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const restartButton = document.getElementById('restartButton');

  // Mobile controls
  const leftButton = document.getElementById('leftButton');
  const rightButton = document.getElementById('rightButton');
  const shootButton = document.getElementById('shootButton');

  // Set canvas size dynamically for responsiveness
  function setCanvasSize() {
    canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth - 20;
    canvas.height = window.innerHeight > 600 ? 600 : window.innerHeight - 150;
  }

  window.addEventListener('resize', setCanvasSize);
  setCanvasSize();

  // Game variables
  let gameLoop;
  let player;
  let aliens = [];
  let bullets = [];
  let score = 0;
  let gameOver = false;

  // Initialize game
  function init() {
    player = { x: canvas.width / 2 - 25, y: canvas.height - 50, width: 50, height: 30 };
    aliens = [];
    bullets = [];
    score = 0;
    gameOver = false;

    // Create aliens
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        aliens.push({
          x: i * 80 + 50,
          y: j * 50 + 30,
          width: 40,
          height: 30
        });
      }
    }

    // Hide restart button
    restartButton.classList.remove('visible');
    restartButton.classList.add('hidden');

    // Start game loop
    gameLoop = requestAnimationFrame(update);
  }

  // Update game state
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
      // Move and draw player
      ctx.fillStyle = 'blue';
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Move and draw aliens
      ctx.fillStyle = 'green';
      aliens.forEach(alien => {
        alien.y += 0.2;
        ctx.fillRect(alien.x, alien.y, alien.width, alien.height);

        // Check if alien reached bottom
        if (alien.y + alien.height > canvas.height) {
          gameOver = true;
        }
      });

      // Move and draw bullets
      ctx.fillStyle = 'red';
      bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Remove bullet if it's off screen
        if (bullet.y < 0) {
          bullets.splice(index, 1);
        }

        // Check collision with aliens
        aliens.forEach((alien, alienIndex) => {
          if (
            bullet.x < alien.x + alien.width &&
            bullet.x + bullet.width > alien.x &&
            bullet.y < alien.y + alien.height &&
            bullet.y + bullet.height > alien.y
          ) {
            aliens.splice(alienIndex, 1);
            bullets.splice(index, 1);
            score += 10;
          }
        });
      });

      // Draw score
      ctx.fillStyle = 'black';
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${score}`, 10, 30);

      gameLoop = requestAnimationFrame(update);
    } else {
      // Game over screen
      ctx.fillStyle = 'black';
      ctx.font = '40px Arial';
      ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
      ctx.font = '20px Arial';
      ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 60, canvas.height / 2 + 40);

      // Show restart button
      restartButton.classList.remove('hidden');
      restartButton.classList.add('visible');
    }
  }

  // Handle key presses
  function handleKeyPress(e) {
    if (e.key === 'ArrowLeft' && player.x > 0) {
      player.x -= 10;
    } else if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) {
      player.x += 10;
    } else if (e.key === ' ') {
      bullets.push({
        x: player.x + player.width / 2 - 2.5,
        y: player.y,
        width: 5,
        height: 10
      });
    }
  }

  // Handle mobile controls
  function handleMobileControls() {
    leftButton.addEventListener('click', () => {
      if (player.x > 0) player.x -= 10;
    });

    rightButton.addEventListener('click', () => {
      if (player.x < canvas.width - player.width) player.x += 10;
    });

    shootButton.addEventListener('click', () => {
      bullets.push({
        x: player.x + player.width / 2 - 2.5,
        y: player.y,
        width: 5,
        height: 10
      });
    });
  }

  // Add event listener for key presses
  window.addEventListener('keydown', handleKeyPress);

  // Handle mobile touch events
  handleMobileControls();

  // Add event listener to restart button
  restartButton.addEventListener('click', function() {
    cancelAnimationFrame(gameLoop);
    init(); // Restart the game
  });

  // Initialize the game
  init();

  // Cleanup when page is closed or refreshed
  window.addEventListener('beforeunload', () => {
    window.removeEventListener('keydown', handleKeyPress);
    cancelAnimationFrame(gameLoop);
  });
});
