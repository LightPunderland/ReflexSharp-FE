 const body = document.getElementById('main-container');

function loadSettings(){

    body.innerHTML =`
        <h1> HELLO WORLD <\h1>
    `;

    window.history.pushState({page: page}, '', `/settings`);
    goBack();
}

function loadLeaderboard(){

    window.history.pushState({page: page}, '', `/leaderboard`);
    goBack();
}

function loadProfile(){

    window.history.pushState({page: page}, '', `/profile`);
    goBack();
}

function loadCredits(){

    window.history.pushState({page: page}, '', `/credits`);
    goBack();
}

function goBack(){
     window.onpopstate = function(event) {
        if (event.state && event.state.page) {
            loadPage(event.state.page);
        } else {
             loadPage('home');
        }
    }
}