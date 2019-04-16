export function updateUser() {
  chrome.storage.local.get({ user_info: { site_url: "https://anilist.co", avatar: "https://s4.anilist.co/file/anilistcdn/user/avatar/large/default.png" } }, value => {
    document.getElementById("user-avatar").src = value.user_info.avatar;
    document.getElementById("user-avatar-link").href = value.user_info.site_url;
  });
}
const url = "https://graphql.anilist.co/";

export function queryAL(query, variables, token) {
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  };

  if (token)
    headers.Authorization = "Bearer " + token;

  return fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ query, variables })
  }).then(res => res.json());
}

export function parseTime(secs) {
  let seconds = parseInt(secs, 10);

  let weeks = Math.floor(seconds / (3600 * 24 * 7));
  seconds -= weeks * 3600 * 24 * 7;
  let days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  let hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  return { weeks, days, hours, minutes, seconds };
}

export function formatTime(secs, appendSeconds) {
  const time = parseTime(secs);

  let ret = "";
  if (time.weeks > 0)
    ret += time.weeks + "w";
  if (time.days > 0)
    ret += (ret.length === 0 ? "" : " ") + time.days + "d";
  if (time.hours > 0)
    ret += (ret.length === 0 ? "" : " ") + time.hours + "h";
  if (time.minutes > 0)
    ret += (ret.length === 0 ? "" : " ") + time.minutes + "m";

  if (appendSeconds && time.seconds > 0)
    ret += (ret.length === 0 ? "" : " ") + time.seconds + "s";

  return ret;
}

export function formatTimeShort(secs) {
  const time = parseTime(secs);

  let ret = "";
  if (time.weeks > 0)
    return time.weeks + "w";
  if (time.days > 0)
    return (ret.length === 0 ? "" : " ") + time.days + "d";
  if (time.hours > 0)
    return (ret.length === 0 ? "" : " ") + time.hours + "h";
  if (time.minutes > 0)
    return (ret.length === 0 ? "" : " ") + time.minutes + "m";

  return ret === "" ? "<1m" : ret;
}
