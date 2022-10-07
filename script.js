// Selects elements by class
var timeEl = document.querySelector(".time");
var questionsEl = document.querySelectorAll(".questions");
var secondsLeft = 100;



// time counting down function
function timer() {
    var timerInterval = setInterval(function() {
        secondsLeft--;
        timeEl.textContent = "Time: " + secondsLeft;

        // if statements will be needed when an answer is wrong
        // time will needed to be taken away

    }, 1000);
}

timer();