chrome.runtime.onInstalled.addListener(() => {
  const myContextMenu = chrome.contextMenus.create({
    id: 'wordContextMenu',
    title: 'Add %s to list',
    contexts: ['selection'],
  });

  chrome.contextMenus.onClicked.addListener((info) => {
    setDefinition(info.selectionText)
  });
  /*
  future refactor: cleaner to make a class where it has a word + a definition
   */
  chrome.storage.sync.set({"dicts": {
      words: [],
      definitions: []
    }}, () => console.log("object created"));
});

async function setDefinition(uncleanText) {
  try {
    let text = cleanText(uncleanText);
    for (let wordIdx in text) {
      let word = text[wordIdx];
      let definition = await findDefinition(text[wordIdx]).then();
      chrome.storage.sync.get((result) => {
        result.dicts.words.push(word);
        result.dicts.definitions.push(definition)
        console.log(result.dicts);
        /*
        it's only saving one word at a time :(
         */
      });
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
