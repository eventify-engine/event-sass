<script setup lang="ts">
import ConferenceRepository from "~/repos/ConferenceRepository";

definePageMeta({
    layout: 'control'
});

const route   = useRoute();
const repo    = new ConferenceRepository();
const search  = ref<string>(route.query.search as string ?? '');

const {data: conferences} = await repo.list(() => ({search: search.value}));

watch(search, value => navigateTo('?' + querify({search: value}).toString()));
</script>

<template>
    <Head>
        <title>Control // Eventify</title>
    </Head>

    <div v-if="conferences?.data.length == 0" class="flex items-center">
        <ULandingHero title="No conferences"
                      description="Let's make a new one!"
                      :links="[{label: 'New conference', color: 'gray', icon: 'i-heroicons-plus', size: 'xl', to: '/control/conferences/create'}]"/>
    </div>

    <div v-else-if="conferences" class="h-full py-10">
        <UCard class="w-[400px] overflow-clip" :ui="{body: {padding: ''}}">
            <template #header>
                <div class="flex items-center gap-5">
                    <UInput size="xl"
                            class="grow"
                            icon="i-heroicons-magnifying-glass"
                            placeholder="Search..."
                            v-model="search"/>

                    <UTooltip text="New conference">
                        <UButton color="gray"
                                 icon="i-heroicons-plus"
                                 size="xl"
                                 to="/control/conferences/create"/>
                    </UTooltip>
                </div>
            </template>

            <ul>
                <li v-for="conference in conferences.data" :key="conference.id">
                    <NuxtLink :to="`/control/conferences/${conference.id}`"
                              class="flex gap-2 hover:bg-primary-500 hover:text-gray-50 px-4 sm:px-6 py-2.5 sm:py-3 text-xl">
                        <span>{{ conference.name }}</span>
                    </NuxtLink>
                </li>
            </ul>
        </UCard>
    </div>
</template>

<style scoped>

</style>