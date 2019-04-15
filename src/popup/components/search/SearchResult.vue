<template>
  <div>
    <a :href="result.url" target="_blank">
      <div class="list-entry">
        <img class="entry-image no-select" :src="result.img.large">
        <span class="entry-title">{{ result.title.userPreferred }}</span>
        <span class="entry-icons">
          <i :class="'material-icons entry-icon' + (!result.mediaListEntry || result.mediaListEntry.status === 'PLANNING' ? ' enabled' : '')"
             v-if="result.status !== 'NOT_YET_RELEASED'"
             :title="!result.mediaListEntry || result.mediaListEntry.status === 'PLANNING' ? 'Add to current' : 'Already listed'"
             @click.prevent="handleCurrent(result)"
             ref="current"
          >library_add</i>

          <i :class="'material-icons entry-icon' + (!result.mediaListEntry ? ' enabled' : '')"
             :title="!result.mediaListEntry ? 'Add to planning' : 'Already listed'"
             @click.prevent="handlePlanning(result)"
             ref="planning"
          >library_books</i>
        </span>
      </div>
    </a>
  </div>
</template>

<script>
  import {queryAL} from "../../../assets/js/utils";
  import updateViewingStatus from "../../../assets/graphql/update_viewing_status.graphql";

  export default {
    name: "SearchResults",
    props: [
      "result"
    ],
    methods: {
      handlePlanning(media) {
        if (!this.$refs.planning.classList.contains("enabled"))
          return;

        const _self = this;
        chrome.storage.local.get({ access_token: ""}, value => {
          if (value.access_token === "")
            return;
          queryAL(updateViewingStatus, { mediaId: media.id, status: "PLANNING" }, value.access_token).then(res => {
            setListed(_self.$refs.planning);
          });
        });
      },
      handleCurrent(media) {
        if (!this.$refs.planning.classList.contains("enabled"))
          return;

        const _self = this;
        chrome.storage.local.get({ access_token: ""}, value => {
          if (access_token === "")
            return;
          queryAL(updateViewingStatus, { mediaId: media.id, status: "CURRENT" }, value.access_token).then(res => {
            setListed(_self.$refs.current);
            setListed(_self.$refs.planning);
          });
        });
      }
    }
  }

  function setListed(element) {
    element.title = "Already listed";
    element.classList.remove("enabled");
  }
</script>

<style scoped>
  .list-entry {
    color: rgb(var(--color-text));
    background-color: rgb(var(--color-foreground-blue-dark));
    display: flex;
    border-radius: 5px;
    height: 30px;
    margin-bottom: 5px;
    transition: .3s;
  }

  .list-entry:hover {
    color: rgb(var(--color-accent));
  }

  .entry-image {
    height: inherit;
    padding-right: 5px;
    border-radius: 5px;
  }

  .entry-title {
    display: flex;
    margin-top: auto;
    margin-bottom: auto;
  }

  .entry-icons {
    display: flex;
    margin-left: auto;
    margin-top: auto;
    margin-bottom: auto;
    padding-right: 5px;
  }

  .entry-icon {
    color: rgb(var(--color-red));
    font-size: 16px;
    cursor: not-allowed;
    transition: .3s;
  }

  .enabled {
    color: rgb(var(--color-text));
    cursor: pointer;
  }

  .enabled:hover {
    color: rgb(var(--color-green));
    font-size: 16px;
  }
</style>
