document.addEventListener("DOMContentLoaded", e => {
  handleThreads();
  document.getElementById("refresh-button").removeEventListener("click", handleThreads);
  document.getElementById("refresh-button").addEventListener("click", e => handleThreads());
});

function handleThreads() {
  let zone = document.getElementById("thread-zone");
  while (zone.firstChild)
    zone.removeChild(zone.firstChild);

  fetch("../graphql/forum_activity.graphql").then(query => query.text()).then(query => {
    chrome.runtime.getBackgroundPage(page => {
      page.queryAL(query, {}, null).then(res => res.json()).then(res => res.data.Page.threads).then(threads => {
        for (let thread in threads) {
          thread = threads[thread];

          const threadTemplate = `
            <div class="section" id="${thread.id}" style="position:relative;margin-bottom:10px;padding:10px;">
              <div class="thread-title">
                <a href="${thread.siteUrl}" class="highlight-hover" target="_blank">${thread.title}</a>
              </div>
              <br />
              <a href="${thread.replyUser.siteUrl}" class="thread-commenter" target="_blank">
                <img src="${thread.replyUser.avatar.medium}" class="avatar forum-avatar" />
                <span class="highlight">${thread.replyUser.name}</span>
              </a>
              <a href="${thread.siteUrl}/comment/${thread.latest}" class="highlight-hover" target="_blank">replied ${parseTime(Math.abs(thread.repliedAt - Date.now() / 1000))} ago</a>
              <span class="thread-info">
                <span><i class="material-icons" style="padding-right:2px;font-size:10px;vertical-align:bottom;">visibility</i>${thread.viewCount}</span>
                <span><i class="material-icons" style="padding-right:2px;font-size:10px;vertical-align:bottom;">message</i>${thread.replyCount}</span>
              </span>
            </div>
          `

          zone.insertAdjacentHTML("beforeend", threadTemplate);
        }
      });
    });
  });
}

function parseTime(secs) {
  let seconds = parseInt(secs, 10);

  let weeks = Math.floor(seconds / (3600 * 24 * 7));
  seconds -= weeks * 3600 * 24 * 7;
  let days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  let hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  let ret = "";
  if (weeks > 0)
    return weeks + "w";
  if (days > 0)
    return days + "d";
  if (hours > 0)
    return (ret.length == 0 ? "" : " ") + hours + "h";
  if (minutes > 0)
    return (ret.length == 0 ? "" : " ") + minutes + "m"

  return ret === "" ? "<1m" : ret;
}
