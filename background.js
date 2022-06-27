chrome.runtime.onInstalled.addListener(() => {
  const myContextMenu = chrome.contextMenus.create({
    id: 'wordContextMenu',
    title: 'Add %s to list',
    contexts: ['selection'],
  });

  chrome.contextMenus.onClicked.addListener((info) => {
    setDefinition(info.selectionText)
  });

  chrome.storage.sync.set({"words": []}, () => console.log("words list created"));
  chrome.storage.sync.set({"definitions": []}, () => console.log("definitions list created"));
});

async function setDefinition(uncleanText) {
  try {
    let text = cleanText(uncleanText);
    for (let wordIdx in text) {
      let word = text[wordIdx];
      let definition = await findDefinition(text[wordIdx]).then();
      chrome.storage.sync.get("words", (result) => result.words.push(word));
      chrome.storage.sync.get("definitions", (result) => result.definitions.push(definition));
    }
  } catch (error) {
    console.log(error);
  }
}

function cleanText(text) {
  const regex = /[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g;
  text = text.replace(regex, '');
  text = text.toLowerCase();
  words = text.split(' ');
  return words;
}

async function findDefinition(word) {
  const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
  let endpoint = `${url}${word}`;
  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      return await response.json().then((obj) => {
        return obj[0].meanings[0].definitions[0].definition;
      });
    }
    throw new Error('Request Failed!');
  } catch (error) {
    console.log(error);
    return '';
  }
}
