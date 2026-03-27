let scene, camera, renderer, player, clock, mixer, walkAction;
let gameRunning = false;
let isMoving = false;
let keys = {};

// Setup inicial (ocorre ao carregar a página, mas não renderiza)
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x88aaff);
    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Luzes
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Chão
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshLambertMaterial({ color: 0x448844 }));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Player (Container)
    player = new THREE.Group();
    scene.add(player);

    // Modelo do Soldado
    const loader = new THREE.GLTFLoader();
    loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Soldier.glb', (gltf) => {
        const soldier = gltf.scene;
        soldier.scale.set(2, 2, 2);
        player.add(soldier);
        mixer = new THREE.AnimationMixer(soldier);
        walkAction = mixer.clipAction(gltf.animations[1]);
    });
}

function startGame() {
    const user = document.getElementById('username').value;
    if(!user) return alert("Digite seu nome!");
    
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';
    
    gameRunning = true;
    animate();
}

function animate() {
    if (!gameRunning) return;
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    // Movimentação Simples
    if (keys['w']) player.translateZ(0.8);
    if (keys['s']) player.translateZ(-0.4);
    if (keys['a']) player.rotation.y += 0.05;
    if (keys['d']) player.rotation.y -= 0.05;

    // Câmera segue player
    const camOffset = new THREE.Vector3(0, 15, -30).applyQuaternion(player.quaternion);
    camera.position.copy(player.position).add(camOffset);
    camera.lookAt(player.position);

    if (mixer) mixer.update(delta);
    
    updateEnemies(scene, player.position, delta, () => {
        alert("GAME OVER");
        saveScore(document.getElementById('username').value, Math.floor(performance.now()/1000));
        location.reload();
    });

    renderer.render(scene, camera);
}

window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
window.onload = init; // Inicia o setup mas não o loop