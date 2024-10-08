<script setup lang="ts">
import ConferenceRepository from "~/repos/ConferenceRepository";

definePageMeta({
    layout: 'control'
});

const route = useRoute();
const id    = parseInt(route.params.id as string);
const repo  = new ConferenceRepository();

const {data: conference, refresh} = await repo.show(id);

if (!conference.value)
    await navigateTo('/control');

const nav = computed(() => [
    {
        label : 'Conference',
        icon  : 'i-heroicons-home',
        to    : `/control/conferences/${id}`,
        active: route.path == `/control/conferences/${id}`
    },
    {
        label : 'Events',
        icon  : 'i-heroicons-fire',
        to    : `/control/conferences/${id}/events`,
        active: route.path.startsWith(`/control/conferences/${id}/events`)
    }
]);

const navUi = {
    base   : 'gap-2.5',
    size   : 'text-base',
    padding: 'px-3 py-2.5',
    icon   : {
        base: 'w-6 h-6'
    }
};

const breadcrumb = computed(() => [{
    label: `Conference #${id}`
}]);
</script>

<template>
    <div class="h-full py-10">
        <div class="flex flex-col gap-8">
            <div class="flex items-center gap-4">
                <UButton icon="i-heroicons-arrow-left-16-solid"
                         :padded="false"
                         square
                         variant="link"
                         color="gray"
                         size="xl"
                         class="mt-0.5"
                         to="/control"/>

                <div>
                    <UBreadcrumb :links="breadcrumb"/>
                    <h1 class="text-2xl font-semibold leading-5">{{ conference?.data.name }}</h1>
                </div>
            </div>

            <UDivider/>

            <div class="flex gap-10">
                <UCard class="h-full" :ui="{body: {padding: ''}}">
                    <UVerticalNavigation class="w-48" :links="nav" :ui="navUi"/>
                </UCard>

                <NuxtPage :conference="conference?.data" :refresh="refresh"/>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>