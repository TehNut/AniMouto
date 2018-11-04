document.addEventListener("DOMContentLoaded", e => {
  let manifest = chrome.runtime.getManifest();
  document.getElementById("animouto-title").innerHTML = manifest.name + " v" + manifest.version;
  document.getElementById("animouto-description").innerHTML = manifest.description;
});
