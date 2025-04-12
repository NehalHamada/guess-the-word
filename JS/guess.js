// Setting Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector(
  "footer"
).innerHTML = `${gameName} Game Created By Elzero Web School`;

// Setting Game Options
let numberOfTries = 6;
let numberOfLetterts = 6;
let currentTry = 1;
let numberOfHints = 2;

// Manage Words
let wordToGuess = "";
const words = [
  "Create",
  "Update",
  "Delete",
  "Master",
  "Branch",
  "Mainly",
  "Elzero",
  "School"
];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

// Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

function generateInput() {
  const inputsContainer = document.querySelector(".inputs");
  // Create Main Try Div
  for (let i = 1; i <= numberOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;
    if (i !== 1) {
      tryDiv.classList.add("disabled-inputs");
    }
    // create Inputs
    for (let j = 1; j <= numberOfLetterts; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess${i}-letter${j}`;
      input.setAttribute("maxlength", "1");
      tryDiv.appendChild(input);
    }
    inputsContainer.appendChild(tryDiv);
  }
  // Focus First Input In First One
  inputsContainer.children[0].children[1].focus();
  // Diable All Inputs Expect First One
  const inputsInDisaledDiv = document.querySelectorAll(
    ".disabled-inputs input"
  );
  inputsInDisaledDiv.forEach((input) => (input.disabled = "true"));
  // tranfer to next filed of input
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    // Convert Input Value To UpperCase and Focus Next Input
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });
    input.addEventListener("keydown", function (event) {
      const currentIndex = Array.from(inputs).indexOf(event.target); // in index of we can write this
      if (event.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) inputs[nextInput].focus();
      }
      if (event.key === "ArrowLeft") {
        const previousInput = currentIndex - 1;
        if (previousInput >= 0) inputs[previousInput].focus();
      }
    });
  });
}
const checkButton = document.querySelector(".check");
checkButton.addEventListener("click", handleGusses);

function handleGusses() {
  // checkButton.blur();
  let successGuess = true;
  console.log(wordToGuess);
  for (let i = 1; i <= numberOfLetterts; i++) {
    const inputFiled = document.querySelector(`#guess${currentTry}-letter${i}`);
    const letter = inputFiled.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];
    // Game Logic
    if (letter === actualLetter) {
      // Letter is Correct and in Place
      inputFiled.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      // Letter is Correct and not in Place
      inputFiled.classList.add("not-in-place");
      successGuess = false;
    } else {
      // Letter is Incorrect
      inputFiled.classList.add("no");
      successGuess = false;
    }
  }
  // Check if the user won or lose
  if (successGuess) {
    messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;
    if (numberOfHints === 2) {
      messageArea.innerHTML = ` You Win The Word Is <span>${wordToGuess}</span>
      <p>You didn't use any hints</p>`;
    }
    // Add Disabled Class on All Try Divs
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));
    // Disable Check Button
    checkButton.disabled = true;
    getHintButton.disabled = true;
  } else {
    document
      .querySelector(`.try-${currentTry}`)
      .classList.add("disabled-inputs");
    const currentTryInputs = document.querySelectorAll(
      `.try-${currentTry} input`
    );
    currentTryInputs.forEach((input) => (input.disabled = true));
    currentTry++;
    const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    nextTryInputs.forEach((input) => (input.disabled = false));
    let el = document.querySelector(`.try-${currentTry}`);
    if (el) {
      document
        .querySelector(`.try-${currentTry}`)
        .classList.remove("disabled-inputs");
      el.children[1].focus();
    } else {
      // Disable Check Button
      checkButton.disabled = true;
      getHintButton.disabled = true;
      messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
    }
  }
}
function getHint() {
  getHintButton.blur();
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").innerHTML = numberOfHints;
  }
  if (numberOfHints === 0) {
    getHintButton.disabled = true;
  }
  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  const emptyEnabledInputs = Array.from(enabledInputs).filter(
    (input) => input.value === ""
  );
  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
    if (indexToFill !== -1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
  }
}

function handleBackspace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const previousInput = inputs[currentIndex - 1];
      currentInput.value = ""; // Clear the current input value
      previousInput.value = ""; // Clear the previous input value
      previousInput.focus();
    }
  }
}
document.addEventListener("keydown", handleBackspace);
window.onload = function () {
  generateInput();
};
