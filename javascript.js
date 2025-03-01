// Reality Bender Game Engine
class RealityBender {
    constructor() {
        this.initGame();
        this.setupEventListeners();
        this.gameLoop();
    }

    initGame() {
        // Game elements
        this.player = document.getElementById('player');
        this.gameArea = document.getElementById('gameArea');
        this.obstacles = document.querySelectorAll('.obstacle');
        this.goal = document.getElementById('goal');
        
        // Game state
        this.posX = 50;
        this.posY = 50;
        this.velocity = 0;
        this.gravity = 0.5;
        this.jumpForce = -12;
        this.gravityDirection = 1; // 1 = down, -1 = up
        this.currentDimension = 1;
        this.isTimeReversed = false;
        this.positionHistory = [];
        this.isGameActive = true;

        // UI Elements
        this.createUI();
    }

    createUI() {
        const instructions = document.createElement('div');
        instructions.className = 'instructions';
        instructions.innerHTML = `
            <h3>Reality Bender Controls:</h3>
            <p>←→↑↓ - Movement<br>
            G - Toggle Gravity<br>
            D - Shift Dimension<br>
            T - Reverse Time</p>
        `;
        document.body.appendChild(instructions);
    }

    setupEventListeners() {
        // Keyboard controls
        this.keys = {};
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            this.handleRealityInput(e);
            this.addKeyPressEffect(e.key);
        });
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
    }

    handleRealityInput(e) {
        if (e.key === 'g') this.toggleGravity();
        if (e.key === 'd') this.shiftDimension();
        if (e.key === 't') this.toggleTime();
    }

    addKeyPressEffect(key) {
        const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (validKeys.includes(key)) {
            this.player.classList.add('key-pressed');
            setTimeout(() => this.player.classList.remove('key-pressed'), 100);
        }
    }

    toggleGravity() {
        this.gravityDirection *= -1;
        this.player.classList.toggle('gravity-changed');
        this.showRealityAlert('Gravity Inverted!');
        this.createParadoxEffect();
    }

    shiftDimension() {
        this.currentDimension = this.currentDimension % 3 + 1;
        this.gameArea.className = `dimension${this.currentDimension}`;
        this.gameArea.classList.add('dimension-shift');
        setTimeout(() => this.gameArea.classList.remove('dimension-shift'), 500);
        this.showRealityAlert(`Dimension ${this.currentDimension}`);
    }

    toggleTime() {
        this.isTimeReversed = !this.isTimeReversed;
        this.gameArea.classList.toggle('time-reversed');
        
        if (this.isTimeReversed) {
            this.positionHistory = [];
            this.timeInterval = setInterval(() => this.recordPosition(), 100);
            this.showRealityAlert('Time Reversed!');
        } else {
            clearInterval(this.timeInterval);
            this.rewindTime();
        }
    }

    recordPosition() {
        this.positionHistory.push({ x: this.posX, y: this.posY });
        if (this.positionHistory.length > 50) this.positionHistory.shift();
    }

    rewindTime() {
        const rewind = () => {
            if (this.positionHistory.length > 0) {
                const pastPos = this.positionHistory.pop();
                this.posX = pastPos.x;
                this.posY = pastPos.y;
                requestAnimationFrame(rewind);
            }
        };
        requestAnimationFrame(rewind);
    }

    createParadoxEffect() {
        const paradox = document.createElement('div');
        paradox.className = 'paradox-effect';
        this.gameArea.appendChild(paradox);
        setTimeout(() => paradox.remove(), 1000);
    }

    showRealityAlert(message) {
        const alert = document.createElement('div');
        alert.className = 'reality-alert';
        alert.textContent = message;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 2000);
    }

    updatePhysics() {
        // Apply gravity
        this.velocity += this.gravity * this.gravityDirection;
        this.posY += this.velocity;

        // Horizontal movement
        if (this.keys.ArrowRight) this.posX += 5;
        if (this.keys.ArrowLeft) this.posX -= 5;

        // Jumping (different behavior based on gravity)
        if (this.keys.ArrowUp && this.gravityDirection === 1) this.velocity = this.jumpForce;
        if (this.keys.ArrowDown && this.gravityDirection === -1) this.velocity = -this.jumpForce;

        // Screen boundaries
        this.posX = Math.max(0, Math.min(window.innerWidth - 30, this.posX));
        this.posY = Math.max(0, Math.min(window.innerHeight - 30, this.posY));
    }

    checkCollisions() {
        // Obstacle collisions
        this.obstacles.forEach(obstacle => {
            const rect1 = this.player.getBoundingClientRect();
            const rect2 = obstacle.getBoundingClientRect();
            
            if (!(rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom < rect2.top || 
                rect1.top > rect2.bottom)) {
                this.handleCollision();
            }
        });

        // Goal check
        const goalRect = this.goal.getBoundingClientRect();
        const playerRect = this.player.getBoundingClientRect();
        if (!(playerRect.right < goalRect.left || 
            playerRect.left > goalRect.right || 
            playerRect.bottom < goalRect.top || 
            playerRect.top > goalRect.bottom)) {
            this.handleVictory();
        }
    }

    handleCollision() {
        this.isGameActive = false;
        this.showRealityAlert('Paradox Created! Restarting...');
        setTimeout(() => window.location.reload(), 2000);
    }

    handleVictory() {
        this.isGameActive = false;
        const victoryScreen = document.createElement('div');
        victoryScreen.className = 'victory-screen';
        victoryScreen.innerHTML = `
            <h2>Reality Stabilized!</h2>
            <p>Dimensions mastered: ${this.currentDimension}</p>
            <button onclick="window.location.reload()">Bend Again</button>
        `;
        document.body.appendChild(victoryScreen);
    }

    updatePlayerPosition() {
        this.player.style.left = `${this.posX}px`;
        this.player.style.top = `${this.posY}px`;
    }

    gameLoop() {
        if (this.isGameActive) {
            this.updatePhysics();
            this.updatePlayerPosition();
            this.checkCollisions();
            requestAnimationFrame(() => this.gameLoop());
        }
    }
}

// Start the game when loaded
window.addEventListener('DOMContentLoaded', () => new RealityBender());
