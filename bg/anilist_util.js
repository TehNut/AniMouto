const url = "https://graphql.anilist.co/";

function queryAL(query, variables, token) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ query, variables })
  });
}
