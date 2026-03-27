// Variáveis globais (para que outras funções acessem)
let gameStarted = false;
let playerName = "";

function startGame() {
    playerName = document.getElementById('username').value;

    if (playerName.length < 3) {
        alert("Escolha um nome de agente com pelo menos 3 letras!");
        return;
    }

    // 1. Esconde o menu e mostra a interface do jogo
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';

    // 2. Ativa a lógica do jogo
    gameStarted = true;
    
    // 3. Opcional: Bloquear o ponteiro do mouse para o jogo (melhora a experiência)
    document.body.requestPointerLock();
}

// No seu loop de animação (function animate), adicione uma trava:
function animate() {
    if (!gameStarted) return; // Se não clicou em iniciar, não processa nada

    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    updateMovement();
    updateCamera();
    
    // Se você já criou o arquivo enemies.js:
    if (typeof updateEnemies === "function") {
        updateEnemies(player.position);
    }

    if (mixer && walkAction) {
        walkAction.paused = !isMoving;
        if (isMoving) walkAction.setEffectiveTimeScale(currentSpeed * 2.0);
        mixer.update(delta);
    }

    renderer.render(scene, camera);
    drawMinimap();
}