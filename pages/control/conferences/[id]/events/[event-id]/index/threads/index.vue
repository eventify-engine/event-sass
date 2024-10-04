<script setup lang="ts">
import EventRepository from "~/repos/EventRepository";
import type ConferenceResource from "~/resources/ConferenceResource";
import type EventResource from "~/resources/EventResource";
import ThreadRepository from "~/repos/ThreadRepository";

const props = defineProps<{
    conference: ConferenceResource,
    event: EventResource,
    refresh: () => Promise<void>
}>();

const route  = useRoute();
const repo   = new ThreadRepository(props.conference.id, props.event.id);
const search = ref<string>(route.query.search as string ?? '');

const {data: threads} = await repo.list(() => ({search: search.value}));

watch(search, value => navigateTo('?' + querify({search: value}).toString()));
</script>

<template>
    <Head>
        <title>{{ `Threads // Event #${event.id} // Conference #${conference.id} // Eventify` }}</title>
    </Head>

    <div v-if="threads?.total == 0" class="w-[400px] text-center flex flex-col gap-5">
        <h3 class="text-4xl font-semibold">No threads</h3>

        <div>
            <UButton color="gray"
                     label="New thread"
                     icon="i-heroicons-plus"
                     size="xl"
                     :to="`/control/conferences/${conference.id}/events/${event.id}/threads/create`"/>
        </div>
    </div>

    <div v-else class="w-[400px] flex flex-col gap-5">
        <UCard>
            <div class="flex items-center gap-5">
                <UInput size="xl"
                        class="grow"
                        icon="i-heroicons-magnifying-glass"
                        placeholder="Search..."
                        v-model="search"/>

                <UTooltip text="New event">
                    <UButton color="gray"
                             icon="i-heroicons-plus"
                             size="xl"
                             :to="`/control/conferences/${conference.id}/events/${event.id}/threads/create`"/>
                </UTooltip>
            </div>
        </UCard>

        <div v-for="thread in threads?.data ?? []" :key="thread.id">
            <NuxtLink :to="`/control/conferences/${conference.id}/events/${event.id}/threads/${thread.id}`">
                <UCard class="hover:bg-gray-100" :ui="{body: {padding: 'sm:px-6 sm:py-4'}}">
                    <div class="flex justify-between items-center gap-5">
                        <div>
                            <span class="text-xs">Thread #{{ thread.id }}</span>
                            <h5 class="text-lg font-semibold">{{ thread.name }}</h5>
                        </div>

                        <UButton icon="i-heroicons-arrow-right"
                                 color="gray"
                                 square
                                 size="xl"
                                 :ui="{rounded: 'rounded-full'}"/>
                    </div>
                </UCard>
            </NuxtLink>
        </div>
    </div>
</template>

<style scoped>

</style>