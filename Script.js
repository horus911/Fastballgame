<script>
        // Éléments du jeu
        const gameContainer = document.getElementById('gameContainer');
        const player = document.getElementById('player');
        const scoreDisplay = document.getElementById('scoreDisplay');
        const gameOverScreen = document.getElementById('gameOver');
        const finalScoreDisplay = document.getElementById('finalScore');
        const restartButton = document.getElementById('restartButton');
        
        // Variables du jeu
        let score = 0;
        let gameActive = true;
        let playerX = 175;
        let obstacles = [];
        let obstacleSpeed = 8;         // Vitesse initiale augmentée à 8 (était 4)
        let obstacleFrequency = 1500;
        let lastObstacleTime = 0;
        let animationFrameId = null;
        
        // Contrôle du joueur
        document.addEventListener('mousemove', (e) => {
            if (!gameActive) return;
            
            const gameRect = gameContainer.getBoundingClientRect();
            const relativeX = e.clientX - gameRect.left;
            
            // Limiter la position du joueur aux limites du conteneur
            playerX = Math.max(25, Math.min(relativeX, gameRect.width - 25));
            player.style.left = `${playerX - 25}px`;
        });
        
        // Touche mobile
        gameContainer.addEventListener('touchmove', (e) => {
            if (!gameActive) return;
            e.preventDefault();
            
            const gameRect = gameContainer.getBoundingClientRect();
            const relativeX = e.touches[0].clientX - gameRect.left;
            
            playerX = Math.max(25, Math.min(relativeX, gameRect.width - 25));
            player.style.left = `${playerX - 25}px`;
        });
        
        // Créer un obstacle
        function createObstacle() {
            const obstacle = document.createElement('div');
            obstacle.className = 'obstacle';
            
            // Position horizontale aléatoire
            const x = Math.random() * (gameContainer.offsetWidth - 60);
            obstacle.style.left = `${x}px`;
            
            gameContainer.appendChild(obstacle);
            obstacles.push({
                element: obstacle,
                x: x,
                y: -20
            });
        }
        
        // Mise à jour du jeu
        function updateGame(timestamp) {
            if (!gameActive) return;
            
            // Créer un nouvel obstacle à intervalles réguliers
            if (timestamp - lastObstacleTime > obstacleFrequency) {
                createObstacle();
                lastObstacleTime = timestamp;
                
                // Augmenter la difficulté progressivement
                obstacleFrequency = Math.max(500, obstacleFrequency - 10);
                obstacleSpeed = Math.min(12, obstacleSpeed + 0.10);  // Augmentation plus rapide (était 0.05)
            }
            
            // Mettre à jour la position des obstacles
            for (let i = obstacles.length - 1; i >= 0; i--) {
                const obstacle = obstacles[i];
                obstacle.y += obstacleSpeed;
                obstacle.element.style.top = `${obstacle.y}px`;
                
                // Vérifier la collision
                if (obstacle.y + 20 >= gameContainer.offsetHeight - 50 && 
                    obstacle.y <= gameContainer.offsetHeight - 20 &&
                    obstacle.x + 60 >= playerX - 25 && 
                    obstacle.x <= playerX + 25) {
                    gameOver();
                    return;
                }
                
                // Supprimer les obstacles qui sortent de l'écran
                if (obstacle.y > gameContainer.offsetHeight) {
                    gameContainer.removeChild(obstacle.element);
                    obstacles.splice(i, 1);
                    score++;
                    scoreDisplay.textContent = `Score: ${score}`;
                }
            }
            
            animationFrameId = requestAnimationFrame(updateGame);
        }
        
        // Fin du jeu
        function gameOver() {
            gameActive = false;
            finalScoreDisplay.textContent = `Score: ${score}`;
            gameOverScreen.style.display = 'flex';
            cancelAnimationFrame(animationFrameId);
        }
        
        // Redémarrer le jeu
        function restartGame() {
            // Nettoyer les obstacles existants
            obstacles.forEach(obstacle => {
                gameContainer.removeChild(obstacle.element);
            });
            obstacles = [];
            
            // Réinitialiser les variables
            score = 0;
            scoreDisplay.textContent = `Score: ${score}`;
            playerX = 175;
            player.style.left = `${playerX - 25}px`;
            obstacleSpeed = 2;
            obstacleFrequency = 1500;
            lastObstacleTime = 0;
            
            // Cacher l'écran de fin de jeu
            gameOverScreen.style.display = 'none';
            
            // Redémarrer le jeu
            gameActive = true;
            animationFrameId = requestAnimationFrame(updateGame);
        }
        
        // Événement du bouton de redémarrage
        restartButton.addEventListener('click', restartGame);
        
        // Démarrer le jeu
        animationFrameId = requestAnimationFrame(updateGame);
    </script>
