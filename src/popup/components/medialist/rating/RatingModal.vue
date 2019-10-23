<template>
  <div class="modal" @click.self="$emit('clearRating')">
    <div class="section modal-container">
      <img class="media-cover" :src="media.coverImage.large"/>
      <div class="right-container">
        <span class="rating-text">Would you like to rate <span class="highlight" :href="media.siteUrl">{{ media.title.userPreferred }}</span>?</span>
        <div class="rating">
          <RatingSlider
            v-if="format === 'POINT_10' || format === 'POINT_100' || format === 'POINT_10_DECIMAL'"
            @updateScore="score = $event"
          />
          <RatingStar
            v-else-if="format === 'POINT_5'"
            @updateScore="score = $event"
          />
          <RatingSmiley
            v-else-if="format === 'POINT_3'"
            @updateScore="score = $event"
          />
        </div>
        <div class="buttons">
          <div class="button ripple no-select" @click="submitRating">Submit</div>
          <div class="button ripple no-select" @click="$emit('clearRating')" style="background-color:rgb(var(--color-red))">Cancel</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {queryAL} from "../../../../assets/js/utils";
  import ratingQuery from "../../../../assets/graphql/rating_format.graphql";
  import submitRatingQuery from "../../../../assets/graphql/update_progress.graphql";
  import RatingSlider from "./RatingSlider";
  import RatingSmiley from "./RatingSmiley";
  import RatingStar from "./RatingStar";

  export default {
    name: "RatingModal",
    components: {RatingStar, RatingSmiley, RatingSlider},
    data() {
      return {
        format: null,
        score: 0
      }
    },
    props: [
      "media",
      "listId"
    ],
    methods: {
      submitRating() {
        const _self = this;
        if (this.score > 0) {
          this.$browser.storage.local.get().then(v => {
            queryAL(submitRatingQuery, {listId: this.listId, rating: this.score}, v.access_token).then(res => {
              _self.$emit("clearRating")
            });
          });
        }
      }
    },
    created() {
      const _self = this;
      this.$browser.storage.local.get().then(v => {
        queryAL(ratingQuery, {}, v.access_token).then(res => {
          _self.format = res.data.Viewer.mediaListOptions.scoreFormat;
        });
      });
    }
  }
</script>

<style scoped>
  .modal {
    width: calc(100% - 55px);
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    position: fixed;
    left: 55px;
    top: 0;
    z-index: 1;
  }

  .section {
    background-color: rgb(var(--color-background));
  }

  .modal-container {
    width: 80%;
    top: 20%;
    position: relative;
    margin: auto;
    display: flex;
    justify-content: space-evenly;
    box-shadow: 0 2px 33px rgba(0,0,0,.48);
  }

  .media-cover {
    width: 128px;
    border-radius: 5px;
    margin-right: 20px;
  }

  .right-container {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
  }

  .rating-text {
    font-size: large;
  }

  .buttons {
    display: flex;
    justify-content: center;
  }

  .button {
    margin: 0 auto;
  }
</style>
