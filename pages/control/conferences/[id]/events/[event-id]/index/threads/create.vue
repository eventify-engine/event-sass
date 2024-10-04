<script setup lang="ts">
import type ConferenceResource from "~/resources/ConferenceResource";
import {type InferType, object, string} from "yup";
import type {Form, FormSubmitEvent} from "#ui/types";
import type EventResource from "~/resources/EventResource";
import ThreadRepository from "~/repos/ThreadRepository";

const props = defineProps<{
    conference: ConferenceResource,
    event: EventResource,
    refresh: () => Promise<void>
}>();

const state = ref({
    name: ''
});

const repo    = new ThreadRepository(props.conference.id, props.event.id);
const form    = ref<Form<Schema>>();
const loading = ref<boolean>(false);
const toast   = useToast();

const schema = object({
    name: string().required().max(50).label('Name')
});

type Schema = InferType<typeof schema>;

async function submit(event: FormSubmitEvent<Schema>) {
    if (!form.value)
        return;

    form.value.clear();
    loading.value = true;

    try {
        const response = await repo.store({
            id: 0,
            ...state.value
        });

        await navigateTo(`/control/conferences/${props.conference.id}/events/${props.event.id}/threads/${response.data.id}`);
    } catch (e: any) {
        if (e.statusCode === 422) {
            form.value.setErrors(Object.keys(e.data.errors).map((key: string) => ({
                message: e.data.errors[key].join('. '),
                path   : key
            })));
        } else {
            toast.add({
                title      : 'Whoops',
                description: e.statusCode === 500 ? 'Something broke on the server' : e.message,
                color      : 'red',
                icon       : 'i-heroicons-exclamation-circle-16-solid'
            });
        }
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <Head>
        <title>{{ `Create thread // Event #${event.id} // Conference #${conference.id} // Eventify` }}</title>
    </Head>

    <div>
        <UForm ref="form" :state="state" :schema="schema" @submit="submit">
            <UCard class="w-[400px]">
                <template #header>
                    <div class="flex items-center gap-3">
                        <UButton icon="i-heroicons-arrow-left-16-solid"
                                 :padded="false"
                                 square
                                 variant="link"
                                 color="gray"
                                 size="xl"
                                 class="mt-0.5"
                                 :to="`/control/conferences/${conference.id}/events/${event.id}/threads`"/>

                        <h3 class="text-xl font-semibold">Create thread</h3>
                    </div>
                </template>

                <div class="flex flex-col gap-5">
                    <UFormGroup label="Name" name="name" size="xl" required>
                        <UInput placeholder="How people lie to each other" v-model="state.name"/>
                    </UFormGroup>

                    <UButton type="submit"
                             label="Done"
                             icon="i-heroicons-check"
                             size="xl"
                             :loading="loading"/>
                </div>
            </UCard>
        </UForm>
    </div>
</template>

<style scoped>

</style>