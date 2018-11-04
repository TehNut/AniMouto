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
    icon: "settings_ethernet"
  },
  settings: {
    id: "settings",
    icon: "settings"
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
      let showPage = value.access_token === "" ? currentPage = "login" : currentPage = (page ? page : value.last_page);
      document.getElementById("viewport").src = "./html/" + showPage + ".html";
      return showPage !== "login";
    });
  }

})
