const pages = {
  medialist: {
    name: "Media",
    id = "medialist"
  }
};

Object.keys(pages).forEach(key => {
  key = pages[key];
  let listElement = document.createElement("li");
  listElement.innerText = key.name; // TODO: Use an icon instead
  listElement.addEventListener("onclick", e => {
    document.getElementById("viewport").src = "./html" + key.id + ".html";
  })
  document.getElementById("navigation").insertAdjacentElement("beforeend", listElement);
});

chrome.storage.local.get({
  last_tab: "medialist"
}, value => document.getElementById("viewport").src = "./html/" + value.last_tab + ".html");
