const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength circle color to grey initially
setIndicator("#ccc");

// set password length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  //or kuch bhi karna chahiye ??
   const min = inputSlider.min;
   const max= inputSlider.max;
   
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
 return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomInteger() {
  return getRndInteger(0, 9);
}

function generateLowercase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUppercase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbols() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasLower && hasUpper && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

//Shuffle Password Function
function shufflePassword(array) {
    // Fisher Yates Algorithm
    for (let i = array.length - 1; i >0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
  }
  
function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  //special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});


//Adding Eventlistener to Generate Button
  function generateNow(){
  //none of checkbox is selected
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  //let's start the journey to find new password
  //console.log("Starting the journey");
  //remove old password
  password = "";

  //let's put the stuff mentioned by the checkboxes
  // if(uppercaseCheck.checked){
  //     password+= generateUppercase();
  // }

  // if(lowercaseCheck.checked){
  //     password+= generateLowercase();
  // }

  // if(numbersCheck.checked){
  //     password+= getRandomInteger();
  // }

  // if(symbolsCheck.checked){
  //     password+= generateSymbols();
  // }

  let funcArr = [];
  if (uppercaseCheck.checked) funcArr.push(generateUppercase);

  if (lowercaseCheck.checked) funcArr.push(generateLowercase);

  if (numbersCheck.checked) funcArr.push(getRandomInteger);

  if (symbolsCheck.checked) funcArr.push(generateSymbols);

  //compulsory Addition

  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  //console.log("Compulsory Addition Done");

  //remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    console.log("randIndex" + i);
    password += funcArr[randIndex]();
  }

  //console.log("Remaining Addition Done");

  //Shuffle The  get Password
  password = shufflePassword(Array.from(password));
  //console.log("Shuffling Done");

  //show un UI
  passwordDisplay.value = password;
 // console.log("UI Addition Done");

  calcStrength();
};
