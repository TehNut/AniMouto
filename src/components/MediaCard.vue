<template>
  <a 
    :href="media.siteUrl" 
    target="_blank"
    :style="{
      '--media-color': media.coverImage.color,
      '--popover-width': wide ? '303px' : '210px',
      '--title-clip': behindCount > 0 ? '2' : '5'
    }"
  >
    <div 
      class="media-card"
      :class="{ left: !canFitPopout() }"
      :style="{ backgroundImage: `url(${media.coverImage.large})` }"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
    >
      <transition name="fade">
        <div class="overlay-text" v-if="media.nextAiringEpisode && !hovered">
          {{ $t("list.current_episode", { episode: media.nextAiringEpisode.episode }) }}
          <br>
          {{ timeUntil }}
        </div>
      </transition>

      <transition name="fade">
        <div class="overlay-text" v-if="listEntry && hovered">
          <div class="increment" @click.prevent="incrementProgress()">
            <div>{{ listEntry.progress }} +</div>
          </div>
          <router-link :to="{ name: 'media', params: { id: media.id } }" class="show-info">
            <fa-icon icon="ellipsis-v" />
          </router-link> 
        </div>
      </transition>

      <div class="behind" v-if="behindCount > 0"/>
      <!-- Popover -->
      <transition name="fade">
        <div v-if="hovered" class="media-popover" :class="{ left: !canFitPopout() }">
          <div class="media-popover-container">
            <h1 class="truncate-title">{{ media.title.userPreferred }}</h1>
            <p v-if="behindCount > 0" class="text-error">{{ $tc("list.behind_count", behindCount) }}</p>
          </div>
          <p class="progress">{{ $tc("list.progress", media.chapters || media.episodes || 1, { progress: listEntry.progress }) }}</p>
        </div>
      </transition>
    </div>
  </a>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import gql from "graphql-tag";
import { DocumentNode } from 'graphql';
import { Media } from "@/models/Media";
import { ListEntry, MediaListStatus } from "@/models/ListEntry";
import { parseSeconds, readableTime } from "@/Utils";

const settings = namespace("settings");

@Component
export default class MediaCard extends Vue {
  @settings.Getter
  wide!: boolean;

  @Prop()
  media!: Media;

  @Prop()
  listEntry?: ListEntry;

  @Prop()
  mutationTarget?: { query: DocumentNode, variables: any };

  hovered: boolean = false;

  incrementProgress() {
    if (!this.listEntry)
      return;

    console.log(this.mutationTarget)

    const _self = this;
    this.$apollo.mutate({
      mutation: gql`
        mutation ($listId: Int, $mediaId: Int, $progress: Int, $status: MediaListStatus) {
          SaveMediaListEntry(id: $listId, mediaId: $mediaId, progress: $progress, status: $status) {
            __typename
            id
            progress
            status
          }
        }
      `,
      variables: {
        listId: this.listEntry.id,
        mediaId: this.media.id,
        progress: this.listEntry.progress + 1,
        status: (this.media.episodes || this.media.chapters) && this.listEntry.progress > (this.media.episodes || this.media.chapters || Infinity) ? "COMPLETED" : this.listEntry.status
      },
      optimisticResponse: {
        __typename: "Mutation",
        SaveMediaListEntry: {
          __typename: "MediaList",
          progress: this.listEntry.progress + 1,
          status: (this.media.episodes || this.media.chapters) && this.listEntry.progress > (this.media.episodes || this.media.chapters || Infinity) ? "COMPLETED" : this.listEntry.status
        }
      }
    });
  }

  get behindCount(): number {
    if (!this.listEntry)
      return 0;

    if (this.media.type === "MANGA")
      return 0;

    if (!this.media.nextAiringEpisode)
      return 0;

    return Math.max(0, (this.media.nextAiringEpisode.episode - 1) - this.listEntry.progress);
  }

  get timeUntil() {
    return readableTime(parseSeconds(this.media.nextAiringEpisode.timeUntilAiring, true), { includeWeeks: true });
  }

  canFitPopout(): boolean {
    if (!this.$el)
      return true;

    const popoutWidth = this.wide ? 303 : 210;
    const bounding = this.$el.getBoundingClientRect();
    const parentBounding = this.$parent.$el.getBoundingClientRect();
    return parentBounding.right > bounding.right + popoutWidth
  }
}
</script>

<style>
.media-card {
  position: relative;
  background-size: cover;
  background-position: center;
  background-color: var(--media-color);
  width: 85px;
  height: 115px;
  border-radius: 4px;
}

.media-card:hover:not(.left) {
  border-radius: 4px 0 0 4px;
}

.media-card:hover:not(.left) .behind {
  border-radius: 0 0 0 4px;
}

.media-card:hover .behind {
  border-radius: 0 0 4px 0;
}

.media-card:hover.left {
  border-radius: 0 4px 4px 0;
}

.overlay-text {
  position: absolute;
  display: flex;
  justify-content: center;
  text-align: center;
  bottom: 0;
  width: 100%;
  background: rgba(var(--color-overlay), 0.7);
  color: rgba(var(--color-text-bright), .91);
  padding: 8px 0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.increment {
  width: 40px;
  transition: .2s;
}

.increment:hover {
  font-weight: bold;
  color: rgb(var(--color-accent));
}

.show-info {
  color: inherit;
  position: absolute;
  right: 0;
  width: 20px;
  transition: .2s;
}

.show-info:hover {
  color: rgb(var(--color-accent));
}

.behind {
  position: absolute;
  width: 100%;
  height: 4px;
  background-color: rgb(var(--color-red));
  bottom: 0;
  border-radius: 0 0 4px 4px;
}

.media-popover {
  position: absolute;
  background-color: rgb(var(--color-foreground-blue));
  color: rgb(var(--color-text));
  width: var(--popover-width);
  height: 115px;
  left: 85px;
  z-index: 1;
  pointer-events: none;
}

.media-popover:not(.left) {
  border-radius: 0 4px 4px 0;
}

.media-popover.left {
  left: calc(var(--popover-width) * -1);
  border-radius: 4px 0 0 4px;
}

.media-popover-container {
  position: relative;
  margin: 10px;
}

.media-popover-container h1 {
  font-size: 14px;
}

.media-popover-container .truncate-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--title-clip);
  overflow: hidden;
}

.media-popover .progress {
  position: absolute;
  bottom: 0;
  left: 10px;
}
</style>