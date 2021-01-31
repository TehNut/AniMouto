export default {
  language_name: "English",
  list: {
    section_airing: "Airing",
    section_anime: "Anime in Progress",
    section_manga: "Manga in Progress",
    current_episode: "Ep {episode}",
    behind_count: "{count} episode behind | {count} episodes behind",
    progress: "Progress: {progress} | Progress: {progress}/{count}",
  },
  search: {
    input_placeholder: "Search AniList...",
    filter_all: "All",
    filter_anime: "Anime",
    filter_manga: "Manga",
    filter_novel: "Novel",
    filter_hentai: "Hentai",
    view_site: "View on AniList",
    add_planning: "Add to planning",
    add_current: "Add to current",
    add_repeat: "Add to repeating",
  },
  settings: {
    account: {
      title: "Account",
      logged_in_as: "Logged in as {0}",
      token_expiration: "Your token will expire on {date}. You will need to re-login after this date.",
      btn_update_user: "Update User",
      btn_logout: "Logout",
      revoke_reminder: "Don't forget to {0} after logging out.",
      revoke_reminder_link: "revoke your token"
    },
    theme: {
      title: "Theme",
      primary_colors: "Primary Colors",
      theme_preview: "A",
      accent_color: "Accent Color",
      wide: "Wide"
    },
    notifications: {
      title: "Notifications",
      enable_polling: "Enable Notification Polling",
      polling_interval: "Polling Interval",
      polling_interval_desc: "The number of minutes in between notification checks.",
      desktop_notifications: "Desktop Notifications"
    }
  },
  notifications: {
    title: "Notifications",
    time_since: "{time} ago",
    // Notification contexts
    activity_like: "{user} liked your activity.",
    activity_message: "{user} sent you a message.",
    activity_reply: "{user} replied to your activity.",
    activity_reply_like: "{user} liked your activity reply.",
    activity_reply_subscribed: "{user} replied to an activity you're subscribed to.",
    following: "{user} started following you.",
    airing: "Episode {episode} of {media} aired.",
    related_media_addition: "{media} was recently added to the site.",
    thread_like: "{user} liked your forum thread, {thread}.",
    thread_subscribed: "{user} commented in your subscribed forum thread  {thread}.", 
    thread_comment_like: "{user} liked your comment, in the forum thread {thread}.",
    thread_comment_reply: "{user} replied to your comment, in the forum thread {thread}.",
    thread_comment_mention: "{user} mentioned you, in the forum thread {thread}.",
    unknown_type: "This is an unknown notification type! Please report this so it can be properly supported.",
    // Titles
    new_activity: "New Activity",
    new_message: "New Message",
    new_episode: "New Episode",
    new_relation: "New Related Media",
    new_follower: "New Follower",
    new_forum: "New Forum Activity",
    unknown: "Unknown notification",
  }
}