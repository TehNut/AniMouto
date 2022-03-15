<script lang="ts">
  import type { OperationStore } from "@urql/svelte";
  import Icon from "svelte-fa";
  import { faLink, faInfoCircle, faComments, faTv } from "@fortawesome/free-solid-svg-icons";
  import type { MediaResult } from "$lib/graphql";
  import Section from "$lib/components/Section.svelte";
  import Tooltip from "$lib/components/Tooltip.svelte";
  import { textify } from "$lib/util";

  export let media: OperationStore<{ Media: MediaResult }>;

  const languageCodes: Record<string, string> = {
    "Japanese": "JP",
    "Chinese": "CN",
    "Korean": "KR",
    "Spanish": "ES",
    "Portuguese": "PT",
    "Italian": "IT",
    "French": "FR",
    "German": "DE",
    "Thai": "TH",
    "Vietnamese": "VN",
  };
</script>

{#if $media.data.Media.description}
  <Section title="Description" maxContentHeight={400}>
    {@html $media.data.Media.description.replace(/<br><br \/>/g, '<br>').replace(/\\n/g, '')}
  </Section>
{/if}
{#if $media.data.Media.characters.edges.length > 0}
  <Section>
    <a class="hover:text-variable transition-colors" href="{$media.data.Media.siteUrl}/characters" target="_blank" slot="title">
      Characters
    </a>
    <div class="grid grid-cols-6 gap-2">
      {#each $media.data.Media.characters.edges as character}
        <Tooltip placement="right">
          <a href={character.node.siteUrl} target="_blank">
            <div class="aspect-[3/4] bg-cover bg-center rounded-md" style="background-image:url({character.node.image.large})" />
          </a>
          <div class="flex flex-col justify-between" slot="content">
            <h3 class="text-base font-semibold">{character.node.name.userPreferred}</h3>
            <span>{textify(character.role)}</span>
          </div>
        </Tooltip>
      {/each}
      {#if $media.data.Media.characters.pageInfo.hasNextPage}
        <a class="col-span-full text-text-300 hover:text-variable transition-colors text-center text-xs -mb-2" href="{$media.data.Media.siteUrl}/characters" target="_blank">
          See more on AniList
        </a>
      {/if}
    </div>
  </Section>
{/if}
{#if $media.data.Media.staff.edges.length > 0}
  <Section>
    <a class="hover:text-variable transition-colors" href="{$media.data.Media.siteUrl}/staff" target="_blank" slot="title">
      Staff
    </a>
    <div class="grid grid-cols-6 gap-2">
      {#each $media.data.Media.staff.edges as staff}
        <Tooltip placement="right">
          <a href={staff.node.siteUrl} target="_blank">
            <div class="aspect-[3/4] bg-cover bg-center rounded-md" style="background-image:url({staff.node.image.large})" />
          </a>
          <div class="flex flex-col justify-between" slot="content">
            <h3 class="text-base font-semibold">{staff.node.name.userPreferred}</h3>
            <span>{staff.role.replace("_", "")}</span>
          </div>
        </Tooltip>
      {/each}
      {#if $media.data.Media.staff.pageInfo.hasNextPage}
        <a class="col-span-full text-text-300 hover:text-variable transition-colors text-center text-xs -mb-2" href="{$media.data.Media.siteUrl}/staff" target="_blank">
          See more on AniList
        </a>
      {/if}
    </div>
  </Section>
{/if}
{#if $media.data.Media.externalLinks.length > 0}
  <Section title="External & Streaming Links" raise={false}>
    <div class="grid grid-cols-2 gap-x-4 gap-y-2">
      {#each $media.data.Media.externalLinks.sort((a, b) => a.type.localeCompare(b.type) || a.site.localeCompare(b.site)) as link}
        <a href={link.url} target="_blank" style="--color-variable:{link.color ? link.color : "#0C65A6"}">
          <div class="relative h-8 p-1 flex bg-foreground {link.color ? "hover:bg-variable-hex hover:text-white bg-opacity-90" : "hover:text-accent"} items-center rounded-md overflow-hidden transition-all">
            <div class="h-full p-1 bg-variable-hex text-white rounded-sm">
              {#if link.icon}
                <img src={link.icon} alt="External link icon" class="h-full aspect-square">
              {:else}
                <Icon icon={faLink} />
              {/if}
            </div>
            <h3 class="ml-2 font-semibold">{link.site}</h3>
            {#if link.language}
              <span class="ml-2 text-xs font-medium">{languageCodes[link.language] || ""}</span>
            {/if}
            <Icon class="absolute right-4" icon={link.type === "INFO" ? faInfoCircle : link.type === "STREAMING" ? faTv : faComments} />
          </div>
        </a>
      {/each}
    </div>
  </Section>
{/if}    