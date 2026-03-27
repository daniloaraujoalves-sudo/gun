function saveScore(name, score) {
    let ranking = JSON.parse(localStorage.getItem('gameRank') || "[]");
    ranking.push({ name, score });
    ranking.sort((a, b) => b.score - a.score);
    localStorage.setItem('gameRank', JSON.stringify(ranking.slice(0, 5)));
}

function showRank() {
    const container = document.getElementById('rank-list');
    let ranking = JSON.parse(localStorage.getItem('gameRank') || "[]");
    container.innerHTML = ranking.map((r, i) => `<p>${i+1}. ${r.name} - ${r.score}s</p>`).join('');
    document.getElementById('rank-screen').style.display = 'flex';
}

function hideRank() {
    document.getElementById('rank-screen').style.display = 'none';
}