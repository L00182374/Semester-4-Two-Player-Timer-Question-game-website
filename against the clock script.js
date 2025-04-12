//project has to be run in live server for fetch to work

let time1;
let time2
let score1;
let score2;
let timeInput;
let questionCount;
let questionNum;
let questionsPicked;
let questions;
let answers;
let cash;
let cashlist = [10, 20, 50, 100];
let rand;
let timerInterval1;
let timerInterval2;
let docTimer1;
let docTimer2;
let docTimeDiv;
let docQuestion;
let button1, button2, button3, button4;  // allow the buttons to be accessed globally because I was having issues from declaring them in functions
let docQuestionDiv;
let docAnswersDiv;
let startButton;
let endButton;
let nextButton;
let docTimeInput;
let docP1;
let docP2
let docScore1;
let docScore2;
let docCash;
let docScoreInput;
let scoreInput;

window.onload = function()// This function is called when the page is loaded and sets everything up
{
  docTimer1 = document.getElementById("timer1");
  docTimer2 = document.getElementById("timer2");
  docQuestion = document.getElementById("question");
  startButton = document.getElementById("startButton");
  endButton = document.getElementById("endButton");
  nextButton = document.getElementById("nextButton");
  button1 = document.getElementById("button1");
  button2 = document.getElementById("button2");
  button3 = document.getElementById("button3");
  button4 = document.getElementById("button4");
  docTimeInput = document.getElementById("timeInput");
  docQuestionDiv = document.getElementById("questionDiv");
  docAnswersDiv = document.getElementById("answersDiv");
  docTimeDiv = document.getElementById("timeDiv");
  docQuestionDiv.style.display = "none";
  docAnswersDiv.style.display = "none";
  docP1 = document.getElementById("p1");
  docP2 = document.getElementById("p2");
  docScore1 = document.getElementById("score1");
  docScore2 = document.getElementById("score2");
  docCash = document.getElementById("cash");
  docScoreInput = document.getElementById("scoreInput");
  nextButton.style.display = "none";
  endButton.addEventListener("click", function() //reloads the page when the end button is clicked
  {
    location.reload();
  });
  startButton.addEventListener("click", startGame);
  nextButton.addEventListener("click", nextQuestion);
  button1.addEventListener("click", checkAnswer);
  button2.addEventListener("click", checkAnswer);
  button3.addEventListener("click", checkAnswer);
  button4.addEventListener("click", checkAnswer);
  docP1.style.display = "none";
  docP2.style.display = "none";

}

function startGame()
{
  docTimeDiv.style.display = "none";
  //docCash.style.display = "none";
  docQuestionDiv.style.display = "block";
  docAnswersDiv.style.display = "block";
  startButton.disabled = true;
  timeInput = docTimeInput.value || 60;//time can be set by the user or defaults to 60 if nothing entered
  docTimeInput.disabled = true;
  docTimeInput.style.display = "none";
  docP1.style.display = "block";
  docP2.style.display = "block";
  time1 = 0;
  time2 = 0;
  score1 = 0;
  score2 = 0;
  scoreInput = docScoreInput.value || 5; //score can be set by the user or defaults to 5 if nothing entered
  questionCount = 0;
  questionNum = 0;
  questionsPicked = [];
  docTimer1.innerHTML = time1;
  docTimer2.innerHTML = time2;
  
  //gets a random cash value from the array
  rand = Math.floor(Math.random() * 4);
  cash = cashlist[rand];
  console.log(cash);//testing
  docCash.innerHTML = "Prize Money: €" + cash;

  //calls the nextQuestion function to get the questions
  nextQuestion(); 
}

async function readJSON() //readJSON is an async function
{
  try 
  {
    const response = await fetch("questions.json");
    questions = await response.json();
    console.log("Questions Array:", questions);  // testing check the array in console
    
    //checks if the questionsPicked array is the same length as the questions array and if not sets the questionsPicked array to all 0's
    if (questionsPicked.length !== questions.length)
    {
      for (let i = 0; i < questions.length; i++) {
        questionsPicked.push(0);
      }
    }

    questionNum = Math.floor(Math.random() * questions.length);  //randomises questionNum
    
    if (questionsPicked.includes(0) == false) 
      {
        docQuestion.textContent = "No more questions available";  //if all questions have been picked it will display this message
        disableButtons();
        return;
      }

    while (questionsPicked[questionNum] == 1) //makes sure there are no repeat questions
    {
      questionNum = Math.floor(Math.random() * questions.length); 
    }

    docQuestion.textContent = questions[questionNum].question;//uses the randomised questionNum to select the question from the array
    questionsPicked[questionNum] = 1;  //sets the question to picked so it won't be repeated

    answers = questions[questionNum].answers;  //gets the answers for the question
    console.log("Answers Array:", answers);  // testing check the array in console

    button1.textContent = answers[0];//sets each button to an answer
    button2.textContent = answers[1];
    button3.textContent = answers[2];
    button4.textContent = answers[3];
  } 
  
  catch (error) //if anything goes wrong display and error message
  {
    console.error("Error fetching questions:", error);
    docQuestion.textContent = "Failed to load question.";
  }
}

