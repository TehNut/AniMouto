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
    anilistCall(anilistQuery, {
        user: userId
      }, token)
      .then(res => res.json())
      .then(res => {console.log(res); return res.data})
      .then(res => {
        let animeEntries = res.anime.lists[0].entries;
        handleEntries("airing-anime", animeEntries.filter(entry => entry.media.nextAiringEpisode), (o1, o2) => o1.media.nextAiringEpisode.timeUntilAiring - o2.media.nextAiringEpisode.timeUntilAiring);
        handleEntries("anime", animeEntries.filter(entry => !entry.media.nextAiringEpisode), (o1, o2) => o2.updatedAt - o1.updatedAt);
        handleEntries("manga", res.manga.lists[0].entries, (o1, o2) => o2.updatedAt - o1.updatedAt);
      });
  }

  function handleEntries(listType, list, sortFunction) {
    list.sort(sortFunction);
    for (let media in list.slice(0, 20)) {
      let entry = list[media];
      media = entry.media;
      let listElement = document.getElementById(listType);
      let spinner = document.getElementById("spinner-" + listType);
      if (spinner)
        listElement.removeChild(spinner);
      listElement.insertAdjacentHTML('beforeend', getHtml(media, entry.progress));
    }
  }

  function getHtml(media, progress) {
    let addedContent = "";
    let ret = showHtml.replace("#{img}", media.coverImage.large).replace("#{is_airing}", media.nextAiringEpisode ? "initial" : "none").replace("#{site_url}", media.siteUrl);

    addedContent += "<span style='display: none;'>" + media.title.romaji + "</span>";
    if (media.nextAiringEpisode) {
      let date = new Date(1970, 0, 1);
      date.setSeconds(media.nextAiringEpisode.timeUntilAiring);
      let isBehind = media.nextAiringEpisode.episode - 1 > progress;
      addedContent += "<span class='overlay-text" + (isBehind ? " is-behind" : "") + "'>Ep " + media.nextAiringEpisode.episode + " - " + parseTime(media.nextAiringEpisode.timeUntilAiring) + "</span>"
    }

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
