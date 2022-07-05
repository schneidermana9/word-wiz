
window.onload = (async () => {
  let replacementText = await chrome.storage.sync.get("words", (result) => console.log(result.words));
  document.getElementById("words").innerHTML = replacementText;
})


/*
ok, the issue is that this script doesn't actually run I think?

Needs something to trigger the async function, an "on load" or something

 */
