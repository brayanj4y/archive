import command from '../config.json' assert {type: 'json'};
import { HELP } from "./commands/help";
import { BANNER } from "./commands/banner";
import { ABOUT } from "./commands/about"
import { DEFAULT } from "./commands/default";
import { PROJECTS } from "./commands/projects";
import { WHOAMI_QUESTIONS, formatWhoamiHints } from "./commands/whoami";
import { inject } from '@vercel/analytics';

//mutWriteLines gets deleted and reassigned
let mutWriteLines = document.getElementById("write-lines");
let historyIdx = 0
let tempInput = ""
let userInput: string;
let isSudo = false;
let isPasswordInput = false;
let passwordCounter = 0;
let bareMode = false;


const WRITELINESCOPY = mutWriteLines;
const TERMINAL = document.getElementById("terminal");
const USERINPUT = document.getElementById("user-input") as HTMLInputElement;
const INPUT_HIDDEN = document.getElementById("input-hidden");
const PASSWORD = document.getElementById("password-input");
const PASSWORD_INPUT = document.getElementById("password-field") as HTMLInputElement;
const PRE_HOST = document.getElementById("pre-host");
const PRE_USER = document.getElementById("pre-user");
const HOST = document.getElementById("host");
const USER = document.getElementById("user");
const PROMPT = document.getElementById("prompt");
const COMMANDS = ["help", "about", "projects", "whoami", "download", "banner", "clear"];
const HISTORY: string[] = [];
const SUDO_PASSWORD = command.password;
const FILE_LINK = command.fileLink;
const WHOAMI_GAME = { active: false, level: 0, correctAnswers: 0 };
const TOTAL_QUESTIONS = WHOAMI_QUESTIONS.length;


const scrollToBottom = () => {
  const MAIN = document.getElementById("main");
  if (!MAIN) return
  MAIN.scrollTop = MAIN.scrollHeight;
}

function userInputHandler(e: KeyboardEvent) {
  const key = e.key;

  switch (key) {
    case "Enter":
      e.preventDefault();
      if (!isPasswordInput) {
        enterKey();
      } else {
        passwordHandler();
      }
      scrollToBottom();
      break;
    case "Escape":
      if (WHOAMI_GAME.active) {
        writeLines(["Exiting Who Am I? mode...", "<br>"]);
        WHOAMI_GAME.active = false;
      }
      USERINPUT.value = "";
      break;
    case "ArrowUp":
      arrowKeys(key);
      e.preventDefault();
      break;
    case "ArrowDown":
      arrowKeys(key);
      break;
    case "Tab":
      tabKey();
      e.preventDefault();
      break;
  }
}

function enterKey() {
  if (!mutWriteLines || !PROMPT) return
  const resetInput = "";
  let newUserInput;
  userInput = USERINPUT.value;

  if (WHOAMI_GAME.active) {
    const userAnswer = userInput.trim().toLowerCase();
    const currentQuestion = WHOAMI_QUESTIONS[WHOAMI_GAME.level];

    if (userAnswer === currentQuestion.answer.toLowerCase()) {
      WHOAMI_GAME.correctAnswers++;
      writeLines([`✅ Correct! ${WHOAMI_GAME.correctAnswers}/${TOTAL_QUESTIONS}`, "<br>"]);
    } else {
      writeLines([`❌ Incorrect! The answer was: ${currentQuestion.answer}`, "<br>"]);
    }

    WHOAMI_GAME.level++;
    setTimeout(() => displayWhoamiQuestion(WHOAMI_GAME.level), 500);
    USERINPUT.value = "";
    return;
  }

  if (bareMode) {
    newUserInput = userInput;
  } else {
    newUserInput = `<span class='output'>${userInput}</span>`;
  }

  HISTORY.push(userInput);
  historyIdx = HISTORY.length


  if (userInput === 'clear') {
    commandHandler(userInput.toLowerCase().trim());
    USERINPUT.value = resetInput;
    userInput = resetInput;
    return
  }

  const div = document.createElement("div");
  div.innerHTML = `<span id="prompt">${PROMPT.innerHTML}</span> ${newUserInput}`;

  if (mutWriteLines.parentNode) {
    mutWriteLines.parentNode.insertBefore(div, mutWriteLines);
  }

  /*
  if input is empty or a collection of spaces, 
  just insert a prompt before #write-lines
  */
  if (userInput.trim().length !== 0) {
    commandHandler(userInput.toLowerCase().trim());
  }

  USERINPUT.value = resetInput;
  userInput = resetInput;
}

