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
const showHtml = `
  <a id="#{id}" href="#{site_url}" target="_blank">
  	<div class="cover" style="background-image: url('#{img}');">
  		<div class="cover-overlay #{is_behind}" style="display: #{is_airing};">
  			#{content}
  		</div>
  	</div>
  </a>
`;
