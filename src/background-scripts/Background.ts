import "@/background-scripts/Authentication";
import "@/background-scripts/Notifications";

export async function queryAniList(token: string, query: string, variables?: any): Promise<any> {
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      Accept: "application/json",
      'Content-Type': "application/json",
      'Authorization': token
    },
    body: JSON.stringify({
      query,
      variables
    })
  });
  return res.json();
}