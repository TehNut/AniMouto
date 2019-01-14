document.addEventListener("DOMContentLoaded", e => {
  let manifest = chrome.runtime.getManifest();
  document.getElementById("animouto-title").innerText = manifest.name + " v" + manifest.version;
  document.getElementById("animouto-description").innerText = manifest.description;
  document.getElementById("changelog-version").innerText = " v" + manifest.version;

  handleChangelog(manifest);
});

function handleChangelog(manifest) {
  fetch("../changes.json").then(res => res.json()).then(res => {
    let latestChanges = res[manifest.version];
    if (!latestChanges) {
      document.getElementById("changelog").style.display = "none";
      return;
    }

    let changelogArea = document.getElementById("changes-stage");

    addChangelogSection(changelogArea, "Fixes", latestChanges.fix);
    addChangelogSection(changelogArea, "Additions", latestChanges.add);
    addChangelogSection(changelogArea, "Changes", latestChanges.change);
  });
}

function addChangelogSection(stage, title, section) {
  let titleElement = document.createElement("h2");
  titleElement.classList.add("title");
  titleElement.innerText = title;
  stage.insertAdjacentElement("beforeend", titleElement);
  if (section && section.length > 0) {
    let changeList = [];
    for (let line in section) {
      let lineText = document.createElement("p");
      lineText.classList.add("subtext");
      let bulletPoint = document.createElement("span");
      bulletPoint.classList.add("no-select");
      lineText.appendChild(bulletPoint);
      lineText.innerText += section[line];

      changeList.push(lineText);
    }

    changeList.forEach(e => stage.insertAdjacentElement("beforeend", e));
  } else {
    let lineText = document.createElement("p");
    lineText.classList.add("subtext");
    lineText.innerText = `No ${title.toLowerCase()}`;
    stage.insertAdjacentElement("beforeend", lineText);
  }
}
