let modalBtn = document.querySelector('.modal-btn');
let modalBtnStatistics = document.querySelector('.modal-btn-statistics');
let modalBg = document.querySelector('.modal-bg');
let modalWin = document.querySelector('.modal-win');
let modalBgStat = document.querySelector('.modal-bg-stat');
let modalClose = document.querySelector('.modal-close');
let modalCloseStat = document.querySelector('.modal-close-stat');
let modalCloseWinner = document.querySelector('.modal-close-winner');
let whatsappBtn = document.querySelector('.whatsapp-btn');


// // if (zoom > 125 ) {
//     window.addEventListener('keydown', function (e) {
//         let zoom = Math.round(window.devicePixelRatio * 100) -25;
//         if (zoom <= 80 || zoom >= 125){
//             if ((e.ctrlKey || e.metaKey) && (e.which === 61 || e.which === 107 || e.which === 173 || e.which === 109 || e.which === 187 || e.which === 189)) {
//                 e.preventDefault();
//             }
//             return false;
//         }
//     }, false);
//
//     const handleWheel = function(e) {
//         let zoom = Math.round(window.devicePixelRatio * 100) -25;
//         if (zoom <= 80 || zoom >= 110 ){
//             if(e.ctrlKey || e.metaKey){
//                 e.preventDefault();
//             }
//             return true;
//         }
//         console.log(zoom)
//
//     };
//     window.addEventListener("wheel", handleWheel, {passive: false});
//
// // }

