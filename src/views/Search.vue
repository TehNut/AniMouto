<template>
  <div class="search-container">
    <div class="options">
      <div class="input-container">
        <input 
          type="text" 
          placeholder="Search AniList..." 
          autocomplete="off"
          spellcheck="false"
          ref="searchBar"
          v-model.lazy.trim="searchValue"
        />
      </div>
      <div class="filters">
        <div class="switcher">
          <span class="switcher-option no-select" :class="{ selected: searchType === 'ANY' }" style="cursor:pointer" @click="searchType = 'ANY'">All</span>
          <span class="switcher-option no-select" :class="{ selected: searchType === 'ANIME' }" style="cursor:pointer" @click="searchType = 'ANIME'">Anime</span>
          <span class="switcher-option no-select" :class="{ selected: searchType === 'MANGA' }" style="cursor:pointer" @click="searchType = 'MANGA'">Manga</span>
          <span class="switcher-option no-select" :class="{ selected: searchType === 'NOVEL' }" style="cursor:pointer" @click="searchType = 'NOVEL'">Novel</span>
        </div>
        <Checkbox v-model="adult">Hentai</Checkbox>
      </div>
    </div>
    <div v-if="!$apollo.queries.results.loading">
      <Section title="Anime" v-if="animeResults.length > 0" class="result-section">
        <template #content>
          <SearchResult
            v-for="media in animeResults"
            :key="media.id"
            :media="media"
          />
        </template>
      </Section>
      <Section title="Manga" v-if="mangaResults.length > 0" class="result-section">
        <template #content>
          <SearchResult
            v-for="media in mangaResults"
            :key="media.id"
            :media="media"
          />
        </template>
      </Section>
      <Section title="Novels" v-if="novelResults.length > 0" class="result-section">
        <template #content>
          <SearchResult
            v-for="media in novelResults"
            :key="media.id"
            :media="media"
          />
        </template>
      </Section>
      <div class="search-icon" v-if="!results || results.length === 0">
        <fa-icon icon="search" />
      </div>
    </div>
    <Loader v-else />
  </div>  
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import gql from "graphql-tag";
import Checkbox from "@/components/form/Checkbox.vue";
import Button from "@/components/Button.vue";
import Section from "@/components/Section.vue";
import SearchResult from "@/components/SearchResult.vue";
import Loader from "@/components/Loader.vue";
import { MediaPage, Media } from "@/models/SearchResult";

@Component({
  components: {
    Button,
    Checkbox,
    Section,
    Loader,
    SearchResult
  },
  apollo: {
    results: {
      query: gql`
        query($search: String!, $adult: Boolean!, $type: MediaType, $format: [MediaFormat!]) {
          results: Page {
            media(search: $search, type: $type, format_in: $format, isAdult: $adult) {
              id
              title {
                userPreferred
              }
              coverImage {
                medium
                color
              }
              mediaListEntry {
                id
                status
              }
              status
              type
              format
              siteUrl
            }
          }
        }
      `,
      variables() {
        return {
          search: this.searchValue,
          adult: this.adult,
          type: this.searchType === "ANY" ? undefined : this.searchType === "ANIME" ? "ANIME" : "MANGA",
          format: this.searchType === "ANY" ? undefined : this.searchType === "MANGA" ? [ "MANGA", "ONE_SHOT" ] : this.searchType === "NOVEL" ? [ "NOVEL" ] : undefined
        }
      },
      skip() {
        return this.searchValue.length === 0;
      }
    }
  }
})
export default class extends Vue {
  searchValue: string = "";
  searchType: "ANY" | "ANIME" | "MANGA" | "NOVEL" = "ANY";
  adult: boolean = false;
  results!: MediaPage;

  get animeResults(): Media[] {
    return this.results ? this.results.media.filter(m => m.type === "ANIME") : [];
  }

  get mangaResults(): Media[] {
    return this.results ? this.results.media.filter(m => m.type === "MANGA" && (m.format === "MANGA" || m.format === "ONE_SHOT")) : [];
  }

  get novelResults(): Media[] {
    return this.results ? this.results.media.filter(m => m.type === "MANGA" && m.format === "NOVEL") : [];
  }

  mounted() {
    (this.$refs.searchBar as HTMLInputElement).focus();
  }
}
</script>

<style>
.search-container {
  position: relative;
}

.search-icon {
  font-size: 150px;
  position: absolute;
  text-align: center;
  width: 100%;
  top: 120px;
  color: rgba(var(--color-text), 0.5);
}

.options {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 75%;
  margin: 0 auto 20px auto;
}

.filters {
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-top: 16px;
}

.input-container {
  background: rgb(var(--color-foreground));
  display: flex;
  width: 100%;
  height: 35px;
  border-radius: 4px;
}

.input-container input {
  background: rgb(var(--color-foreground));
  color: rgb(var(--color-text));
  width: 95%;
  border: none;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  padding: 5px 8px 5px 8px;
}

.input-container input::placeholder {
  color: rgba(var(--color-text-lighter), 0.8);
}

.input-container input:focus {
  outline: none;
}

.switcher {
  margin-right: 10px;
  font-size: small;
  background-color: rgba(var(--color-foreground), 0.8);
  display: flex;
  justify-content: space-around;
  border-radius: 4px;
  width: 220px;
  height: 25px;
  text-align: center;
  border: solid 1px rgba(var(--color-text), 0.4);
}

.switcher-option {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25%;
  padding: 3px;
  background-color: rgba(var(--color-foreground), 0.8);
  transition: .2s;
  border-radius: 4px;
}

.switcher-option:hover:not(.selected) {
  background-color: rgba(var(--color-accent), 0.3);
}

.selected {
  background-color: rgb(var(--color-accent));
  color: rgb(var(--color-text-bright));
}

.result-section {
  padding: 10px 0;
}
</style>