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

    <div v-if="conferences?.total == 0" class="flex items-center">
        <ULandingHero title="No conferences"
                      description="Let's make a new one!"
                      :links="[{label: 'New conference', color: 'gray', icon: 'i-heroicons-plus', size: 'xl', to: '/control/conferences/create'}]"/>
    </div>

    <div v-else-if="conferences" class="h-full py-10">
        <div class="w-[400px] flex flex-col gap-5">
            <UCard>
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
            </UCard>

            <div v-for="conference in conferences.data" :key="conference.id">
                <NuxtLink :to="`/control/conferences/${conference.id}`">
                    <UCard class="hover:bg-gray-100" :ui="{body: {padding: 'sm:px-6 sm:py-4'}}">
                        <div class="flex justify-between items-center gap-5">
                            <div>
                                <span class="text-xs">Conference #{{ conference.id }}</span>
                                <h5 class="text-lg font-semibold">{{ conference.name }}</h5>
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
    </div>
</template>

<style scoped>

</style>