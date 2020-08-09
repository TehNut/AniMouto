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
  }).then(res => res.json()).then(res => {
    if (res.errors) {
      let invalidToken = res.errors.find(e => e.message === "Invalid token");
      if (invalidToken)
        throw new Error("Invalid token");

      invalidToken = res.errors.find(e => e.status === 401);
      if (invalidToken)
        throw new Error("Expired token");
    }

    return res;
  }).catch(e => {
    // I love bandaids
    chrome.storage.local.set({ access_token: "" });
    document.querySelector(".container").__vue__.$router.push({ path: "/login", params: { reason: e.message } });
  });
}

export function displayify(value) {
  if (!value)
    return "";

  value = value.split("_");
  let ret = "";
  value.forEach(e => ret += (ret.length === 0 ? "" : " " ) + e.charAt(0) + e.substring(1).toLowerCase());
  return ret;
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
