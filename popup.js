
window.onload = (async () => {
  await chrome.storage.local.get((result) => {
    console.log(result.dicts)
    document.getElementById("words").innerHTML = result.dicts.words + "\n" + result.dicts.definitions
  });

})


/*
ok, the issue is that this script doesn't actually run I think?

Needs something to trigger the async function, an "on load" or something

 */
