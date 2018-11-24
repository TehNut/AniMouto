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
  stage.insertAdjacentHTML("beforeend", "<h2 class='highlight title'>" + title + "</h2>");
  if (section && section.length > 0) {
    let changeList = "";
    for (let line in section)
      changeList += "<p class='subtext'><span class='no-select'>&bull; </span>" + section[line] + "</p>";

    stage.insertAdjacentHTML("beforeend", changeList);
  } else
    stage.insertAdjacentHTML("beforeend", "<p class='subtext'>No " + title.toLowerCase() + "</p>");
}
