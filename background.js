chrome.runtime.onInstalled.addListener(() => {
  const myContextMenu = chrome.contextMenus.create({
    id: 'wordContextMenu',
    title: 'Add %s to list',
    contexts: ['selection'],
  });

  chrome.contextMenus.onClicked.addListener((info) => {
    try {
      if (info.selectionText) {
        let text = cleanText(info.selectionText);
        for (let wordIdx in text) {
          console.log(text[wordIdx]);
          let definition = findDefinition(text[wordIdx]);
          console.log(definition);
          chrome.storage.sync.set({ word: text[wordIdx] }, () => console.log(wordIdx + ' was set as ' + text[wordIdx]));
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
});

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
    console.log(response);
    if (response.ok) {
      return await response.json().then((obj) => {
        //current issue: response.body is locked ReadableStream
        console.log(response.body);
        return obj.body;
        //obj.body.meanings.definitions.definition;
      });
      return jsonResponse;
    }
    throw new Error('Request Failed!');
  } catch (error) {
    console.log(error);
    return '';
  }
}
