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
