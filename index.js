document.addEventListener("DOMContentLoaded", function() {
  fetchPoems();
  const homeButton = document.getElementById("homeButton");
  homeButton.addEventListener("click", fetchPoems);
  const poemBtn = document.getElementById("createPoemBtn");
  poemBtn.addEventListener("click", createPoem);
});

function fetchPoems() {
  const div = createPoemsDiv();
  fetch("http://localhost:3000/poems")
    .then(res => res.json())
    .then(json => {
      for (let i = 0; i < json.length; i++) {
        appendPoem(json[i], div);
      }
    });
}

function clearDOM() {
  const pageContent = getPageContentDiv();
  while (pageContent.firstChild) {
    pageContent.removeChild(pageContent.firstChild);
  }
}

function createPoemsDiv() {
  let poemsDiv = document.createElement("div");
  poemsDiv.id = "poemsDiv";
  return poemsDiv;
}

function getPageContentDiv() {
  let pageContent = document.getElementById("pageContent");
  return pageContent;
}

function createPoem() {
  clearDOM();
  const newPoem = document.createElement("h2");
  const poemForm = document.createElement("form");
  const submitBtn = document.createElement("button");
  const pageContent = getPageContentDiv();
  submitBtn.textContent = "Submit";
  newPoem.textContent = "Create Poem";
  pageContent.appendChild(newPoem);
  createInput("Title", poemForm, "title");
  createInput("Content", poemForm, "content");
  createInput("Username", poemForm, "username");
  poemForm.appendChild(submitBtn);
  pageContent.appendChild(poemForm);
  poemForm.addEventListener("submit", event => {
    postPoem(event);
  });
}

function createInput(labelText, poemForm, id) {
  const input = document.createElement("input");
  const label = document.createElement("label");
  input.id = id;
  label.textContent = labelText;
  label.appendChild(input);
  poemForm.appendChild(label);
}

function postPoem(event) {
  const div = createPoemsDiv();
  event.preventDefault();
  fetch("http://localhost:3000/poems", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      title: event.target.title.value,
      content: event.target.content.value,
      modified_content: replaceNouns(event.target.content.value),
      username: event.target.username.value
    })
  })
    .then(res => res.json())
    .then(clearDOM())
    .then(json => renderConfirmPage(json, div));
}

function replaceNouns(string) {
  input = new RiString(string);
  const words = input.words();
  const speech = input.pos();
  let output = "";
  for (let i = 0; i < speech.length; i++) {
    if (/nn/.test(speech[i])) {
      output += RiTa.randomWord("nn") + " ";
    } else {
      output += words[i] + " ";
    }
  }
  return output;
}

function appendPoem(json, node) {
  let pageContent = getPageContentDiv();
  pageContent.appendChild(node);
  const originalDiv = document.createElement("div");
  const modifiedDiv = document.createElement("div");
  modifiedDiv.id = "modPoemDiv";
  let pOriginal = document.createElement("p");
  let pModified = document.createElement("p");
  pOriginal.textContent = json.content;
  pModified.textContent = json.modified_content;
  originalDiv.appendChild(pOriginal);
  modifiedDiv.appendChild(pModified);
  const readButton1 = createReadButton();
  const readButton2 = createReadButton();
  originalDiv.append(readButton1);
  modifiedDiv.append(readButton2);
  node.appendChild(originalDiv);
  node.appendChild(modifiedDiv);
}

function createReadButton() {
  const button = document.createElement("button");
  button.textContent = "Read Me";
  button.addEventListener("click", event => {
    PoemReader.readPoem(event.target.parentNode.childNodes[0].textContent);
  });
  return button;
}

function renderConfirmPage(json, node) {
  const pageContent = getPageContentDiv();
  const confirmHeader = document.createElement("h2");
  confirmHeader.innerText =
    "Here's your chance to make your peom as krazy as can be!";
  const instructionText = document.createElement("h3");
  instructionText.innerText = "Try click the 'redo' button below to find the kraziest nouns for your poem.";
  pageContent.appendChild(confirmHeader);
  pageContent.appendChild(instructionText);
  appendPoem(json, node);
  const modifiedPoem = document.getElementById("modPoemDiv");
  const redoButton = document.createElement("button");
  modifiedPoem.appendChild(redoButton);
  redoButton.id = "redoButton";
  redoButton.innerText = "Redo";
  redoButton.addEventListener("click", () => console.log("hello"));
  const saveButton = document.createElement("button");
  saveButton.id = "saveButton";
  saveButton.innerText = "Save";
  saveButton.addEventListener("click", () => {clearDOM(); fetchPoems();});
  pageContent.appendChild(saveButton);
}