function nextQuestion()//function to get the next question
{
  enableButtons();
  nextButton.disabled = true;//hides the next button until checkAnswer is called
  nextButton.style.display = "none";
  //increment question count before the player logic is calculated in order to ensure that questioncount = 1 which will give 1 when 1%2 is gotten
  questionCount++;
  readJSON();
  
  //if the question number is odd start timer 1 else start timer 2
  if(questionCount % 2 == 1)
  {
    startTimer1();
    docP1.style.backgroundColor = "lightseagreen";
    docP1.style.border = "1px solid black";
    docP2.style.border = "none";
    docP2.style.backgroundColor = "rgb(245, 242, 242)";
  }

  else
  {
    startTimer2();
    docP2.style.backgroundColor = "lightseagreen";
    docP2.style.border = "1px solid black";
    docP1.style.border = "none";
    docP1.style.backgroundColor = "rgb(245, 242, 242)";
  }
}

function checkAnswer()//called when an answer button is clicked
{
  disableButtons();
  nextButton.style.display = "block"//shows the next button
  nextButton.disabled = false;
  let buttonAnswer = this.textContent;  //this means the button that was clicked

  if(questionCount % 2 == 1)//if player 1 answered stop their timer else stop player 2s timer
  {
    clearInterval(timerInterval1);
  }
  
  else
  {
    clearInterval(timerInterval2);
  }

  //checks if the answer is correct by comparing the button text to the correct answer in the array
  if (buttonAnswer == questions[questionNum].answers[questions[questionNum].correct])  
  {
    docQuestion.textContent = "Correct!";
    
    if(questionCount % 2 == 1)//if player 1 answered correctly 
    {
      score1++;
      docScore1.innerHTML = "Score: " + score1;
    }

    else // if player 2 answered correctly
    {
      score2++;
      docScore2.innerHTML = "Score: " + score2;
    }
  } 
  
  else 
  {
    docQuestion.textContent = "Incorrect!";
    // if(questionCount % 2 == 1)
    // {
    //   score1--;
    //   docScore1.innerHTML = score1;
    // }

    // else
    // {
    //   score2--;
    //   docScore2.innerHTML = score2;
    // }
  }

  //I know it is supposed to be based off of which player answered the desired number of questions the quickest but I didn't get the time to change the game logic to that
  if(scoreInput <= score1)//I interpreted the rules as the player who gets to the set score first wins so I check if the score is greater than or equal to the score input
  { 
    docQuestion.textContent = "Player 1 has won the game!";
    score1 = cash*(timeInput - time1);//60 - time1 to make sure the score is correct as I am counting up instead of down
    docCash.style.display = "block";
    docCash.innerHTML = "Player 1 Winnings: €" + score1;
    nextButton.style.display = "none";
    return;
  }

  if(scoreInput <= score2)
  { 
    docQuestion.textContent = "Player 2 has won the game!";
    score2 = cash*(timeInput - time2);
    docCash.style.display = "block";
    docCash.innerHTML = "Player 2 Winnings: €" + score2;
    nextButton.style.display = "none";
    return;
  }

  nextButton.disabled = false;
  nextButton.style.display = "block";
}

// start a 60 second countdown timer
function startTimer1() 
{
  timerInterval1 = setInterval(calculateTime1, 1000);
}

function startTimer2() 
{
  timerInterval2 = setInterval(calculateTime2, 1000);
}

//increments time and changes the inner html of docTimer to the current time, if the time is 60 or more the time is up
function calculateTime1()
{
  time1++;
  // If time is less than the time input display the time
  if (time1 < timeInput) 
  {
    docTimer1.innerHTML = "Time: " + time1;
  } 
  
  else 
  {
    // when time gets to the time input display message and stop the timer so it doesn't constantly set the inner html over and over
    docTimer1.innerHTML = "Time is up!";
    docQuestion.textContent = "Time is up! No one wins!";
    clearInterval(timerInterval1);
    disableButtons();
  }

}

function calculateTime2()
{
  time2++;
  // If time is less than 60 seconds display the time
  if (time2 < timeInput) 
  {
    docTimer2.innerHTML = "Time: " + time2;
  } 
  
  else 
  {
    // when time gets to 60 seconds display message and stop the timer so it doesn't constantly set the inner html over and over
    docTimer2.innerHTML = "Time is up!";
    docQuestion.textContent = "Time is up! No one wins!";
    clearInterval(timerInterval2);
    disableButtons();
  }

}


function disableButtons()
{
  button1.disabled = true;
  button2.disabled = true;
  button3.disabled = true;
  button4.disabled = true;
}

function enableButtons()
{
  button1.disabled = false;
  button2.disabled = false;
  button3.disabled = false;
  button4.disabled = false;
}

//problems encountered 
//1.NOT the time would not go down if questions were answered quick enough. I found out it was an issue with set interval and needed to use date.now instead for time logic although I didn't get enough time to implement it as it wasn't a very important bug
//2.FIXED I was re initialising the questions picked array every question so I needed to change the logic to initialise it once at the start only
//3.FIXED I needed to increment the question count before the player turn logic as I was struggling to get that to make sure player one started first
//4.NOT I keep having issues with the answers box not staying in a 2x2 grid although it was usually due to the next button appearing so I adjusted the layout of the webpage to fix it although it still happens if the page is not fullscreen and I'm not sure how to fix it although I'm pretty sure it's a css issue
//5.FIXED at the start I did not realise I had to use live server for fetch to work so the code wasn't working correctly until I started using it
//6.FIXED I wasn't counting the score so I couldn't let the user enter their custon value for the amount of questions so I had to implement that.
//7.FIXED the final cash value wasn't being calculated correctly as I was counting up instead of down. I was using the time value so instead I changed it to timeinput - time to get the score
