// === VARIÁVEIS GLOBAIS ===
let scene, camera, renderer, player, clock, mixer;
let gameRunning = false;
let keys = {};

// === 1. SETUP INICIAL ===
function init() {
    // Criar a cena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333); // Fundo cinza escuro para teste
    
    clock = new THREE.Clock();

    // Câmera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 20, 30);

    // Renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // IMPORTANTE: Adiciona o canvas no início do body para não cobrir o HTML
    document.body.prepend(renderer.domElement); 

    // Luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    // Chão de Teste (Grid)
    const grid = new THREE.GridHelper(200, 20, 0xffffff, 0x444444);
    scene.add(grid);

    // Player Container
    player = new THREE.Group();
    player.position.set(0, 0, 0);
    scene.add(player);

    // Carregar Soldado
    const loader = new THREE.GLTFLoader();
    loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Soldier.glb', (gltf) => {
        const soldier = gltf.scene;
        soldier.scale.set(2, 2, 2);
        player.add(soldier);
        mixer = new THREE.AnimationMixer(soldier);
        console.log("Soldado carregado com sucesso!");
    }, undefined, (error) => {
        console.error("Erro ao carregar modelo:", error);
    });

    // Ajuste de Janela
    window.addEventListener('resize', onWindowResize);
}

// === 2. COMANDOS DO MENU ===
function startGame() {
    const user = document.getElementById('username').value;
    if (user.length < 2) return alert("Digite seu nome!");

    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';

    gameRunning = true;
    animate(); // Inicia o loop
    console.log("Jogo Iniciado!");
}

// === 3. LOOP DE ANIMAÇÃO ===
function animate() {
    if (!gameRunning) return;
    
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    // Movimentação Básica
    if (keys['w']) player.translateZ(0.5);
    if (keys['s']) player.translateZ(-0.3);
    if (keys['a']) player.rotation.y += 0.04;
    if (keys['d']) player.rotation.y -= 0.04;

    // Câmera segue o jogador
    const relativeCameraOffset = new THREE.Vector3(0, 15, -25);
    const cameraOffset = relativeCameraOffset.applyMatrix4(player.matrixWorld);
    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.position.z = cameraOffset.z;
    camera.lookAt(player.position.x, player.position.y + 5, player.position.z);

    // Update de sistemas externos
    if (mixer) mixer.update(delta);
    if (typeof updateEnemies === 'function') {
        updateEnemies(scene, player.position, delta, () => {
            gameRunning = false;
            alert("GAME OVER!");
            location.reload();
        });
    }

    renderer.render(scene, camera);
    if (typeof drawMinimap === 'function') drawMinimap();
}

// === AUXILIARES ===
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

// Inicializa a cena assim que o script carregar
init();