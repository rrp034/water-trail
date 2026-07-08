const menu = document.getElementById("main-menu");
const game = document.getElementById("game-screen");

const playBtn = document.getElementById("playBtn");
const exitBtn = document.getElementById("exitBtn");

let eventsRemaining = [];
let score = 0;
let distance = 0;

playBtn.addEventListener("click", startGame);

const storyTitle = document.querySelector("#story-box h2");
const storyText = document.getElementById("story-text");
const eventImage = document.getElementById("event-image");

const choiceA = document.getElementById("choiceA");
const choiceB = document.getElementById("choiceB");

const scoreDisplay = document.getElementById("scoreValue");

const truck = document.getElementById("truck");

const progressFill = document.getElementById("progressFill");

const timerDisplay = document.getElementById("time");

let timer;

let timeRemaining = 900; // 15 minutes

const endScreen = document.getElementById("end-screen");

const endTitle = document.getElementById("endTitle");
const endImage = document.getElementById("end-image");

const finalScore = document.getElementById("finalScore");

const playerName = document.getElementById("playerName");

const saveScoreBtn = document.getElementById("saveScoreBtn");

const playAgainBtn = document.getElementById("playAgainBtn");

const menuBtn = document.getElementById("menuBtn");

function startGame(){

    clearInterval(timer);

    menu.classList.add("hidden");
    game.classList.remove("hidden");
    endScreen.classList.add("hidden");

    distance = 0;
    score = 0;
    timeRemaining = 900;
    playerName.value = "";

    shuffleEvents();

    scoreDisplay.textContent = score;

    progressFill.style.width = "0%";

    truck.style.left = "20px";

    updateTimerDisplay();

    loadEvent();

    startTimer();

}

exitBtn.addEventListener("click", function(){

    let leave = confirm("Are you sure you want to quit?");

    if(leave){

        window.close();

    }

});

const events = [
{
    title: "Boulder Ahead",
    text: "A giant boulder blocks the road.",
    optionA: "Go Around (Lose 5 Minutes)",
    optionB: "Drive Over It (25% Risk)",
    scoreSafe: 10,
    scoreRisk: 20,
    risk: 0.25,
    image: "img/boulder.png"
},
{
    title: "Flooded Road",
    text: "The road is underwater.",
    optionA: "Take a Detour (Lose 5 Minutes)",
    optionB: "Drive Through (35% Risk)",
    scoreSafe: 15,
    scoreRisk: 30,
    risk: 0.35,
    image: "img/flooded-road.jpg"
},
{
    title: "Broken Bridge",
    text: "The bridge looks unstable.",
    optionA: "Find Another Crossing (Lose 5 Minutes)",
    optionB: "Cross the Bridge (30% Risk)",
    scoreSafe: 15,
    scoreRisk: 30,
    risk: 0.30,
    image: "img/broken-bridge.jpg"
},
{
    title: "Fallen Tree",
    text: "A large tree has crashed across the road and is blocking your path.",
    optionA: "Clear a Safe Path (Lose 5 Minutes)",
    optionB: "Squeeze Past Quickly (20% Risk)",
    scoreSafe: 20,
    scoreRisk: 35,
    risk: 0.20,
    image: "img/fallen-tree.jpg"
}
];



let currentEvent;

function loadEvent(){

    if(eventsRemaining.length===0){

        return;

    }

    currentEvent = eventsRemaining.pop();

    storyTitle.textContent=currentEvent.title;

    storyText.textContent=currentEvent.text;

    eventImage.src = currentEvent.image;
    eventImage.alt = currentEvent.title;

    choiceA.textContent=currentEvent.optionA;

    choiceB.textContent=currentEvent.optionB;

}

choiceA.addEventListener("click", () => makeChoice("A"));
choiceB.addEventListener("click", () => makeChoice("B"));



