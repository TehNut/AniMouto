document.addEventListener("DOMContentLoaded", e => {
  chrome.storage.local.get({
    access_token: ""
  }, value => {
    if (value.access_token !== "") {
      beginNotifications(value.access_token);
      document.getElementById("refresh-button").addEventListener("click", () => beginNotifications(value.access_token));
      document.getElementById("view-more-button").addEventListener("click", () => window.open("https://anilist.co/notifications"));
    }
  });
});

function beginNotifications(token) {
  let container = document.getElementById("container");
  while (container.firstChild)
    container.removeChild(container.firstChild);

  container.insertAdjacentHTML("beforeend", "<h2 id='loading' class='section-title ellipsis' style='padding-left:10px'>Loading</h2>");
  anilistCall(notificationQuery, {}, token)
    .then(res => res.json())
    .then(res => res.data.Page.notifications)
    .then(res => {
      container.removeChild(container.firstChild);
      for (notification in res) {
        notification = res[notification];

        let newSection = "";
        if (notification.__typename.startsWith("Activity") || notification.__typename === "FollowingNotification")
          newSection = getActivityEntry(notification);
        else if (notification.__typename === "AiringNotification")
          newSection = getAiringEntry(notification);
        else if (notification.__typename.startsWith("ThreadCommentSubscribedNotification"))
          newSection = getThreadEntry(notification);

        container.insertAdjacentHTML("beforeend", newSection);
      }
    });
}

function getActivityEntry(notification) {
  let unread = false;
  let newSection = notificationSection
    .replace("#{user_link}", notification.user.url)
    .replace("#{unread}", unread ? "unread" : "")
    .replace("#{user_avatar}", notification.user.img.large)
    .replace("#{activity_link}", notification.activity ? notification.activity.url : notification.user.url)
    .replace("#{activity_message}", "<span class='name'>" + notification.user.name + "</span>" + notification.context)
    .replace("#{activity_time}", parseTime(Math.abs(notification.createdAt - Date.now() / 1000)));

  return newSection;
}

function getAiringEntry(notification) {
  let unread = false;
  let newSection = notificationSection
    .replace("#{user_link}", notification.media.url)
    .replace("#{unread}", unread ? "unread" : "")
    .replace("#{user_avatar}", notification.media.img.large)
    .replace("#{activity_link}", notification.media.url)
    .replace("#{activity_message}", notification.contexts[0] + notification.episode + notification.contexts[1] + "<span class='name'>" + notification.media.title.userPreferred + "</span>" + notification.contexts[2])
    .replace("#{activity_time}", parseTime(Math.abs(notification.createdAt - Date.now() / 1000)));

  return newSection;
}

function getThreadEntry(notification) {
  let unread = false;
  let newSection = notificationSection
    .replace("#{user_link}", notification.user.url)
    .replace("#{unread}", unread ? "unread" : "")
    .replace("#{user_avatar}", notification.user.img.large)
    .replace("#{activity_link}", notification.thread.url)
    .replace("#{activity_message}", "<span class='name'>" + notification.user.name + "</span>" + notification.context + "<span class='name'>" + notification.thread.title + "</span>")
    .replace("#{activity_time}", parseTime(Math.abs(notification.createdAt - Date.now() / 1000)));

  return newSection;
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

  return ret;
}

const notificationSection = `
  <div class="section notification #{unread}">
    <a href="#{user_link}" target="_blank"><img class="avatar" src="#{user_avatar}" /></a>
    <a class="notification-body" href="#{activity_link}" target="_blank">#{activity_message}</a>
    <span class="notification-time">#{activity_time}</span>
  </div>
`
