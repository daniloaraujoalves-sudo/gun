// enemies.js
let enemies = [];

function spawnEnemy(scene) {
    const geometry = new THREE.BoxGeometry(4, 10, 4);
    const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const enemy = new THREE.Mesh(geometry, material);
    
    // Spawn aleatório longe do player
    enemy.position.set(Math.random() * 400 - 200, 5, Math.random() * 400 - 200);
    scene.add(enemy);
    enemies.push(enemy);
}

function updateEnemies(playerPos) {
    const speed = 0.3;
    enemies.forEach(enemy => {
        // Direção para o player
        const dir = new THREE.Vector3().subVectors(playerPos, enemy.position).normalize();
        enemy.position.x += dir.x * speed;
        enemy.position.z += dir.z * speed;
        
        // Simples colisão (Game Over se encostar)
        if (enemy.position.distanceTo(playerPos) < 5) {
            alert("VOCÊ FOI PEGO!");
            location.reload();
        }
    });
}