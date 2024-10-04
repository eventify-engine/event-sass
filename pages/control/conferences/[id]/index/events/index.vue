<script setup lang="ts">
import EventRepository from "~/repos/EventRepository";
import type ConferenceResource from "~/resources/ConferenceResource";

const props = defineProps<{
    conference: ConferenceResource,
    refresh: () => Promise<void>
}>();

const route   = useRoute();
const repo    = new EventRepository(props.conference.id);
const search  = ref<string>(route.query.search as string ?? '');

const {data: events} = await repo.list(() => ({search: search.value}));

watch(search, value => navigateTo('?' + querify({search: value}).toString()));
</script>

<template>
    <Head>
        <title>{{ `Events // Conference #${conference.id} // Eventify` }}</title>
    </Head>

    <div class="w-[400px] flex flex-col gap-5">
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
                             :to="`/control/conferences/${conference.id}/events/create`"/>
                </UTooltip>
            </div>
        </UCard>

        <div v-for="event in events?.data ?? []" :key="event.id">
            <NuxtLink :to="`/control/conferences/${conference.id}/events/${event.id}`">
                <UCard class="hover:bg-gray-100" :ui="{body: {padding: 'sm:px-6 sm:py-4'}}">
                    <div class="flex justify-between items-center gap-5">
                        <div>
                            <span class="text-xs">Event #{{ event.id }}</span>
                            <h5 class="text-lg font-semibold">{{ event.name }}</h5>
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