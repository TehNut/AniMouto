const anilistCall = (query, variables, token) =>
  fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  function beginMediaList(accessToken) {
    if (document.getElementById("login"))
      document.body.removeChild(document.getElementById("login"));

    document.getElementById("logout-button").addEventListener("click", () => {
      chrome.storage.local.remove(["access_token", "refresh_token"], value => {});
      window.close();
    });

    anilistCall("{Viewer{id name siteUrl}}", {}, accessToken)
      .then(viewerRes => viewerRes.json())
      .then(viewerRes => viewerRes.data.Viewer)
      .then(viewerRes => {
        document.getElementById("login-name").insertAdjacentHTML("afterbegin", "Logged in as <a href='" + viewerRes.siteUrl + "' style='color:rgb(var(--color-text-bright));font-weight:bold;' target='_blank'>" + viewerRes.name + "</a>");
        handleList(viewerRes.id, accessToken);
      });
  }

  function handleList(userId, token) {
    anilistCall(mediaListQuery, {
        user: userId
      }, token)
      .then(res => res.json())
      .then(res => {console.log(res); return res.data})
      .then(res => {
        let animeEntries = res.anime.lists[0].entries;
        handleEntries("airing-anime", animeEntries.filter(entry => entry.media.nextAiringEpisode), (o1, o2) => o1.media.nextAiringEpisode.timeUntilAiring - o2.media.nextAiringEpisode.timeUntilAiring, token);
        handleEntries("anime", animeEntries.filter(entry => !entry.media.nextAiringEpisode), (o1, o2) => o2.updatedAt - o1.updatedAt, token);
        handleEntries("manga", res.manga.lists[0].entries, (o1, o2) => o2.updatedAt - o1.updatedAt, token);
      });
  }

  function handleEntries(listType, list, sortFunction, token) {
    list.sort(sortFunction);
    for (let media in list.slice(0, 20)) {
      let entry = list[media];
      media = entry.media;
      let listElement = document.getElementById(listType);
      let spinner = document.getElementById("spinner-" + listType);
      if (spinner)
        listElement.removeChild(spinner);
      listElement.insertAdjacentHTML('beforeend', getHtml(media, entry.progress, listType));

      let card = document.getElementById(listType + "-" + media.id);
      card.addEventListener("mouseover", e => {
        let timeUntilElement = document.getElementById(listType + "-" + media.id + "-time-until");
        let progressElement = document.getElementById(listType + "-" + media.id + "-progress");

        if (timeUntilElement)
          timeUntilElement.style.display = "none";
        progressElement.style.display = "inline-block"
        progressElement.addEventListener("onclick", e => {
          e.preventDefault();
          anilistCall(listEntryMutation, {
            ids: [media.id],
            progress: entry.progress + 1
          }, token).then(res => res.json()).then(res => res.data[0]).then(res => progressElement.innerHTML = res.progress + "+");
        })
      });

      card.addEventListener("mouseout", e => {
        let timeUntilElement = document.getElementById(listType + "-" + media.id + "-time-until");
        let progressElement = document.getElementById(listType + "-" + media.id + "-progress");

        if (timeUntilElement)
          timeUntilElement.style.display = "inline-block";
        progressElement.style.display = "none"
      })
    }
  }

  function getHtml(media, progress, listType) {
    let addedContent = "";
    let ret = showHtml.replace("#{id}", listType + "-" + media.id).replace("#{img}", media.coverImage.large).replace("#{is_airing}", media.nextAiringEpisode ? "initial" : "none").replace("#{site_url}", media.siteUrl);

    addedContent += "<span style='display: none;'>" + media.title.romaji + "</span>";
    if (media.nextAiringEpisode) {
      let date = new Date(1970, 0, 1);
      date.setSeconds(media.nextAiringEpisode.timeUntilAiring);
      let isBehind = media.nextAiringEpisode.episode - 1 > progress;
      ret = ret.replace("#{is_behind}", isBehind ? "is-behind": "")
      addedContent += "<span id='" + listType + "-" + media.id + "-time-until" + "' class='overlay-text'>Ep " + media.nextAiringEpisode.episode + " - " + parseTime(media.nextAiringEpisode.timeUntilAiring) + "</span>";
    }
    addedContent += "<span id='" + listType + "-" + media.id + "-progress" + "' style='display:none;' class='overlay-text'>" + progress + " +</span>";

    return ret.replace("#{content}", addedContent);
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
