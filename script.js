document.addEventListener('DOMContentLoaded', () => {
    const character = document.getElementById('character');
    const gameContainer = document.getElementById('gameContainer');
    let gameInterval, createObjectInterval;
    let characterY = 0;
    let targetY = 0;
    let speed = 20;
    let highScore = localStorage.getItem('highScore') || 0;
    let currentScore = 0;
    let objectSpawnInterval = 3000;
    let objectMoveSpeed = 20;

    // Start game
    function startGame() {
        gameInterval = setInterval(updateGame, 40);
        createObjectInterval = setInterval(createObject, objectSpawnInterval);
    }

    // Update game state
    function updateGame() {
        moveCharacter();
        checkForMissedObjects();
    }

    // Move character
    function moveCharacter() {
        if (Math.abs(characterY - targetY) > speed) {
            characterY += characterY < targetY ? speed : -speed;
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
    }

    // Check for missed objects
    function checkForMissedObjects() {
        document.querySelectorAll('.object').forEach(object => {
            if (object.offsetLeft < character.offsetWidth && !isCollision(character, object)) {
                endGame();
            } else if (object.offsetLeft < character.offsetWidth && isCollision(character, object)) {
                object.remove();
                updateScore();
            }
        });
    }

    // Check collision
    function isCollision(rect1, rect2) {
        const r1 = rect1.getBoundingClientRect();
        const r2 = rect2.getBoundingClientRect();
        return !(r1.top > r2.bottom || r1.bottom < r2.top);
    }

    // Update score
    function updateScore() {
        currentScore++;
        if (currentScore > highScore) {
            highScore = currentScore;
            localStorage.setItem('highScore', highScore);
        }
    }

    // End game
    function endGame() {
        clearInterval(gameInterval);
        clearInterval(createObjectInterval);
        alert(`Game Over. Score: ${currentScore}. Highscore: ${highScore}`);
        currentScore = 0;
    }

    gameContainer.addEventListener('mousemove', onMouseMove);
    startGame();
});
