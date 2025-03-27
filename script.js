let time;
let questionNum;
let cash;
let cashlist = [10, 20, 50, 100];
let rand;

let docTimer;
let docQuestion;

window.onload = function()// This function is called when the page is loaded and sets everything up
{
  docTimer = document.getElementById("timer");
  docQuestion = document.getElementById("question");
  startGame();
}

function startGame()
{
  time = 0;
  questionNum = 0;
  docTimer.innerHTML = time;
  // document.getElementById("question").innerHTML = "Question " + (questionNum + 1);
  // document.getElementById("answer").innerHTML = "Answer";
  // document.getElementById("next").innerHTML = "Next";
  // document.getElementById("next").setAttribute("onclick", "nextQuestion()");
  
  //gets a random cash value from the array
  rand = Math.floor(Math.random() * 4);
  cash = cashlist[rand];
  console.log(cash);//testing
  
  populate();
  

  //sets the paragraph text to the question
  //docQuestion.innerHTML = questions.text()
  //starts the timer
  startTimer();

}

async function populate() 
{
  const questions = "questions.json";
  const request = new Request(requestURL);

  const response = await fetch(request);
  const superHeroes = await response.json();

  populate(superHeroes);//??????????????????????????????????????????????????
  populateHeroes(superHeroes);
}

// start a 60 second countdown timer
function startTimer() 
{
  setInterval(calculateTime, 1000);
}

//increments time and changes the inner html of docTimer to the current time, if the time is 60 or more the time is up
function calculateTime()
{
  time++;
  docTimer.innerHTML = time;

  if(time >= 60)
  {
    docTimer.innerHTML = "Time is up!";
  }


}