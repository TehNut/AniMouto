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
  mutation ($ids: [Int], $progress: Int) {
    UpdateMediaListEntries(ids: $ids, progress: $progress) {
      id
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
