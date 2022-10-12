// Selects elements by class
var timeEl = document.querySelector(".time");
var startBtn = document.querySelector("#start-btn");
var startconEl = document.querySelector(".start-container");
var containerEl = document.querySelector(".container");
var questcontainerEl = document.querySelector(".question-container");
var secondsLeft = 100;
var questionEl = document.querySelector("#question-header");
var answerBtnEl = document.querySelector("#answer-buttons");
var confirmEl = document.querySelector(".rightwrong")
var correctEl = document.querySelector("#correct");
var wrongEl = document.querySelector("#wrong");
var scoreCount = 0;
var scoreEl = document.querySelector(".score");
var timeoutEl = document.querySelector(".timeout");
var highscoreBtn = document.querySelector("#high-score");
var timeInterval // create the timerInterval so it's globally defined instead of locally
var scoreannEl = document.querySelector(".score-ann");
var highsubBtn = document.querySelector("#high-submit");
var highscpgEl = document.querySelector(".high-score-page");
var backBtn = document.querySelector("#go-back");
var iniInput = document.querySelector("#initials");
var clearhighBtn = document.querySelector("#clear-high");
var backtime = document.querySelector("#go-back-time");

// time counting down function
function timer() {
    timerInterval = setInterval(function() {
        secondsLeft--;
        timeEl.textContent = "Time: " + secondsLeft;
        // if statements will be needed when an answer is wrong
        // time will needed to be taken away
        if (secondsLeft === 0) {
            clearInterval(timerInterval);
            timeEl.textContent = "Time: 0";
            containerEl.classList.add("hide");
            confirmEl.classList.add("hide");
            timeoutEl.classList.remove("hide");
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timeEl.textContent = "Time: 0";
}

startBtn.addEventListener("click", startQuiz);
function startQuiz() {
    timer();
    startconEl.classList.add("hide"); // Once the quiz starts, the start menu will disappear -> display: none;
    questcontainerEl.classList.remove("hide");
    containerEl.classList.remove("hide");
    index = 0;
    setNextQuestion();
}

function setNextQuestion() {
    resetQuestion(); // function is made
    showQuestion(questions[index]);
}

function showQuestion(question) {
    questionEl.innerText = question.question; // takes the question from showQuestion input then adds the property .question which shows up as the question in our quiz
    question.answers.forEach(answer => { // question.answers refers to the answers property for the currently indexed question
        var button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("ansbtn");
        if (answer.correct) {
            button.dataset.correct = answer.correct // HTML shows it as data-correct="true" so we added a data-set, not a class
        } else {
            button.dataset.correct = "false";
        }
        button.addEventListener("click", selectAnswer)
        answerBtnEl.appendChild(button)
    })
}

function resetQuestion() { // reset the question to get rid of filler answers then populate with actual answers
        confirmEl.classList.add("hide");
        correctEl.classList.add("hide");
        confirmEl.classList.add("hide");
        wrongEl.classList.add("hide");
    while (answerBtnEl.firstChild) { // Before appending the other answer choices, this will remove all children until none are left
        answerBtnEl.removeChild(answerBtnEl.firstChild);
    }

}

function selectAnswer(e) { // using an event to target that specific button to check it's class
    var selectedBtn = e.target;
    var correct = selectedBtn.dataset.correct
    // setStatusClass(document.body, correct)
    if (correct == "true") { // conditional for when questions are answered right or wrong
        console.log("Correct");
        confirmEl.classList.remove("hide");
        correctEl.classList.remove("hide");
        scoreCount++;
    } else if (correct == "false") {
        console.log("Wrong")
        confirmEl.classList.remove("hide");
        wrongEl.classList.remove("hide");
        secondsLeft -= 15; // subtract time away if answered wrong
    }
    index++;
    if (index < questions.length) { // conditional to check whether or not the quiz is over based off index 
        setTimeout(() => { setNextQuestion(); }, 1500); //set a delay between going to the next
    } else {
        stopTimer();
        setTimeout(() => {containerEl.classList.add("hide"); resetQuestion(); inputScore(); }, 1500); // setting a delay after the last question is answered
    }
} 

function inputScore () { // calculating score and removing hide class from high score list
    scoreEl.classList.remove("hide");
    scoreannEl.textContent = "Your score is " + Math.round((scoreCount/questions.length)*100) + "%";
}

var submitcount = 0; // counter for how many quizzes have been finished
var highscores = []; // creating an array that will populate in the next btn listener
var sortedscores // declaring globally so I can rewrite it when clearing high scores
highsubBtn.addEventListener("click", function(event) { // submitting your initials after the quiz
    event.preventDefault();

    scoreEl.classList.add("hide");
    highscpgEl.classList.remove("hide");

    var initials = iniInput.value; // taking whatever value is in the input box
    var scores = Math.round((scoreCount/questions.length)*100); 
    highscores[submitcount] = // Don't use brackets, this will build itself and create it's own array
        {
            initials,
            scores
            
        };

    console.log(initials);
    
    // clear the high score list before reentering the information
    while (document.querySelector("#high-score-list").firstChild) { // Before appending the other answer choices, this will remove all children until none are left
        document.querySelector("#high-score-list").removeChild(document.querySelector("#high-score-list").firstChild);
    }

    // need to continually sort the highscores
    sortedscores = highscores.sort(SortScores);
    console.log(sortedscores);
    localStorage.setItem("highscores",JSON.stringify(sortedscores));

    // Outputting high score list after sorting
    for (let i = 0; i < highscores.length; i++) { // creating a for loop which creates list item then the text for it and append to ul in html file
        var list = document.createElement("li");
        list.setAttribute("style", "list-style-type:none; margin: 0; padding: 0; width: 100%;")
        list.textContent = i+1 + ". " + sortedscores[i].initials + " - " + sortedscores[i].scores
        document.querySelector("#high-score-list").appendChild(list); 
    }

    submitcount++;
})

function SortScores(a, b) {
    return b.scores - a.scores // why do i need the return here? 
}



backBtn.addEventListener("click", resetQuiz) // Back button at high score list menu - allows you to restart the quiz if time runs out or you finish the quiz
function resetQuiz () {
    index = 0;
    scoreCount = 0;
    secondsLeft = 100;
    highscpgEl.classList.add("hide");
    timeoutEl.classList.add("hide");
    startconEl.classList.remove("hide");
    questcontainerEl.classList.remove("hide");
}

backtime.addEventListener("click", resetQuiz); // need one for when i run out of time - just made another button for it

highscoreBtn.addEventListener("click", function(){ // Button listener when you choose to view high scores
    containerEl.classList.add("hide");
    startconEl.classList.add("hide");
    questcontainerEl.classList.add("hide");
    highscpgEl.classList.remove("hide");
    stopTimer();
})

clearhighBtn.addEventListener("click", function(){ // clearing local storage to clear high score list
    localStorage.clear();
    sortedscores = [];
    while (document.querySelector("#high-score-list").firstChild) { // this will remove all children until none are left for the high scores list
        document.querySelector("#high-score-list").removeChild(document.querySelector("#high-score-list").firstChild);
    };
})

const questions = [ // created questions in javascript so I only have 1 button to listen for in the HTMl file - this makes it easier to index
    {
        question: "What is the correct way to make comments in JavaScript?",
        answers: [
            {text: "//", correct: true},
            {text: "<!---->", correct: false},
            {text: "/* */", correct: false},
            {text: "$", correct: false}
        ]
    },
    {
        question: "Are JavaScript and Java related?",
        answers: [
            {text: "Yes", correct: false},
            {text: "Maybe", correct: false},
            {text: "No", correct: true},
            {text: "Obviously-Snape", correct: false}
        ]
    },
    {
        question: "What is the purpose of JavaScript?",
        answers: [
            {text: "To format the HTML", correct: false},
            {text: "To create the webpage", correct: false},
            {text: "To make webpage do stuff", correct: true},
            {text: "You're a wizard Harry - Gandalf", correct: false}
        ]
    }
]





