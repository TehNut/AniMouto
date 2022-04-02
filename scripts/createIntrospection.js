import { writeFile } from "fs";
import fetch from "node-fetch";
import { getIntrospectionQuery } from "graphql";
import { getIntrospectedSchema, minifyIntrospectionQuery } from "@urql/introspection";

fetch("https://graphql.anilist.co", {
  method: "POST",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    query: getIntrospectionQuery({ descriptions: false })
  })
}).then(res => res.json()).then(({ data }) => {
  const minified = minifyIntrospectionQuery(getIntrospectedSchema(data));
  writeFile("./src/lib/graphql/introspection.json", JSON.stringify(minified), err => {
    if (err) {
      console.error("Failed to write introspection result", err);
      return;
    }

    console.log("Introspection result written");
  });
});