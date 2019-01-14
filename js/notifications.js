document.addEventListener("DOMContentLoaded", e => {
  chrome.storage.local.get({
    access_token: ""
  }, value => {
    if (value.access_token !== "") {
      beginNotifications(value.access_token);
      document.getElementById("refresh-button").addEventListener("click", () => beginNotifications(value.access_token));
    }

    document.getElementById("view-more-button").addEventListener("click", () => window.open("https://anilist.co/notifications"));
    document.getElementById("mark-read-button").addEventListener("click", () => {
      let unread = document.getElementsByClassName("unread");
      while (unread[0])
        unread[0].classList.remove("unread");
    });
  });
});

function beginNotifications(token) {
  let container = document.getElementById("notification-zone");
  while (container.firstChild)
    container.removeChild(container.firstChild);

  let loadingElement = document.createElement("h2");
  loadingElement.id = "loading";
  loadingElement.classList.add("section-title");
  loadingElement.classList.add("ellipsis");
  loadingElement.style.paddingLeft = "10px";
  loadingElement.innerText = "Loading";
  container.insertAdjacentElement("beforeend", loadingElement);

  fetch("../graphql/notifications.graphql").then(res => res.text()).then(res => {
    chrome.runtime.getBackgroundPage(page => {
      page.queryAL(res, { amount: 25, reset: true }, token)
        .then(res => res.json())
        .then(res => res.data)
        .then(res => {
          container.removeChild(container.firstChild);
          for (index in res.Page.notifications) {
            let notification = res.Page.notifications[index];
            let unread = index < res.Viewer.unreadNotificationCount;
            let newSection;

            if (notification.__typename.startsWith("Activity") || notification.__typename === "FollowingNotification")
              newSection = getActivityEntry(notification, unread);
            else if (notification.__typename === "AiringNotification")
              newSection = getAiringEntry(notification, unread);
            else if (notification.__typename.startsWith("ThreadComment"))
              newSection = getThreadEntry(notification, unread);

            if (newSection) {
              newSection.id = `notification-${index}`;
              container.insertAdjacentElement("beforeend", newSection);

              if (unread)
                document.getElementById("notification-" + index).addEventListener("click", e => e.target.classList.remove("unread"));
            }
          }

          chrome.browserAction.setBadgeText({ text: "" });
          chrome.runtime.sendMessage({ type: "update_notifications", notification_count: 0 });
        });
    });
  });
}

function getActivityEntry(notification, unread) {
  let contextElement = document.createElement("span");
  let nameHighlight = document.createElement("span");
  nameHighlight.classList.add("highlight");
  nameHighlight.innerText = notification.user.name;
  contextElement.appendChild(nameHighlight);
  let firstContext = document.createElement("span");
  firstContext.innerText = notification.context;
  contextElement.appendChild(firstContext);

  return getNotificationElement(
    unread,
    notification.user.url,
    notification.user.img.large,
    notification.activity ? notification.activity.url : notification.user.url,
    contextElement,
    notification.createdAt
  );
}

function getAiringEntry(notification, unread) {
  let contextElement = document.createElement("span");
  let firstContext = document.createElement("span");
  firstContext.innerText = `${notification.contexts[0]}${notification.episode}${notification.contexts[1]}`;
  contextElement.appendChild(firstContext);
  let nameHighlight = document.createElement("span");
  nameHighlight.classList.add("highlight");
  nameHighlight.innerText = notification.media.title.userPreferred;
  contextElement.appendChild(nameHighlight);
  let secondContext = document.createElement("span");
  secondContext.innerText += notification.contexts[2];
  contextElement.appendChild(secondContext);

  return getNotificationElement(
    unread,
    notification.media.url,
    notification.media.img.large,
    notification.media.url,
    contextElement,
    notification.createdAt
  );
}

function getThreadEntry(notification, unread) {
  let contextElement = document.createElement("span");
  let nameHighlight = document.createElement("span");
  nameHighlight.classList.add("highlight");
  nameHighlight.innerText = notification.user.name;
  contextElement.appendChild(nameHighlight);

  let firstContext = document.createElement("span");
  firstContext.innerText = notification.context;
  contextElement.appendChild(firstContext);

  let titleHighlight = document.createElement("span");
  titleHighlight.classList.add("highlight");
  titleHighlight.innerText = notification.thread.title;
  contextElement.appendChild(titleHighlight);

  return getNotificationElement(
    unread,
    notification.user.url,
    notification.user.img.large,
    `${notification.thread.url}/comment/${notification.commentId}`,
    contextElement,
    notification.createdAt
  );
}

function getNotificationElement(unread, badgeLink, userAvatar, activityLink, activityElement, createdAt) {
  let notificationDiv = document.createElement("div");
  notificationDiv.classList.add("section");
  notificationDiv.classList.add("notification");
  if (unread)
    notificationDiv.classList.add("unread");

  let userLink = document.createElement("a");
  userLink.href = badgeLink;
  userLink.target = "_blank";
  userImage = document.createElement("img");
  userImage.classList.add("avatar");
  userImage.classList.add("notification-icon");
  userImage.classList.add("no-select");
  userImage.src = userAvatar;
  userLink.appendChild(userImage);
  notificationDiv.appendChild(userLink);

  let notificationLink = document.createElement("a");
  notificationLink.classList.add("notification-body");
  notificationLink.href = activityLink;
  notificationLink.appendChild(activityElement);
  notificationDiv.appendChild(notificationLink);

  let timeElement = document.createElement("span");
  timeElement.classList.add("notification-time");
  timeElement.innerText = parseTime(Math.abs(createdAt - Date.now() / 1000));
  notificationDiv.appendChild(timeElement);

  return notificationDiv;
}

function parseTime(secs) {
  let seconds = parseInt(secs, 10);

  let weeks = Math.floor(seconds / (3600 * 24 * 7));
  seconds -= weeks * 3600 * 24 * 7;
  let days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  let hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  let ret = "";
  if (weeks > 0)
    return weeks + "w";
  if (days > 0)
    return days + "d";
  if (hours > 0)
    return (ret.length == 0 ? "" : " ") + hours + "h";
  if (minutes > 0)
    return (ret.length == 0 ? "" : " ") + minutes + "m"

  return ret === "" ? "<1m" : ret;
}
