let enemies = [];
let lastSpawn = 0;

function updateEnemies(scene, playerPos, delta, onCollision) {
    lastSpawn += delta;
    if (lastSpawn > 3) { // Spawna a cada 3 segundos
        const geo = new THREE.BoxGeometry(4, 8, 4);
        const mat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        const enemy = new THREE.Mesh(geo, mat);
        enemy.position.set(Math.random()*400-200, 4, Math.random()*400-200);
        scene.add(enemy);
        enemies.push(enemy);
        lastSpawn = 0;
    }

    enemies.forEach(en => {
        const dir = new THREE.Vector3().subVectors(playerPos, en.position).normalize();
        en.position.x += dir.x * 0.3;
        en.position.z += dir.z * 0.3;
        if (en.position.distanceTo(playerPos) < 5) onCollision();
    });
}