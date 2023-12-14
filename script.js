document.addEventListener('DOMContentLoaded', () => {
    const character = document.getElementById('character');
    const gameContainer = document.getElementById('gameContainer');
    let gameInterval;
    let nextObjectSpawnTimer;
    let characterY = 0;
    let targetY = 0;
    let speed = 20;
    let currentScore = 0;
    let minSpawnInterval = 2000; // Minimum spawn interval (2 seconds)
    let maxSpawnInterval = 3000; // Maximum spawn interval (starts at 3 seconds)
    let intervalDecreaseRate = 100; // Rate at which the max interval decreases
    let objectMoveSpeed = 20;

    const currentScoreEl = document.getElementById('currentScore');
    const highScoreEl = document.getElementById('highScore');

    let highScore = parseInt(localStorage.getItem('highScore')) || 0;
    highScoreEl.textContent = highScore;

    // Update score display
    function updateScore() {
        currentScore++;
        currentScoreEl.textContent = currentScore;

        if (currentScore > highScore) {
            highScore = currentScore;
            highScoreEl.textContent = highScore;
            localStorage.setItem('highScore', highScore);
        }
    }

    // Reset score
    function resetScore() {
        currentScore = 0;
        currentScoreEl.textContent = currentScore;
    }

    // Start game
    function startGame() {
        gameInterval = setInterval(updateGame, 40);
    }

    // Update game state
    function updateGame() {
        moveCharacter();
        checkForMissedObjects();
    }

    // Move character
    function moveCharacter() {
        let dy = Math.abs(characterY - targetY)
        if (dy > 0) {
            let my = Math.min(dy, speed); // Number of pixels to move the character
            characterY += characterY < targetY ? my : -my;
            character.style.top = characterY + 'px';
        }
    }

    // Mouse move handler
    function onMouseMove(event) {
        targetY = event.clientY - character.offsetHeight / 2;
        targetY = Math.max(0, Math.min(gameContainer.clientHeight - character.offsetHeight, targetY));
    }

    // Create objects
    function createObject() {
        let object = document.createElement('div');
        object.className = 'object';
        object.style.top = Math.random() * (gameContainer.clientHeight - 20) + 'px';
        gameContainer.appendChild(object);

        // Move object
        let objectInterval = setInterval(() => {
            let objectX = object.offsetLeft - objectMoveSpeed;
            object.style.left = objectX + 'px';
            if (objectX < -20) {
                clearInterval(objectInterval);
                object.remove();
            }
        }, 40);

        // Schedule next object spawn
        maxSpawnInterval = Math.max(minSpawnInterval, maxSpawnInterval - intervalDecreaseRate);
        let nextSpawnTime = Math.random() * (maxSpawnInterval - minSpawnInterval) + minSpawnInterval;
        nextObjectSpawnTimer = setTimeout(createObject, nextSpawnTime);
    }

    // Check for missed objects
    function checkForMissedObjects() {
        document.querySelectorAll('.object').forEach(object => {
            if (object.offsetLeft < 0 && !isCollision(character, object)) {
                endGame();
            } else if (object.offsetLeft < character.offsetWidth && isCollision(character, object)) {
                updateScore();
                object.remove();
            }
        });
    }

    // Check collision
    function isCollision(rect1, rect2) {
        const r1 = rect1.getBoundingClientRect();
        const r2 = rect2.getBoundingClientRect();
        return !(r1.top > r2.bottom || r1.bottom < r2.top);
    }

    // End game
    function endGame() {
        clearInterval(gameInterval);
        clearTimeout(nextObjectSpawnTimer);
        alert(`Game Over. Score: ${currentScore}. Highscore: ${highScore}`);
        resetScore();
    }

    gameContainer.addEventListener('mousemove', onMouseMove);
    startGame();
    createObject();
});
