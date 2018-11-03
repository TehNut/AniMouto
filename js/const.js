const anilistQuery = `
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
const showHtml = `
  	<div class="cover" style="background-image: url('#{img}');">
  		<div class="cover-overlay" style="display: #{is_airing};">
  			#{content}
  		</div>
  	</div>
`;
