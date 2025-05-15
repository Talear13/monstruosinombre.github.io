const terminal = document.getElementById('terminal');
const delay = ms => new Promise(res => setTimeout(res, ms));

function writeLine(text) {
  return new Promise(async (resolve) => {
    let i = 0;
    const lineElem = document.createElement('div');
    lineElem.textContent = '> ';
    terminal.appendChild(lineElem);

    while (i < text.length) {
      lineElem.textContent += text[i];
      i++;
      await delay(40);
    }
    resolve();
  });
}

async function showPrompt(callback) {
  const promptLine = document.createElement('div');
  promptLine.textContent = '> [Y/N] ';
  terminal.appendChild(promptLine);

  const input = document.createElement('input');
  input.setAttribute('maxlength', 1);
  promptLine.appendChild(input);
  input.focus();

  input.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'y' || e.key.toLowerCase() === 'n') {
      const answer = e.key.toLowerCase();
      input.disabled = true;
      callback(answer);
    }
  });
}

const riddles = [
  { riddle: "5j, 5b, don't you see? How much your intimacy costs to be free", answer: "unfairness" },
  { riddle: "Corruption seeps, in hearts it dwells,\nUnfair love, the tale it tells.", answer: "corruption" },
  { riddle: "One gives all, the other takes,\nThe bond bends, but never breaks.", answer: "love" },
  { riddle: "In shadows traded, words decay,\nIs trust a price we throw away?", answer: "sorrow" },
  { riddle: "Two truths fought hard to stay,\nBut one was forced to fade away.", answer: "unfairness" },
  { riddle: "I held your name within my chest,\nWas it a gift or just a test?", answer: "love" },
  { riddle: "Between us stood a glassy wall,\nYou waved goodbye, but did you fall?", answer: "sorrow" },
  { riddle: "They smile as they steal,\nFairness buried under their heel.", answer: "corruption" },
  { riddle: "Promises bloom, then rot beneath,\nWhy do you whisper lies through teeth?", answer: "unfairness" },
  { riddle: "In broken trust, a seed was sown,\nNow I walk this road alone.", answer: "sorrow" }
];

let usedIndexes = new Set();
let correctCount = 0;

async function askRiddle(index) {
  const r = riddles[index];
  const lines = r.riddle.split('\n');
  for (let line of lines) {
    await writeLine(line);
  }

  await delay(500);

  const answerLine = document.createElement('div');
  answerLine.textContent = '> Answer: ';
  terminal.appendChild(answerLine);

  const input = document.createElement('input');
  input.style.width = '150px';
  answerLine.appendChild(input);
  input.focus();

  input.addEventListener('keydown', async e => {
    if (e.key === 'Enter') {
      const ans = input.value.trim().toLowerCase();
      input.disabled = true;

      if (ans === r.answer) {
        correctCount++;
        await writeLine('Correct. Would you like to proceed?');
        await delay(500);
        showPrompt(async (nextAns) => {
          if (nextAns === 'y') {
            await nextRiddle();
          } else {
            await writeLine('Goodbye. Log terminated.');
          }
        });
      } else {
        await writeLine('Incorrect. The truth remains hidden...');
      }
    }
  });
}

async function nextRiddle() {
  if (correctCount >= 10) {
    await writeLine("You have completed your trial.");
    await writeLine("Downloading truth...");
    await delay(1500);

    // Download the text file
    const textBlob = new Blob(["https://mega.nz/file/LIswACZS#66-c2YzA9vouJdraFO459ieRkRgglyEaHI2s_mEzX2o yeah this is weird as fuck, considering i did all that js for a voice recording. yippee. You've faced the truth. You are el monstruo si nombre."], { type: "text/plain" });
    const textURL = URL.createObjectURL(textBlob);
    const textLink = document.createElement("a");
    textLink.href = textURL;
    textLink.download = "truth.txt";
    textLink.click();

    // Download the MP3
    const audioLink = document.createElement("a");
    audioLink.href = "The voice.mp3";
    audioLink.download = "The voice.mp3";
    audioLink.click();

    // After 3s, glitch and show image
    await delay(3000);
    document.body.style.background = 'black';
    terminal.style.display = 'none';

    const img = document.createElement('img');
    img.src = 'YesFr.png';
    img.style.position = 'fixed';
    img.style.top = '0';
    img.style.left = '0';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.zIndex = '9999';
    document.body.appendChild(img);
    return;
  }

  let index;
  do {
    index = Math.floor(Math.random() * riddles.length);
  } while (usedIndexes.has(index));
  usedIndexes.add(index);
  await askRiddle(index);
}

async function main() {
  await delay(1000);
  await writeLine('Welcome to You are el monstruo si nombre');
  await writeLine(' ');
  await writeLine('This is the tailor speaking.');
  await writeLine('You know me, But you do not.');
  await writeLine(' ');
  await writeLine('Since you\'re here, let\'s play a game, you and me?');
  showPrompt(async (ans1) => {
    if (ans1 === 'y') {
      await writeLine('Game starting...');
      await delay(2000);
      await writeLine("Here is your riddle:");
      await nextRiddle();
    } else {
      await writeLine('Goodbye. Log terminated.');
    }
  });
}

main();