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

export function parseTime(secs, appendseconds) {
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
    ret += (ret.length === 0 ? "" : " ") + hours + "h";
  if (minutes > 0)
    ret += (ret.length === 0 ? "" : " ") + minutes + "m";

  if (appendseconds && seconds > 0)
    ret += (ret.length === 0 ? "" : " ") + seconds + "s";

  return ret;
}
