// setting Game Name

let gameName = 'Guess The Word';
document.title = gameName;
document.querySelector('h1').innerHTML = gameName;
document.querySelector('footer').innerHTML = `${gameName} Game Created by Eyad Nashaat`;


// setting game options

let numbersOfTries = 6;
let numberOfLetters =6;
let currentTry =1;
let numberOfHints = 3;

// Manage Words

let WordToGuess = "";
const words = ["Create", "Update", "Delete", "Master", "Branch", "Mainly", "Elzero", "School"];
WordToGuess = words[Math.floor(Math.random()*words.length)].toLowerCase();
// message
const messageArea = document.querySelector('.message');


// Manage Hints
document.querySelector('.hint span').innerHTML = 2;
const getHintButton = document.querySelector('.hint');
getHintButton.addEventListener('click',getHint);



function generateInput(){
    let inputsContainer = document.querySelector('.inputs');

    // Create Main Try Div
    for(let i=1; i<=numbersOfTries; i++){
        const tryDiv = document.createElement('div');
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;

        (i!==1)? tryDiv.classList.add('disabled-inputs'):tryDiv;
        
        // Create Inputs
        for(let j =1; j<=numberOfLetters;j++){
            const input = document.createElement('input');
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute('maxlength','1');
            tryDiv.appendChild(input);

            


        }
        inputsContainer.appendChild(tryDiv)

    }

    // Focus on first input letter
    inputsContainer.children[0].children[1].focus();

    // Disable All Inputs Except First One
    const inputsInDisableDiv = document.querySelectorAll('.disabled-inputs input');
    inputsInDisableDiv.forEach((input)=>(input.disabled=true));


    // Navigation 

    const inputs = document.querySelectorAll('input');
    inputs.forEach((input,index)=>{

        // Convert Input To UpperCase
        input.addEventListener('input',function(){
            this.value = this.value.toUpperCase();

            // shift to next input when we fill it 
            const nextInput = inputs[index+1];
            if(nextInput) nextInput.focus();
        });

        // Move cursor left or right 
        input.addEventListener('keydown',function(event){

            const currentIndex = Array.from(inputs).indexOf(event.target)
            

            if(event.key === 'ArrowRight'){
                const nextInput = currentIndex+1;
                if(nextInput < inputs.length) inputs[nextInput].focus();
            }
            if(event.key === 'ArrowLeft'){
                const previousInput= currentIndex-1;
                if(previousInput>=0) inputs[previousInput].focus();
            }

        });
    })
}






// game logic  

const guessButton = document.querySelector('.check');
guessButton.addEventListener('click',handleGuesses);
console.log(WordToGuess)




function handleGuesses(){
    let successGuess = true;
    for(let i =1; i<= numberOfLetters;i++){
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();

        // Game Logic

        if (letter === WordToGuess[i-1]){
            // letter is correct and in place
            inputField.classList.add('yes-in-place')
            
        }
        else if (WordToGuess.includes(letter) && letter !==''){
            // letter is correct but not in place
            inputField.classList.add('not-in-place')
            successGuess=false;
        }
        else{
            // letter isnot in the word 
            inputField.classList.add('no') 
            successGuess=false;
            }
        }

        // check if user win or lose

        if(successGuess===true){
            messageArea.innerHTML = `Congratulation Your Guess is True and the word is <span>${WordToGuess}</span>`
            if(numberOfHints===2){
                messageArea.innerHTML = `<p>Congratulation You Didn't Use Hints</p>`
            }

            // Add disable class on all try divs 
            let allTries = document.querySelectorAll('.inputs > div');
            allTries.forEach((tryDiv)=>{
                tryDiv.classList.add('disabled-inputs');
            })


            // Disable Guess Button
            guessButton.disabled = true;
            
        }


        // condition if you lose 
        else{

            document.querySelector(`.try-${currentTry}`).classList.add('disabled-inputs');
            const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
            currentTryInputs.forEach((input) => {
                input.disabled = true
            })
            // to make it shift to next try 
            currentTry++;

            
            const nextTryInputs= document.querySelectorAll(`.try-${currentTry} input`);
            nextTryInputs.forEach((input) => {
                input.disabled = false
            })

            let el = document.querySelector(`.try-${currentTry}`)
            if(el){
                document.querySelector(`.try-${currentTry}`).classList.remove('disabled-inputs');
                el.children[1].focus()
            }
            else{
                messageArea.innerHTML = `you lose the word is <span>${WordToGuess}</span>`
                guessButton.disabled = true
                getHintButton.disabled = true
            }

            }

        }

        
    


// Game Hint

function getHint(){
    if(numberOfHints > 0){
        numberOfHints --;
        document.querySelector('.hint span').innerHTML = numberOfHints;
    }
    if(numberOfHints===0){
        getHintButton.disabled = true;
    }

    const enabledInputs = document.querySelectorAll('input:not([disabled])');
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input)=>input.value === "");
    

    if(emptyEnabledInputs.length >0){

        const randomIndex = Math.floor(Math.random()*emptyEnabledInputs.length);
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        randomInput.value = WordToGuess[indexToFill].toUpperCase()
    




    }

}




// function handle backSpace

function handleBackSpace(event){
    if(event.key === 'Backspace'){
        const enabledInputs = document.querySelectorAll('input:not([disabled])');
        const currentIndex = Array.from(enabledInputs).indexOf(event.target);
        if(currentIndex >0){
            // previous input
            enabledInputs[currentIndex-1].value='';
            // current input
            enabledInputs[currentIndex].value='';
            // focus on previous input 
            enabledInputs[currentIndex-1].focus()

        }
    }
}

document.addEventListener ('keydown',handleBackSpace)

window.onload = function(){
    generateInput();
}