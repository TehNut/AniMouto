<template>
  <div class="result">
    <img class="cover" :src="media.coverImage.medium" :alt="media.title.userPreferred">
    <router-link class="title-wrapper" :to="{ name: 'media', params: { id: media.id } }">
      <div class="title">
        {{ media.title.userPreferred }}
      </div>
    </router-link>
    <div class="buttons">
      <Tooltip
        class="button"
        :content="$t('search.view_site')"
        direction="left"
      >
        <img src="img/anilist.svg" class="anilist-logo" @click="openUrl(media.siteUrl)">
      </Tooltip>
      <Tooltip
        class="button"
        :content="$t('search.add_planning')"
        direction="left"
        v-if="canAddPlanning()"
      >
        <fa-icon @click="setStatus('PLANNING')" icon="notes-medical"/>
      </Tooltip>
      <Tooltip
        class="button"
        :content="$t('search.add_current')"
        direction="left"
        v-if="canAddCurrent()"
      >
        <fa-icon @click="setStatus('CURRENT')" icon="plus"/>
      </Tooltip>
      <Tooltip
        class="button"
        :content="$t('search.add_repeat')"
        direction="left"
        v-if="canRewatch()"
      >
        <fa-icon @click="setStatus('REPEATING')" icon="redo"/>
      </Tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import { Media } from "@/models/SearchResult";
import { Vue, Component, Prop } from "vue-property-decorator";
import gql from "graphql-tag";
import Tooltip from "@/components/Tooltip.vue";

@Component({
  components: {
    Tooltip
  }
})
export default class SearchResult extends Vue {
  @Prop({ required: true })
  media!: Media;

  openUrl(url: string) {
    window.open(url, "_blank");
  }

  async setStatus(status: "CURRENT" | "PLANNING" | "REPEATING") {
    const { data } = await this.$apollo.mutate({
      mutation: gql`
        mutation ($listId: Int, $mediaId: Int, $status: MediaListStatus!) {
          SaveMediaListEntry(id: $listId, mediaId: $mediaId status: $status) {
            id
            status
          }
        }
      `,
      variables: {
        listId: this.media.mediaListEntry ? this.media.mediaListEntry.id : undefined,
        mediaId: this.media.mediaListEntry ? undefined : this.media.id,
        status
      }
    });

    this.media.mediaListEntry = data.SaveMediaListEntry;
  }

  canAddPlanning(): boolean {
    return this.media.mediaListEntry === null;
  }

  canAddCurrent(): boolean {
    if (this.media.status === "NOT_YET_RELEASED")
      return false;
      
    if (!this.media.mediaListEntry)
      return true;
    
    const status = this.media.mediaListEntry.status;
    return ![ "CURRENT", "COMPLETED", "REPEATING" ].includes(status);
  }

  canRewatch(): boolean {
    return this.media.mediaListEntry?.status === "COMPLETED";
  }
}
</script>

<style scoped>
.result {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  margin: 5px 10px;
  border-radius: 4px;
  overflow: hidden;
  background-color: rgb(var(--color-foreground));
}

.cover {
  width: 12%;
  height: 70px;
  object-fit: cover;
}

.title-wrapper {
  display: flex;
  align-items: center;
  width: 68%;
  height: 70px;
  padding: 0 10px;
}

.title-wrapper:hover .title {
  color: rgb(var(--color-accent));
}

.title {
  font-weight: bold;
  letter-spacing: .1px;
  color: rgb(var(--color-text));
  transition: .3s;
}

.buttons {
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  width: 20%;
  font-size: 16px;
}

.button {
  margin: 4px;
  transition: .3s;
}

.button:hover {
  color: rgb(var(--color-accent));
}

.anilist-logo {
  background-color: rgb(var(--color-overlay));
  width: 16px;
  margin-top: 1px;
  border-radius: 4px;
}
</style>