function updateStatsModal(){
    const currentStreak = window.localStorage.getItem("currentStreak") || 0;
    const totalWins = window.localStorage.getItem("totalWins") || 0;
    const totalGames = window.localStorage.getItem("totalGames") || 0;

    document.getElementById("total-played").textContent = totalGames;
    document.getElementById("total-wins").textContent = totalWins;
    document.getElementById("current-streak").textContent = currentStreak;

    const winPct = Math.round((totalWins / totalGames) * 100) || 0;
    document.getElementById("win-pct").textContent = winPct + '%';





    let fullTime = parseInt(sessionStorage.getItem('gameTime')) + 86400000;
    let timeLeft = fullTime - Date.now();

    function convertMS(ms) {
        var d, h, m, s;
        s = Math.floor(ms / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        d = Math.floor(h / 24);
        h = h % 24;
        h += d * 24;
        return h + ':' + m + ':' + s;
    }

    if (window.localStorage.getItem("totalGames")){
        document.querySelector('.timeLeft').innerHTML ="سوف تكون الكلمة التالية متاحة بعد : "    ;
        document.querySelector('.timeL').innerHTML = convertMS(timeLeft);
    }

}

/******** MODAL INFO GAME ******/
modalBtn.addEventListener('click', function(){
    modalBg.classList.add('bg-active');
});

modalBtnStatistics.addEventListener('click', function(){
    updateStatsModal();
    modalBgStat.classList.add('bg-active');
});
/******** MODAL STATISTICS ******/


modalClose.addEventListener('click', function(){
    modalBg.classList.remove('bg-active');
});

modalCloseStat.addEventListener('click', function(){
    modalBgStat.classList.remove('bg-active');
});

modalCloseWinner.addEventListener('click', function(){
    modalWin.classList.remove('bg-active');
});


document.addEventListener("DOMContentLoaded", () => {
    createSquares();
    getNewWord();

    let guessedWords = [[]];
    let availableSpace = 1;

    let word;
    let guessedWordCount = 0;
    let isGameOver = false;

    const keys = document.querySelectorAll(".keyboard-row button");

    function getNewWord() {

            fetch('./dayWord.json')
            .then((response) => {
                return response.json();
            })
            .then((res) => {
                data = res.words;

                words = data.map( e => {
                    return e.name;
                });

                word = words[Math.floor(Math.random() * data.length)]
            })
            .catch((err) => {
                console.error(err);
            });

    }

    function getCurrentWordArr() {
        var numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    }

/*************** window Key ************/
    window.addEventListener('keydown', function(e) {

        for(let i = 0; i < keys.length; i++) {
            if(e.key == keys[i].getAttribute('keyname' )) {
                const letter = e.key;
                updateGuessedWords(letter);
            }
        }

    })

    window.addEventListener('keydown', function(e) {
        for(let i = 0; i < keys.length; i++) {
            if(e.key == keys[i].getAttribute('keyname' )) {
                keys[i].classList.add('active')
            }
            if(e.code == 'Backspace') {
                backSpace.classList.add('active')
                handleDeleteLetter();
                return;
            }

            if(e.key == 'Enter') {
                enterKey.classList.add('active')
                handleSubmitWord();
                return;
            }
        }
    })
/*************************************/

    function updateGuessedWords(letter) {
        var currentWordArr = getCurrentWordArr();

        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(String(availableSpace));

            availableSpace = availableSpace + 1;
            availableSpaceEl.textContent = letter;
        }

    }

    function getTileColor(letter, index) {
        const isCorrectLetter = word.includes(letter);

        if (!isCorrectLetter) {
            return "rgb(112, 128, 144)";
        }

        const letterInThatPosition = word.charAt(index);
        const isCorrectPosition = letter === letterInThatPosition;

        if (isCorrectPosition) {
            return "rgb(10, 180, 100)";
        }

        return "rgb(250, 112, 20)";
    }

    function updateTotalGames() {
        const totalGames = window.localStorage.getItem("totalGames") || 0;
        window.localStorage.setItem("totalGames", Number(totalGames) + 1);
    }

    function showResult() {
        const totalWins = window.localStorage.getItem("totalWins") || 0;
        window.localStorage.setItem("totalWins", Number(totalWins) + 1);

        const currentStreak = window.localStorage.getItem("currentStreak") || 0;
        window.localStorage.setItem("currentStreak", Number(currentStreak) + 1);
    }

    if ( Date.now() - sessionStorage.getItem('gameTime') > 86400000 ){
        sessionStorage.removeItem('gameFin')
    }

    let tab = [];
    let lastRow = "";
    let tabMinusOne = [];

    function handleSubmitWord() {
        var alertFin = document.querySelector('.alertFin')
        alertFin.style.display = "none";

            if(!isGameOver && sessionStorage.getItem('gameFin') !== 'fin' ){

                const currentWordArr = getCurrentWordArr();

                if (currentWordArr.length !== 5) {
                    let element = document.querySelector('.alertMessage')
                    // element.classList.add("alert-info");
                    element.style.backgroundColor = "#72CB35";
                    element.style.visibility = "visible";
                    element.style.opacity = "1";
                    element.style.display = "block";

                    element.innerHTML = "يجب أن تتكون الكلمة من 5 أحرف"

                    return
                }
                setTimeout(()=>{
                    document.querySelector('.alertMessage').style.display = "hidden";
                    document.querySelector('.alertMessage').style.transition= "opacity 0.8s ease-out";
                    document.querySelector('.alertMessage').style.opacity = "0";
                },5000)


                tab.push(currentWordArr.join(''))

                const currentWord = currentWordArr.join("");


                fetch(`./js/data.json?${currentWord}`)
                    .then((res) => {
                        return res.json()
                    }).then((data)=>{

                    keyWord = data.words.filter((n) => { return n.name === currentWord })



                    tabMinusOne = tab.slice(0, -1);

                    if (guessedWords.length > 1 ){
                        lastRow = guessedWords[ guessedWords.length - 1 ].join('')
                    }

                    if ( keyWord.length === 0 || tabMinusOne.includes(lastRow) ) {
                        throw Error();
                    }


                    const firstLetterId = guessedWordCount * 5 + 1;
                    const interval = 200;
                    currentWordArr.forEach((letter, index) => {
                        setTimeout(() => {
                            const tileColor = getTileColor(letter, index);

                            const letterId = firstLetterId + index;
                            const letterEl = document.getElementById(letterId);
                            letterEl.classList.add("animate__flipInX");
                            letterEl.style = `background-color:${tileColor}`;

                            const keyboardEl = document.querySelector(`[data-key=${letter}]`);

                            keyboardEl.classList.add("animate__flipInX");
                            keyboardEl.style = `background-color:${tileColor}`;

                        }, interval * index);
                    });

                    guessedWordCount += 1;

                    if (currentWord === word) {

                        if (!sessionStorage.getItem('gameFin')){

                            sessionStorage.setItem('gameFin', 'fin');
                        }
                        let gameTime = Date.now();
                        sessionStorage.setItem('gameTime',gameTime);

                        setTimeout(()=>{
                            modalWin.classList.add('bg-active');
                            whatsappBtn.classList.add('bg-active');
                            whatsappBtn.style.setProperty('display', 'block', 'important');

                            let enterBtn = document.querySelector('.enter-btn')
                            enterBtn.style.visibility = "hidden";
                            enterBtn.style.opacity = "0";
                            enterBtn.style.display = "none";

                        },1400 )



                        // var element = document.querySelector('.alert')
                        // element.classList.add("alert-success");
                        // element.style.visibility = "visible";
                        // element.style.opacity = "1";
                        //
                        // element.innerHTML = "تهانينا!";

                        var element = "ok";
                        if(element){
                            showResult();
                            updateTotalGames();
                        }
                        isGameOver= true;
                        return
                    }

                    if (guessedWords.length === 5) {
                        if (!sessionStorage.getItem('gameFin')){

                            sessionStorage.setItem('gameFin', 'fin');
                        }

                        let gameTime = Date.now();
                        sessionStorage.setItem('gameTime', gameTime );

                        var alertMessage = document.querySelector('.alertMessage')
                        alertMessage.style.display = "none";

                        var element = document.querySelector('.alertFin')
                        // element.classList.add("alert-dark");
                        element.style.backgroundColor = "#BDC3C7";
                        element.style.color = "#E74C3C";
                        element.style.visibility = "visible";
                        element.style.opacity = "1";
                        element.style.display = "block";


                        element.innerHTML = `آسف ، ليس لديك المزيد من التخمينات! الكلمةهي : ${word}`;
                        // element.innerHTML = `آسف ، ليس لديك المزيد من التخمينات! الكلمةهي : <div class="font-weight-bold text-danger ">${word}</div>`;

                        if(element){
                            updateTotalGames();
                            window.localStorage.setItem("currentStreak", 0);
                        }

                        isGameOver= true;
                        return
                    }

                    guessedWords.push([]);
                }).catch(() => {
                    let element = document.querySelector('.alertMessage')
                    // element.classList.add("alert-danger");
                    element.style.backgroundColor = "#E74624";
                    element.style.visibility = "visible";
                    element.style.opacity = "1";
                    element.style.display = "block";

                    element.innerHTML = "لم يتم التعرف على الكلمة !"
            })
            }else {
                let element = document.querySelector('.alertMessage')
                // element.classList.add("alert-warning");
                element.style.backgroundColor = "#D68910";
                element.style.visibility = "visible";
                element.style.opacity = "1";
                element.style.display = "block";
                element.innerHTML = "لغز واحد فقط في اليوم !"
            }


        }


    setTimeout(()=>{
        document.querySelector('.alertMessage').style.display = "hidden";
        document.querySelector('.alertMessage').style.opacity = "0";
        document.querySelector('.alertMessage').style.transition= "opacity 0.8s ease-out";
    },5000)



    function createSquares() {
        const gameBoard = document.getElementById("board");

        for (let index = 0; index < 25; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);

        }

    }

    function handleDeleteLetter() {
        const currentWordArr = getCurrentWordArr();

        if (!currentWordArr.length) {
            return;
        }

        currentWordArr.pop();

        guessedWords[guessedWords.length - 1] = currentWordArr;

        const lastLetterEl = document.getElementById(availableSpace - 1);

        lastLetterEl.innerHTML = "";
        availableSpace = availableSpace - 1;
    }

    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");

            if (letter === "enter" || letter === "v-btn" ) {
                handleSubmitWord();
                return;
            }

            if (letter === "del") {
                handleDeleteLetter();
                return;
            }

            updateGuessedWords(letter);
        };
    }
});







