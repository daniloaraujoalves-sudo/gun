// rank.js
function saveScore(name, kills) {
    let rawData = localStorage.getItem('gameRank') || "[]";
    let scores = JSON.parse(rawData);
    scores.push({ name, kills });
    scores.sort((a, b) => b.kills - a.kills);
    localStorage.setItem('gameRank', JSON.stringify(scores.slice(0, 5))); // Salva os top 5
}

function showRank() {
    const list = document.getElementById('rank-list');
    list.innerHTML = "";
    let scores = JSON.parse(localStorage.getItem('gameRank') || "[]");
    scores.forEach(s => {
        list.innerHTML += `<li>${s.name}: ${s.kills} Kills</li>`;
    });
    document.getElementById('rank-screen').style.display = 'flex';
}

function hideRank() {
    document.getElementById('rank-screen').style.display = 'none';
}