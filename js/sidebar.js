const pages = {
  medialist: {
    id: "medialist",
    icon: "format_list_bulleted"
  },
  notifications: {
    id: "notifications",
    icon: "mail"
  },
  site_tweaks: {
    id: "sitetweaks",
    icon: "extension"
  },
  settings: {
    id: "settings",
    icon: "settings"
  },
  about: {
    id: "about",
    icon: "face"
  }
};

document.addEventListener("DOMContentLoaded", e => {
  let currentPage = "";

  Object.keys(pages).forEach(key => {
    key = pages[key];
    let listElement = document.createElement("li");
    listElement.style.cursor = "hover";
    listElement.insertAdjacentHTML("beforeend", "<i class='material-icons'>" + key.icon + "</i>");
    listElement.addEventListener("click", e => {
      if (currentPage === key.id)
        return;

      changePage(key.id);
      chrome.storage.local.set({
        last_page: key.id
      }, () => {});
    });

    document.getElementById("navigation").insertAdjacentElement("beforeend", listElement);
    document.getElementById("content").insertAdjacentHTML("beforeend", "<iframe id='viewport-" + key.id + "' src='./html/" + key.id + ".html' width='470' height='595' frameborder='0' style='display:none;'></iframe>")
  })

  chrome.storage.local.get({ user_info: { site_url: "https://anilist.co", avatar: "https://s3.anilist.co/user/avatar/medium/default.png" } }, value => {
    let avatarElement = document.getElementById("avatar");
    avatar.insertAdjacentHTML("beforeend", "<a href='" + value.user_info.site_url + "' target='_blank'><img src='" + value.user_info.avatar + "'></a>")
  })

  changePage(null); // Load last page or login page

  function changePage(page) {
    chrome.storage.local.get({
      last_page: "medialist",
      access_token: ""
    }, value => {
      let lastView = document.getElementById("viewport-" + currentPage);
      if (lastView)
        lastView.style.display = "none";
      let showPage = value.access_token === "" ? currentPage = "login" : currentPage = (page ? page : value.last_page);
      document.getElementById("viewport-" + showPage).style.display = "initial";
    });
  }
})
