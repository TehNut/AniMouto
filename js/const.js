const anilistCall = (query, variables, token) =>
  fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

const mediaListQuery = `
  query ($user: Int) {
    anime: MediaListCollection(userId: $user, status: CURRENT, type: ANIME) {
      ...active
    }
    manga: MediaListCollection(userId: $user, status: CURRENT, type: MANGA) {
      ...active
    }
  }

  fragment active on MediaListCollection {
    lists {
      entries {
        id
        media {
          id
          siteUrl
          title {
            romaji
          }
          coverImage {
            large
          }
          nextAiringEpisode {
            episode
            airingAt
            timeUntilAiring
          }
        }
        progress
        updatedAt
      }
    }
  }
`

const listEntryMutation = `
  mutation UpdateMedia($listId: Int, $progress: Int) {
    SaveMediaListEntry(id: $listId, progress: $progress) {
      id
      progress
    }
  }
`

const notificationQuery = `
{
  Page(perPage: 25) {
    notifications {
      __typename
      ... on ActivityLikeNotification {
        user {
          ...user
        }
        activity {
          ...activity
        }
        context
        createdAt
      }
      ... on ActivityMentionNotification {
        user {
          ...user
        }
        activity {
          ...activity
        }
        context
        createdAt
      }
      ... on ActivityMessageNotification {
        user {
          ...user
        }
        activity: message {
          url: siteUrl
        }
        context
        createdAt
      }
      ... on ActivityReplyLikeNotification {
        user {
          ...user
        }
        activity {
          ...activity
        }
        context
        createdAt
      }
      ... on ActivityReplyNotification {
        user {
          ...user
        }
        activity {
          ...activity
        }
        context
        createdAt
      }
      ... on ActivityLikeNotification {
        user {
          ...user
        }
        activity {
          ...activity
        }
        context
        createdAt
      }
      ... on AiringNotification {
        media {
          ...media
        }
        episode
        contexts
        createdAt
      }
      ... on FollowingNotification {
        user {
          ...user
        }
        context
        createdAt
      }
      ... on ThreadCommentLikeNotification {
        thread {
          ...thread
        }
        user {
          ...user
        }
        context
        createdAt
      }
      ... on ThreadCommentMentionNotification {
        thread {
          ...thread
        }
        user {
          ...user
        }
        context
        createdAt
      }
      ... on ThreadCommentReplyNotification {
        thread {
          ...thread
        }
        user {
          ...user
        }
        context
        createdAt
      }
      ... on ThreadCommentSubscribedNotification {
        thread {
          ...thread
        }
        user {
          ...user
        }
        context
        createdAt
      }
      ... on ThreadCommentLikeNotification {
        thread {
          ...thread
        }
        user {
          ...user
        }
        context
        createdAt
      }
    }
  }
}

fragment media on Media {
  title {
    userPreferred
  }
  img: coverImage {
    large
  }
  url: siteUrl
}

fragment user on User {
  name
  img: avatar {
    large
  }
  url: siteUrl
}

fragment thread on Thread {
  title
  url: siteUrl
}

fragment activity on ActivityUnion {
  __typename
  ... on TextActivity {
    url: siteUrl
  }
  ... on ListActivity {
    url: siteUrl
  }
  ... on MessageActivity {
    url: siteUrl
  }
}
`

const showHtml = `
  <a id="#{id}" href="#{site_url}" target="_blank">
  	<div class="cover" style="background-image: url('#{img}');">
  		<div class="cover-overlay #{is_behind}" style="display: #{is_airing};">
  			#{content}
  		</div>
  	</div>
  </a>
`;
