chrome.runtime.onInstalled.addListener(() => {
  const myContextMenu = chrome.contextMenus.create({
    id: 'wordContextMenu',
    title: 'Add %s to list',
    contexts: ['selection'],
  });

  chrome.contextMenus.onClicked.addListener((info) => {
    setDefinition(info.selectionText)
  });
});

async function setDefinition(uncleanText) {
  try {
    let text = cleanText(uncleanText);
    for (let wordIdx in text) {
      let word = text[wordIdx];
      let definition = await findDefinition(text[wordIdx]).then();
      chrome.storage.sync.set({ word:definition }, () => console.log(word + ' was set as ' + definition));
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
