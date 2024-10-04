<script setup lang="ts">
import {type InferType, object, string} from "yup";
import type {Form, FormSubmitEvent} from "#ui/types";
import type ConferenceResource from "~/resources/ConferenceResource";
import type EventResource from "~/resources/EventResource";
import type ThreadResource from "~/resources/ThreadResource";
import ThreadRepository from "~/repos/ThreadRepository";

const props = defineProps<{
    conference: ConferenceResource,
    event: EventResource,
    thread: ThreadResource,
    refresh: () => Promise<void>
}>();

const repo    = new ThreadRepository(props.conference.id, props.event.id);
const state   = ref<ThreadResource | any>({...props.thread});
const form    = ref<Form<Schema>>();
const loading = ref<boolean>(false);
const toast   = useToast();

watch(() => props.event, value => state.value = {...value});

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
        await repo.update(state.value);
        await props.refresh();
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

const removeModal = ref<boolean>(false);
const removing    = ref<boolean>(false);

async function remove() {
    removing.value = true;

    try {
        await repo.remove(props.thread.id);
        await navigateTo(`/control/conferences/${props.conference.id}/events/${props.event.id}/threads`);
    } catch (e: any) {
        toast.add({
            title      : 'Whoops',
            description: e.statusCode === 500 ? 'Something broke on the server' : e.message,
            color      : 'red',
            icon       : 'i-heroicons-exclamation-circle-16-solid'
        });
    } finally {
        removing.value = false;
    }
}
</script>

<template>
    <Head>
        <title>{{ `Thread #${thread.id} // Event #${event.id} // Conference #${conference.id} // Eventify` }}</title>
    </Head>

    <div>
        <UForm ref="form" :state="state" :schema="schema" @submit="submit">
            <div class="flex flex-col gap-5">
                <UFormGroup label="Name" name="name" size="xl" required>
                    <UInput placeholder="How people lie to each other" v-model="state.name"/>
                </UFormGroup>

                <div class="flex flex-col gap-2.5">
                    <UButton type="submit"
                             label="Done"
                             icon="i-heroicons-check"
                             size="xl"
                             :loading="loading"/>

                    <UButton label="Remove"
                             color="red"
                             icon="i-heroicons-trash"
                             size="xl"
                             @click="removeModal = true"/>
                </div>
            </div>
        </UForm>
    </div>

    <UModal v-model="removeModal">
        <form>
            <UCard :ui="{ring: ''}">
                <template #header>
                    <div class="flex items-center justify-between">
                        <h5 class="font-semibold text-lg">Remove thread</h5>

                        <UButton color="gray"
                                 variant="link"
                                 icon="i-heroicons-x-mark"
                                 size="xl"
                                 :padded="false"
                                 @click="removeModal = false"/>
                    </div>
                </template>

                <p class="font-semibold">Do you really want to delete this thread?</p>
                <p>All thread-related items will be deleted. Statistics will not be available.</p>

                <template #footer>
                    <div class="flex items-center justify-end gap-2.5">
                        <UButton color="red"
                                 label="Confirm"
                                 size="md"
                                 type="submit"
                                 tabindex="1"
                                 :loading="removing"
                                 @click="remove"/>

                        <UButton color="gray"
                                 label="Cancel"
                                 size="md"
                                 @click="removeModal = false"/>
                    </div>
                </template>
            </UCard>
        </form>
    </UModal>
</template>

<style scoped>

</style>