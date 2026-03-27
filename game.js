let gameRunning = false;
let score = 0;

// ... (todo o seu código de setup da Scene, Camera, Player aqui) ...

function startGame() {
    const name = document.getElementById('username').value;
    if (name.length < 2) {
        alert("Insira um nome de Agente!");
        return;
    }

    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';
    
    gameRunning = true;
    animate(); // Começa o loop
}

function gameOver() {
    gameRunning = false;
    const name = document.getElementById('username').value;
    saveScore(name, Math.floor(score));
    alert(`GAME OVER! Pontuação: ${Math.floor(score)}`);
    location.reload(); // Reinicia o jogo
}

function animate() {
    if (!gameRunning) return; // TRAVA O JOGO SE NÃO CLICOU EM INICIAR

    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    score += delta * 10; // Pontos por tempo

    updateMovement();
    updateCamera();
    
    // Chama a função dos inimigos que está no outro arquivo
    updateEnemies(scene, player, delta);

    if (mixer && walkAction) {
        walkAction.paused = !isMoving;
        mixer.update(delta);
    }

    renderer.render(scene, camera);
    drawMinimap();
}