document.getElementById('play-button-action').addEventListener('click', function(){
    window.location.href = 'game/index.html';
});

document.getElementById('leaderboard-button-action').addEventListener('click', function(){
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('leaderboard-container').style.display = 'flex';
    document.querySelector('.back-arrow').style.display = 'block';
});

document.getElementById('settings-button-action').addEventListener('click', function(){
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('settings-container').style.display = 'flex';
    document.querySelector('.back-arrow').style.display = 'block';
});

document.getElementById('credits-button-action').addEventListener('click', function(){
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('credits-container').style.display = 'flex';
    document.querySelector('.back-arrow').style.display = 'block';
});

//only solution i could find that works for all go back arrows without making different ids for them all
document.querySelectorAll('.back-arrow').forEach(function(backwards) {
    backwards.addEventListener('click', function() {
        document.getElementById('main-menu').style.display = 'flex';
        document.getElementById('leaderboard-container').style.display = 'none';
        document.getElementById('settings-container').style.display = 'none';
        document.getElementById('credits-container').style.display = 'none';    
        this.style.display = 'none';
    });
});