function displayWhoamiQuestion(level: number) {
  if (level >= WHOAMI_QUESTIONS.length) {
    writeLines([`🎉 Game over! You got ${WHOAMI_GAME.correctAnswers}/${WHOAMI_QUESTIONS.length} correct!`, "<br>"]);
    WHOAMI_GAME.active = false;
    WHOAMI_GAME.level = 0;
    WHOAMI_GAME.correctAnswers = 0;
    return;
  }

  const question = WHOAMI_QUESTIONS[level];

  writeLines([`Level ${level + 1}/${TOTAL_QUESTIONS}`, "<br>"]);
  writeLines(formatWhoamiHints(question));
}

function tabKey() {
  let currInput = USERINPUT.value;
  for (const ele of COMMANDS) {
    if (ele.startsWith(currInput)) {
      USERINPUT.value = ele;
      return
    }
  }
}

function arrowKeys(e: string) {
  switch (e) {
    case "ArrowDown":
      if (historyIdx !== HISTORY.length) {
        historyIdx += 1;
        USERINPUT.value = HISTORY[historyIdx];
        if (historyIdx === HISTORY.length) USERINPUT.value = tempInput;
      }
      break;
    case "ArrowUp":
      if (historyIdx === HISTORY.length) tempInput = USERINPUT.value;
      if (historyIdx !== 0) {
        historyIdx -= 1;
        USERINPUT.value = HISTORY[historyIdx];
      }
      break;
  }
}

function commandHandler(input: string) {
  if (input.startsWith("rm -rf") && input.trim() !== "rm -rf") {
    if (isSudo) {
      if (input === "rm -rf src" && !bareMode) {
        bareMode = true;
        setTimeout(() => {
          if (!TERMINAL || !WRITELINESCOPY) return
          TERMINAL.innerHTML = "";
          TERMINAL.appendChild(WRITELINESCOPY);
          mutWriteLines = WRITELINESCOPY;
        });
        easterEggStyles();
        setTimeout(() => writeLines(["CRITICAL: /src obliterated.", "<br>"]), 200)
        setTimeout(() => writeLines(["System meltdown... nah, code is gone. ¯\\_(ツ)_/¯", "<br>"]), 1200)
      } else if (input === "rm -rf src" && bareMode) {
        writeLines(["there's no more src folder dawg!", "<br>"])
      } else {
        writeLines(bareMode ? ["What else are you trying to delete lad?", "<br>"] : ["<br>", "Directory not found.", "type <span class='command'>'ls'</span> for a list of directories.", "<br>"]);
      }
    } else {
      writeLines(["Permission not granted, cry!!", "<br>"]);
    }
    return
  }

  switch (input) {
    case 'clear':
      setTimeout(() => {
        if (!TERMINAL || !WRITELINESCOPY) return
        TERMINAL.innerHTML = "";
        TERMINAL.appendChild(WRITELINESCOPY);
        mutWriteLines = WRITELINESCOPY;
      })
      break;
    case 'banner':
      if (bareMode) {
        writeLines(["Brayanj4y v1.0.0", "<br>"])
        break;
      }
      writeLines(BANNER);
      break;
    case 'help':
      writeLines(bareMode ? ["maybe restarting your browser will fix this.", "<br>"] : HELP);
      break;
    case 'whoami':
      if (bareMode) {
        writeLines([`${command.username}`, "<br>"])
        break;
      }
      WHOAMI_GAME.active = true;
      WHOAMI_GAME.level = 0;
      WHOAMI_GAME.correctAnswers = 0;
      writeLines([
        "🎮 Who Am I? game started! Type your answer and press Enter.",
        "Press <span class='command'>[Esc]</span> to exit anytime.",
        "<br>"
      ]);
      displayWhoamiQuestion(0);
      break;
    case 'about':
      writeLines(bareMode ? ["Nothing to see here dawg.", "<br>"] : ABOUT);
      break;
    case 'projects':
      writeLines(bareMode ? ["I don't want you to break the other projects.", "<br>"] : PROJECTS);
      break;
    case 'download':
      writeLines(["Downloading my resume...", "<br>"]);
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = FILE_LINK;
        link.download = 'Souop Sylvain Brayan.CV.pdf';
        document.body.appendChild(link);
        link.click();
        link.remove();
      }, 500);
      break;
    case 'linkedin': break;
    case 'github': break;
    case 'email': break;
    case 'rm -rf':
      writeLines(bareMode ? ["don't try again.", "<br>"] : ["Usage: <span class='command'>'rm -rf &lt;dir&gt;'</span>", "<br>"]);
      break;
    case 'sudo':
      if (!PASSWORD) return
      isPasswordInput = true;
      USERINPUT.disabled = true;
      if (INPUT_HIDDEN) INPUT_HIDDEN.style.display = "none";
      PASSWORD.style.display = "block";
      setTimeout(() => PASSWORD_INPUT.focus(), 100);
      break;
    case 'ls':
      writeLines(isSudo ? ["src", "<br>"] : ["Permission not granted.", "<br>"]);
      break;
    default:
      writeLines(bareMode ? ["type 'help'", "<br>"] : DEFAULT);
      break;
  }
}

