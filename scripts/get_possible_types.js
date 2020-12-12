const { writeFileSync } = require("fs");
const { join } = require("path");
const fetch = require("node-fetch");

(async  () => {
  const possibleTypes = await getPossibleTypes();
  writeFileSync(join(__dirname, "../dist", "possibleTypes.json"), JSON.stringify(possibleTypes), "utf8");
})();

async function getPossibleTypes() {
  const result = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: "{ __schema { types { kind name possibleTypes { name } } } }"
    })
  }).then(res => res.json());

  const filteredData = result.data.__schema.types.filter(
    type => type.possibleTypes !== null,
  );
  result.data.__schema.types = filteredData;

  return result.data;
}