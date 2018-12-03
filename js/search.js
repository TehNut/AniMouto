document.addEventListener("DOMContentLoaded", e => {
  const inputField = document.getElementById("search-bar");
  const resultArea = document.getElementById("results");
  let timeout = null;
  let lastSearch = null;

  inputField.addEventListener("keyup", e => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      let trimmed = inputField.value.trim();
      if (trimmed === "" || trimmed === lastSearch)
        return;
      lastSearch = trimmed;

      document.getElementById("loading").style.display = "initial";
      clearSection(document.getElementById("anime-results"), true);
      clearSection(document.getElementById("manga-results"), false);

      chrome.storage.local.get({ access_token: "" }, value => {
        if (value.access_token === "")
          return;

        fetch("../graphql/media_search.graphql").then(res => res.text()).then(res => {
          chrome.runtime.getBackgroundPage(page => {
            page.queryAL(res, { search: trimmed }, value.access_token)
              .then(res => res.json())
              .then(res => res.data.Page.media)
              .then(res => {
                document.getElementById("loading").style.display = "none";
                document.getElementById("blank-marker").style.display = res.length == 0 ? "inherit" : "none";

                for (media in res) {
                  media = res[media];
                  handleMedia(media, isAnime(media.format), resultArea);
                }
              });
          })
        });
      })
    }, 700);
  })
});

function handleMedia(media, anime, resultArea) {
  let entryLinkWrapper = document.createElement("a");
  entryLinkWrapper.href = media.url;
  entryLinkWrapper.target = "_blank";

  let entryElement = document.createElement("div");
  entryElement.className = "list-entry";
  entryLinkWrapper.insertAdjacentElement("beforeend", entryElement);

  let imgElement = document.createElement("img");
  imgElement.className = "entry-image no-select";
  imgElement.src = media.img.large;
  entryElement.insertAdjacentElement("beforeend", imgElement);

  let titleElement = document.createElement("span");
  titleElement.className = "entry-title";
  titleElement.innerHTML = media.title.userPreferred;
  entryElement.insertAdjacentElement("beforeend", titleElement);

  let iconArea = document.createElement("span");
  iconArea.className = "entry-icons";
  entryElement.insertAdjacentElement("beforeend", iconArea);

  let currentElement = document.createElement("i");
  let ptrElement = document.createElement("i");

  if (media.status !== "NOT_YET_RELEASED") {
    currentElement.className = "material-icons entry-icon no-select";
    currentElement.title = "Already listed";
    if (!media.mediaListEntry || media.mediaListEntry.status === "PLANNING") {
      currentElement.title = "Add to current";
      currentElement.className += " enabled";
    }
    currentElement.addEventListener("click", e => {
      e.preventDefault();
      if (!media.mediaListEntry)
        handleEntryClick(media, ptrElement, currentElement, "CURRENT")
    });
    currentElement.innerText = "library_add";
    iconArea.insertAdjacentElement("beforeend", currentElement);
  }

  ptrElement.className = "material-icons entry-icon no-select";
  ptrElement.title = "Already listed";
  if (!media.mediaListEntry) {
    ptrElement.title = "Add to planning";
    ptrElement.className += " enabled";
  }
  ptrElement.addEventListener("click", e => {
    e.preventDefault();
    if (!media.mediaListEntry)
      handleEntryClick(media, ptrElement, currentElement, "PLANNING")
  });
  ptrElement.innerText = "library_books";
  iconArea.insertAdjacentElement("beforeend", ptrElement);

  getResultArea(anime, resultArea).insertAdjacentElement("beforeend", entryLinkWrapper);
}

function isAnime(format) {
  return format !== "MANGA" && format !== "NOVEL" && format !== "ONE_SHOT";
}

function handleEntryClick(media, ptrElement, currentElement, status) {
  chrome.storage.local.get({ access_token: "" }, value => {
    if (value.access_token === "")
      return;

    fetch("../graphql/update_viewing_status.graphql").then(res => res.text()).then(res => {
      chrome.runtime.getBackgroundPage(page => {
        page.queryAL(res, { mediaId: media.id, status: status }, value.access_token)
          .then(res => {
            function setListed(element) {
              element.title = "Already listed";
              element.classList.remove("enabled");
              element.removeEventListener("click", handleEntryClick);
            }

            if (status === "CURRENT") {
              setListed(currentElement);
              setListed(ptrElement);
            } else {
              setListed(ptrElement);
            }
          });
      })
    });
  });
}

function getResultArea(anime, resultArea) {
  let area = document.getElementById((anime ? "anime" : "manga") + "-results");
  if (area.style.display === "none") {
    area.style.display = "block";
    area.insertAdjacentHTML("beforebegin", "<h2 id='" + (anime ? "anime" : "manga") + "-title' class='section-title'>" + (anime ? "Anime" : "Manga") + "</h2>");
  }
  return area;
}

function clearSection(section, anime) {
  if (section.style.display === "none")
    return;

  document.getElementById((anime ? "anime" : "manga") + "-title").outerHTML = "";
  section.style.display = "none";
  while (section.firstChild)
    section.removeChild(section.firstChild);
}
