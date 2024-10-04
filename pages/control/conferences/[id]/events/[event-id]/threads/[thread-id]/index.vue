<script setup lang="ts">
import EventRepository from "~/repos/EventRepository";
import ConferenceRepository from "~/repos/ConferenceRepository";
import ThreadRepository from "~/repos/ThreadRepository";

definePageMeta({
    layout: 'control'
});

const route = useRoute();
const id    = parseInt(route.params.id as string);
const repo  = new ConferenceRepository();

const {data: conference} = await repo.show(id);

if (!conference.value)
    await navigateTo('/control');

const eventId   = parseInt(route.params.eventid as string);
const eventRepo = new EventRepository(conference.value?.data.id ?? 0);

const {data: event} = await eventRepo.show(eventId);

if (!event.value)
    await navigateTo(`/control/conferences/${conference.value?.data.id}/events`);

const threadId   = parseInt(route.params.threadid as string);
const threadRepo = new ThreadRepository(conference.value?.data.id ?? 0, event.value?.data.id ?? 0);

const {data: thread, refresh} = await threadRepo.show(threadId);

if (!thread.value)
    await navigateTo(`/control/conferences/${conference.value?.data.id}/events/${event.value?.data.id}/threads`);

const breadcrumb = computed(() => [{
    label: `Conference #${id}`,
    to   : `/control/conferences/${id}`
}, {
    label: `Event #${eventId}`,
    to : `/control/conferences/${id}/events/${eventId}`
}, {
    label: `Thread #${threadId}`
}]);

const links = computed(() => [{
    label: 'Thread',
    to: `/control/conferences/${id}/events/${eventId}/threads/${threadId}`
}]);
</script>

<template>
    <UContainer class="w-full py-10">
        <div>
            <div class="flex flex-col gap-8">
                <div class="flex items-center gap-4">
                    <UButton icon="i-heroicons-arrow-left-16-solid"
                             :padded="false"
                             square
                             variant="link"
                             color="gray"
                             size="xl"
                             class="mt-0.5"
                             :to="`/control/conferences/${id}/events/${eventId}/threads`"/>

                    <div>
                        <UBreadcrumb :links="breadcrumb"/>
                        <h1 class="text-2xl font-semibold leading-5">{{ thread?.data.name }}</h1>
                    </div>
                </div>

                <UDivider/>

                <div class="flex gap-10">
                    <div class="grow w-0">
                        <ThreadSequenceEditor/>
                    </div>

                    <UCard class="w-[400px] shrink-0" :ui="{header: {padding: 'py-0 px-3 sm:px-3'}}">
                        <template #header>
                            <UHorizontalNavigation :links="links"/>
                        </template>

                        <NuxtPage :conference="conference?.data"
                                  :event="event?.data"
                                  :thread="thread?.data"
                                  :refresh="refresh"/>
                    </UCard>
                </div>
            </div>
        </div>
    </UContainer>
</template>

<style scoped>

</style>