let keys = document.querySelectorAll('.keys');
let backSpace = document.querySelector('.back_space');
let enterKey = document.querySelector('.enter_key');

for(let i = 0; i < keys.length; i++) {
    keys[i].setAttribute('keyname', keys[i].innerText);
}


window.addEventListener('keyup', function(e) {
    for(let i = 0; i < keys.length; i++) {
        if(e.key == keys[i].getAttribute('keyname' )) {
            keys[i].classList.remove('active')
            keys[i].classList.add('remove')
        }

        if(e.code == 'Backspace') {
            backSpace.classList.remove('active');
            backSpace.classList.add('remove');
        }

        if(e.key == 'Enter') {
            enterKey.classList.remove('active');
            enterKey.classList.add('remove');
        }

        setTimeout(()=> {
            keys[i].classList.remove('remove')
        },200)
    }
})




let layerShape1 = document.querySelector('.shapes1');



layerShape1.addEventListener("mousemove", parallax);
function parallax(e){
    // console.log('1')
    this.querySelectorAll('.layer').forEach (layer => {

        // const speed = layer.getAttribute('data-speed')
        const position = layer.getBoundingClientRect();
        const x = e.pageX - position.left - position.width / 2;
        const y = e.pageY - position.top - position.height / 2;
        // const x = (window.innerWidth - e.pageX*speed)/100
        // const y = (window.innerHeight - e.pageY*speed)/100
        // layer.style.transform = `translateX(${x}px) translateY(${y}px)`
        layer.style.transform =  "translate(" + y * 0.5 +"px, "+ x * 0.5 + "px)";
    })
}


let layerShape2 = document.querySelector('.shapes2');



layerShape2.addEventListener("mousemove", parallax);
function parallax(e){
    // console.log('1')
    this.querySelectorAll('.layer').forEach (layer => {

        const speed = layer.getAttribute('data-speed')
        const position = layer.getBoundingClientRect();
        const x = e.pageX*speed - position.left - position.width / 2;
        const y = e.pageY*speed - position.top - position.height / 2;
        // const x = (window.innerWidth - e.pageX*speed)/100
        // const y = (window.innerHeight - e.pageY*speed)/100
        // layer.style.transform = `translateX(${x}px) translateY(${y}px)`
        layer.style.transform =  "translate(" + y * 0.5 +"px, "+ x * 0.5 + "px)";
    })
}


let layerShape3 = document.querySelector('.shapes3');



layerShape3.addEventListener("mousemove", parallax);
function parallax(e){
    // console.log('1')
    this.querySelectorAll('.layer').forEach (layer => {

        // const speed = layer.getAttribute('data-speed')
        const position = layer.getBoundingClientRect();
        const x = e.pageX - position.left - position.width / 2;
        const y = e.pageY - position.top - position.height / 2;
        // const x = (window.innerWidth - e.pageX*speed)/100
        // const y = (window.innerHeight - e.pageY*speed)/100
        // layer.style.transform = `translateX(${x}px) translateY(${y}px)`
        layer.style.transform =  "translate(" + y * 0.5 +"px, "+ x * 0.5 + "px)";
    })
}