function writeLines(message: string[]) {
  message.forEach((item, idx) => displayText(item, idx));
}

function displayText(item: string, idx: number) {
  setTimeout(() => {
    if (!mutWriteLines) return
    const p = document.createElement("p");
    p.innerHTML = item;
    mutWriteLines.parentNode!.insertBefore(p, mutWriteLines);
    scrollToBottom();
  }, 40 * idx);
}

function revertPasswordChanges() {
  if (!INPUT_HIDDEN || !PASSWORD) return
  PASSWORD_INPUT.value = "";
  USERINPUT.disabled = false;
  INPUT_HIDDEN.style.display = "block";
  PASSWORD.style.display = "none";
  isPasswordInput = false;
  setTimeout(() => USERINPUT.focus(), 200)
}

function passwordHandler() {
  if (passwordCounter === 2) {
    writeLines(["<br>", "INCORRECT PASSWORD.", "PERMISSION NOT GRANTED.", "<br>"]);
    revertPasswordChanges();
    passwordCounter = 0;
    return
  }
  if (PASSWORD_INPUT.value === SUDO_PASSWORD) {
    writeLines(["<br>", "PERMISSION GRANTED.", "Try <span class='command'>'rm -rf'</span>", "<br>"]);
    revertPasswordChanges();
    isSudo = true;
  } else {
    PASSWORD_INPUT.value = "";
    passwordCounter++;
  }
}

function easterEggStyles() {
  const bars = document.getElementById("bars");
  const body = document.body;
  const main = document.getElementById("main");
  const span = document.getElementsByTagName("span");

  if (!bars) return
  bars.remove()
  if (main) main.style.border = "none";
  body.style.backgroundColor = "black";
  body.style.fontFamily = "VT323, monospace";
  body.style.fontSize = "20px";
  body.style.color = "white";
  for (let i = 0; i < span.length; i++) span[i].style.color = "white";
  USERINPUT.style.backgroundColor = "black";
  USERINPUT.style.color = "white";
  USERINPUT.style.fontFamily = "VT323, monospace";
  USERINPUT.style.fontSize = "20px";
  if (PROMPT) PROMPT.style.color = "white";
}

const initEventListeners = () => {
  if (HOST) HOST.innerText = command.hostname;
  if (USER) USER.innerText = command.username;
  if (PRE_HOST) PRE_HOST.innerText = command.hostname;
  if (PRE_USER) PRE_USER.innerText = command.username;

  window.addEventListener('load', () => writeLines(BANNER));
  USERINPUT.addEventListener('keypress', userInputHandler);
  USERINPUT.addEventListener('keydown', userInputHandler);
  PASSWORD_INPUT.addEventListener('keypress', userInputHandler);
  window.addEventListener('click', () => USERINPUT.focus());

  console.log(`%cPassword: ${command.password}`, "color: red; font-size: 20px;");
}

initEventListeners();
inject();
