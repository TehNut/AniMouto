document.addEventListener("DOMContentLoaded", e => {
  chrome.storage.local.get({
    access_token: ""
  }, value => {
    if (value.access_token !== "")
      beginMediaList(value.access_token);
  });

  document.getElementById("refresh-list").addEventListener("click", e => {
    clearSection(document.getElementById("airing-anime"));
    clearSection(document.getElementById("anime"));
    clearSection(document.getElementById("manga"));
    chrome.storage.local.get({
      access_token: ""
    }, value => {
      if (value.access_token !== "")
        beginMediaList(value.access_token);
    })

    function clearSection(section) {
      while (section.firstChild)
        section.removeChild(section.firstChild);

      section.insertAdjacentHTML("beforeend", "<h2 id='loading-" + section.id + "' class='section-title ellipsis' style='padding-left:10px'>Loading</h2>")
    }
  })
});

function beginMediaList(accessToken) {
  chrome.storage.local.get({ user_info: { id: -1 } }, value => {
    if (value.user_info.id === -1) {
      fetch("../graphql/viewer.graphql").then(res => res.text()).then(res => {
        chrome.runtime.getBackgroundPage(page => {
          page.queryAL(res, {}, accessToken)
            .then(viewerRes => viewerRes.json())
            .then(viewerRes => viewerRes.data.Viewer)
            .then(viewerRes => {
              chrome.storage.local.set({ user_info: { name: viewerRes.name, id: viewerRes.id, site_url: viewerRes.siteUrl, avatar: viewerRes.avatar.large } });
              chrome.runtime.sendMessage({ type: "change_avatar", avatar: viewerRes.avatar.large });
              handleList(viewerRes.id, accessToken);
            });
        });
      })
    } else {
      handleList(value.user_info.id, accessToken);
    }
  });
}

function handleList(userId, token) {
  fetch("../graphql/user_media_list.graphql").then(res => res.text()).then(res => {
    chrome.runtime.getBackgroundPage(page => {
      page.queryAL(res, {
          user: userId
        }, token)
        .then(res => res.json())
        .then(res => res.data)
        .then(res => {
          let animeEntries = res.anime.lists[0].entries;
          handleEntries("airing-anime", animeEntries.filter(entry => entry.media.nextAiringEpisode), (o1, o2) => o1.media.nextAiringEpisode.timeUntilAiring - o2.media.nextAiringEpisode.timeUntilAiring, token);
          handleEntries("anime", animeEntries.filter(entry => !entry.media.nextAiringEpisode), (o1, o2) => o2.updatedAt - o1.updatedAt, token);
          handleEntries("manga", res.manga.lists[0].entries, (o1, o2) => o2.updatedAt - o1.updatedAt, token);
        });
    });
  });
}

function handleEntries(listType, list, sortFunction, token) {
  list.sort(sortFunction);
  let empty = true;

  let sectionTitle = document.getElementById(listType + "-title");
  let listElement = document.getElementById(listType);
  if (listElement.style.display !== "grid") {
    listElement.style.display = "grid";
    sectionTitle.style.display = "inline-block";
  }

  let loadingElement = document.getElementById("loading-" + listType);
  if (loadingElement)
    listElement.removeChild(loadingElement);

  for (let media in list.slice(0, 20)) {
    let entry = list[media];
    media = entry.media;
    listElement.insertAdjacentHTML('beforeend', getHtml(media, entry.progress, listType));

    let card = document.getElementById(listType + "-" + media.id);
    card.removeEventListener("mouseover", handleCardMouseOver);
    card.addEventListener("mouseover", e => handleCardMouseOver(e, listType, entry, media, token));

    card.removeEventListener("mouseout", handleCardMouseOff);
    card.addEventListener("mouseout", e => handleCardMouseOff(listType, media));

    let cardProgress = document.getElementById(listType + "-" + media.id + "-progress");
    cardProgress.removeEventListener("click", incrementMediaProgress);
    cardProgress.addEventListener("click", e => incrementMediaProgress(e, listType, entry, token));
    empty = false;
  }

  if (empty) {
    listElement.style.display = "none";
    sectionTitle.style.display = "none";
  }
}