function nextEvent(){

    currentEvent++;

    scoreDisplay.textContent = score;

    // Calculate progress
    let percent = (currentEvent / events.length) * 100;

    progressFill.style.width = percent + "%";

    // Move truck
    let roadWidth = 700;

    truck.style.left = (percent / 100) * roadWidth + "px";

    if(currentEvent >= events.length){

        clearInterval(timer);

        gameWin();

        return;

    }

    loadEvent();

}


function startTimer() {

    timer = setInterval(function () {

        timeRemaining--;

        updateTimerDisplay();

        if (timeRemaining <= 0) {

            clearInterval(timer);

            gameOver("You ran out of time.");

        }

    }, 1000);

}

function showEndScreen(title, message, backgroundColor, imageSrc) {

    endScreen.style.background = backgroundColor;

    clearInterval(timer);

    game.classList.add("hidden");
    menu.classList.add("hidden");
    endScreen.classList.remove("hidden");

    endTitle.textContent = title;

    document.getElementById("endMessage").textContent = message;

    finalScore.textContent = score;

    endImage.src = imageSrc;
    endImage.alt = title;

}

function gameWin(){

    showEndScreen(
        "🎉 You Found Clean Water!",
        "Congratulations! You completed your journey.",
        "#e8ffe8",
        "img/you-win.jpg"
    );

}

function gameOver(reason) {

    showEndScreen(
        "💀 Game Over",
        reason,
        "#ffe6e6",
        "img/car-breaks-down.jpg"
    );
}

playAgainBtn.addEventListener("click", function(){

    endScreen.classList.add("hidden");

    startGame();

});

menuBtn.addEventListener("click", function(){

    endScreen.classList.add("hidden");
    game.classList.add("hidden");

    menu.classList.remove("hidden");

});

function saveScore(){

    let name = playerName.value.trim();

    if(name === ""){

        name = "Anonymous";

    }

    let scores = JSON.parse(localStorage.getItem("waterTrailScores")) || [];

    scores.push({

        name:name,

        score:score

    });

    scores.sort((a,b)=>b.score-a.score);

    scores = scores.slice(0,5);

    localStorage.setItem("waterTrailScores",JSON.stringify(scores));

    loadLeaderboard();

}

function loadLeaderboard(){

    const scoreList = document.getElementById("scoreList");

    scoreList.innerHTML="";

    let scores = JSON.parse(localStorage.getItem("waterTrailScores")) || [];

    if(scores.length===0){

        scoreList.innerHTML="<li>No Scores Yet</li>";

        return;

    }

    scores.forEach(player=>{

        let li=document.createElement("li");

        li.textContent=`${player.name} - ${player.score}`;

        scoreList.appendChild(li);

    });

}

saveScoreBtn.addEventListener("click",function(){

    saveScore();

    alert("Score Saved!");

});
loadLeaderboard();

function shuffleEvents(){

    eventsRemaining = [...events];

    for(let i = eventsRemaining.length-1; i>0; i--){

        let j = Math.floor(Math.random()*(i+1));

        [eventsRemaining[i],eventsRemaining[j]] =
        [eventsRemaining[j],eventsRemaining[i]];
    }

}

function moveTruck(){

    let percent=(distance / events.length) * 100;

    progressFill.style.width=percent+"%";

    truck.style.left=(percent*7)+"px";

}

function makeChoice(choice) {

    if (choice === "A") {

        // Lose 5 minutes
        timeRemaining -= 300;

        if (timeRemaining < 0) {
            timeRemaining = 0;
        }

        score += currentEvent.scoreSafe;

    } else {

        score += currentEvent.scoreRisk;

        if (Math.random() < currentEvent.risk) {

            gameOver("Your truck broke down!");

            return;

        }

    }

    scoreDisplay.textContent = score;

    updateTimerDisplay();

    distance++;

    moveTruck();

    if (distance >= events.length) {

        gameWin();

        return;

    }

    loadEvent();

}

function updateTimerDisplay() {

    let minutes = Math.floor(timeRemaining / 60);
    let seconds = timeRemaining % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");

}