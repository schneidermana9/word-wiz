
(async () => {
  let replacementText = chrome.storage.sync.get("words", (result) => console.log(result));
  document.getElementById("words").innerHTML = replacementText;
})


/*
Possible data structures:
The whole thing is a dictionary:
pros: -most logical, pairing each word with its definition
cons: -not currently working, only returning the last thing stored seemingly
lists of words + definitions stored separately:
pros: -would possible just work
cons: -not sure if there's a way to actually set them up

I HATE JAVASCRIPT

 */
