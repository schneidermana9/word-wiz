
window.onload = (async () => {
  await chrome.storage.local.get((result) => {
    console.log(result)
    //document.getElementById("words").innerHTML = result;
    document.getElementById("words").innerHTML = result.words + "\n" + result.definitions
  });

})


/*
ok, the issue is that this script doesn't actually run I think?

Needs something to trigger the async function, an "on load" or something

 */
