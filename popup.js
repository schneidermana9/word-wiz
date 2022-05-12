let replacementText = await chrome.storage.sync.get().then((resolve) => {
  console.log('haha awaiting result!');
  return resolve;
});
document.getElementById('text').innerHTML = replacementText;
