const url = "https://graphql.anilist.co/";

function queryAL(query, variables, token) {
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
  });
}
