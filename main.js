// Defining variables globally
var countdownCheck = true;
var countdownValue = 59;
var inputPermission = true;

var correctKeyStrokes = 0;
var wrongKeyStrokes = 0;
var totalKeyStrokes = 0;
var correctWords = 0;
var wrongWords = 0;
var accuracy = null;
var wpm = null;

// Adding the ids of the words in the html file to the array with a loop
let wordsArray = [];
for (let i = 1; i <= 7; i++) {
    wordsArray.push(document.getElementById("word" + i));
}

// localhost (node localhost.js)
fetch('words.json')
    .then(response => response.json())
    .then(data => {

        const words = data.words;
        var textBox = document.getElementById("textBox");

        // Creating random words
        for (let i = 0; i < wordsArray.length; i++) {
            let randomWord = Math.floor(Math.random() * words.length);
            wordsArray[i].textContent = words[randomWord];
        }

        // Pressing characters in the text box
        textBox.addEventListener("input", function(event) {

            if (countdownCheck == true && textBox.value !== ''){
                textBox.placeholder = '';
                countdownCheck = false;
                updateCountdown();
            }

            if (event.inputType === 'deleteContentBackward' || event.inputType === 'insertText' && event.data === ' '){
                return;
            }

            let middleWord = wordsArray[3].textContent;
            if (textBox.value.charAt(textBox.value.length - 1) === middleWord[textBox.value.length - 1]){
                correctKeyStrokes++;
            }
            else{
                wrongKeyStrokes++;
            }

            totalKeyStrokes = correctKeyStrokes + wrongKeyStrokes;
        
        })

        // Pressing space in the text box
        textBox.addEventListener("input", function(event){
            if (event.inputType === 'insertText' && event.data === ' ' && inputPermission == true){
                for (let i = 0; i < wordsArray.length; i++){
                    if(i == 6){
                        let randomWord = Math.floor(Math.random() * words.length);
                        wordsArray[i].textContent = words[randomWord];
                    }
                    else{
                        wordsArray[i].textContent = wordsArray[i+1].textContent;
                    }
                }

                let middleWord = wordsArray[2].textContent;
                if (middleWord === textBox.value.trim()){
                    correctWords++;
                }
                else{
                    wrongWords++;
                }
                textBox.value = '';
            }
        })

        // To update the countdown
        function updateCountdown(){
            countdown = document.getElementById('countdown');

            if (countdownValue >= 10){
                countdown.value = "0:"+countdownValue;
            }
            else if(countdownValue < 10){
                countdown.value = "0:0"+countdownValue;
            }

            if (countdownValue == 0){
                result();
            }

            if (countdownValue>0){
                setTimeout(updateCountdown, 1000);
            }
            
            countdownValue--;
        }

        // To show the result
        function result(){
            var texts = {
                keystrokes: document.getElementById("keystrokesText"),
                accuracy: document.getElementById("accuracyText"),
                correctWords: document.getElementById("correctWordsText"),
                wrongWords: document.getElementById("wrongWordsText")
            };

            var results = {
                wpm: document.getElementById("wpmResult"),
                keystrokes: document.getElementById("keystrokesResult"),
                accuracy: document.getElementById("accuracyResult"),
                correctWords: document.getElementById("correctWordsResult"),
                wrongWords: document.getElementById("wrongWordsResult")
            };

            // Calculating the wpm(word per minute)
            accuracy = correctKeyStrokes / totalKeyStrokes; 
            const time = 1;
            wpm = (totalKeyStrokes * accuracy) / (5 * time);

            texts.keystrokes.innerHTML = "Keystrokes: ";
            texts.accuracy.innerHTML = "Accuracy: ";
            texts.correctWords.innerHTML = "Correct Words: ";
            texts.wrongWords.innerHTML = "Wrong Words: ";
            results.wpm.innerHTML = wpm + " WPM";
            results.keystrokes.innerHTML =totalKeyStrokes;
            results.accuracy.innerHTML = ((accuracy * 100).toFixed(1)) + " %";
            results.correctWords.innerHTML = correctWords;
            results.wrongWords.innerHTML = wrongWords;

            // Removing random words
            var wordsList = document.querySelectorAll('#wordsTable td');
            wordsList.forEach(function(td){
                if (td.innerHTML !== "Results"){
                    td.innerHTML = '';
                }
            })

            inputPermission = false;
        }

    })
    .catch(error => console.error('Cannot read JSON file! :', error));

function reset(){
    // Clearing the result table
    var resultList = document.querySelectorAll('#resultTable td');
    resultList.forEach(function(td){
        if (td.innerHTML !== "Results"){
            td.innerHTML = '';
        }
    })

    // Creating random words
    fetch('words.json')
    .then(response => response.json())
    .then(data => {
        const words = data.words;
        for (let i = 0; i < wordsArray.length; i++) {
            let randomWord = Math.floor(Math.random() * words.length);
            wordsArray[i].textContent = words[randomWord];
        }
    })

    // Reseting the textbox, countdown, variables
    textBox.value = '';
    textBox.placeholder = "Start typing...";

    countdownCheck = true;
    countdownValue = 59;
    document.getElementById('countdown').value = "1:00";

    inputPermission = true;

    correctKeyStrokes = 0;
    wrongKeyStrokes = 0;
    totalKeyStrokes = 0;
    correctWords = 0;
    wrongWords = 0;
    accuracy = null;
    wpm = null;
}