function getHtml(media, progress, listType) {
  let ret = showHtml
    .replace("#{id}", listType + "-" + media.id)
    .replace("#{img}", media.coverImage.large)
    .replace("#{site_url}", media.siteUrl);

  if (media.nextAiringEpisode) {
    let airingDiv = "<div class='cover-overlay' id='airing-" + media.id + "'>";
    airingDiv += "<span class='overlay-text'>Ep " + media.nextAiringEpisode.episode + " <br /> " + parseTime(media.nextAiringEpisode.timeUntilAiring) + "</span>"
    airingDiv += "</div>";

    ret = ret.replace("#{airing_content}", airingDiv);

    if (media.nextAiringEpisode.episode - 1 > progress)
      ret = ret.replace("#{behind}", `<div class="is-behind" id="${media.id}-behind"></div>`);
  } else {
    ret = ret.replace("#{airing_content}", "");
  }

  ret = ret.replace("#{behind}", "");
  ret = ret.replace("#{id_progress}", listType + "-" + media.id + "-progress");
  ret = ret.replace("#{progress_content}", progress + " +");

  return ret;
}

function handleCardMouseOver(mouseOverEvent, listType, entry, media, token) {
  if (listType === "airing-anime") {
    let airingElement = document.getElementById("airing-" + media.id);
    airingElement.style.opacity = 0.0;
  }

  let progressElement = document.getElementById(listType + "-" + media.id + "-progress");
  progressElement.style.opacity = 1.0;
}

function handleCardMouseOff(listType, media) {
  if (listType === "airing-anime") {
    let airingElement = document.getElementById("airing-" + media.id);
    airingElement.style.opacity = 1.0;
  }

  let progressElement = document.getElementById(listType + "-" + media.id + "-progress");
  progressElement.style.opacity = 0.0;
}

function incrementMediaProgress(clickEvent, listType, entry, token) {
  clickEvent.preventDefault();

  fetch("../graphql/update_progress.graphql").then(res => res.text()).then(res => {
    chrome.runtime.getBackgroundPage(page => {
      let completionDate = null;
      if (entry.progress + 1 >= entry.media.episodes) {
        let currentDate = new Date(Date.now());
        completionDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
      }
      page.queryAL(res, {
        listId: entry.id,
        progress: entry.progress + 1,
        completionDate: completionDate
      }, token).then(res => res.json()).then(res => res.data.SaveMediaListEntry).then(res => {
        if ((entry.media.episodes && res.progress >= entry.media.episodes) || (entry.media.chapters && res.progress >= entry.media.chapters)) {
          let card = document.getElementById(listType + "-" + entry.media.id);
          card.parentNode.removeChild(card);
        }

        entry.progress++;

        let span = clickEvent.target; // Assume clicked on the text itself
        if (clickEvent.target.nodeName === "DIV") // If not, they clicked on the wrapper div
          span = clickEvent.target.childNodes[1]; // Get text itself from div
        span.innerText = `${res.progress} +`;

        if (entry.media.nextAiringEpisode && res.progress >= entry.media.nextAiringEpisode.episode - 1) {
          let behind = document.getElementById(entry.media.id + "-behind");
          if (behind)
            behind.parentNode.removeChild(behind);
        }
      });
    })
  });
}

function parseTime(secs) {
  let seconds = parseInt(secs, 10);

  let days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  let hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  let ret = "";
  if (days > 0)
    ret += days + "d";
  if (hours > 0)
    ret += (ret.length == 0 ? "" : " ") + hours + "h";
  if (minutes > 0)
    ret += (ret.length == 0 ? "" : " ") + minutes + "m"

  return ret;
}

const showHtml = `
  <a id="#{id}" href="#{site_url}" target="_blank">
  	<div class="cover" style="background-image: url('#{img}');">
      #{airing_content}
      <div class="cover-overlay progress" id="#{id_progress}">
        <span class="overlay-text">#{progress_content}</span>
      </div>
      #{behind}
  	</div>
  </a>
`;
