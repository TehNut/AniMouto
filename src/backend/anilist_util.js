const url = "https://graphql.anilist.co/";
const queries = {};

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

async function getQuery(id) {
  if (queries[id])
    return queries[id];

  let query = await fetch(`../assets/graphql/${id}.graphql`).then(res => res.text());
  queries[id] = query;
  return query;
}
