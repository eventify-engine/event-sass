<script setup lang="ts">
import ConferenceRepository from "~/repos/ConferenceRepository";
import {type InferType, object, string} from "yup";
import type {Form, FormSubmitEvent} from "#ui/types";
import type ConferenceResource from "~/resources/ConferenceResource";

definePageMeta({
    layout: 'control'
});

const repo = new ConferenceRepository();

const props = defineProps<{
    conference: ConferenceResource,
    refresh: () => Promise<void>
}>();

const state   = ref<ConferenceResource | any>({...props.conference});
const form    = ref<Form<Schema>>();
const loading = ref<boolean>(false);
const toast   = useToast();
const config  = useRuntimeConfig();

watch(() => props.conference, value => state.value = {...value});

watch(() => state.value.name, (value, oldValue) => {
    function transform(input: string): string {
        return input.toLowerCase()
                    .replaceAll(/ /g, '-')
                    .replaceAll(/&/g, 'and')
                    .replaceAll(/[^a-z0-9-]/g, '')
                    .substring(0, 25);
    }

    if (state.value.host_prefix != transform(oldValue))
        return;

    state.value.host_prefix = transform(value);
    schema.validateAt('host_prefix', state.value)
          .then(() => form.value?.clear('host_prefix'))
          .catch((e) => form.value?.setErrors([{message: e.message, path: 'host_prefix'}], 'host_prefix'));
});

const schema = object({
    name       : string().required().max(50).label('Name'),
    host_prefix: string().required().max(25)
                         .matches(/^[a-z0-9-]+$/, 'Host prefix must have only "a-z", "0-9" and "-" characters (in lower case)')
                         .label('Host prefix')
                         .test(
                             'is-unique',
                             'Host prefix must be unique',
                             async (value: string): Promise<boolean> => {
                                 if (!value)
                                     return false;

                                 const response = await repo.hostPrefix(value);

                                 if (props.conference.id === response.data.id)
                                     return true;

                                 return !response.data.id;
                             }
                         )
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
        await repo.remove(props.conference.id);
        await navigateTo('/control');
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
        <title>{{ `Edit data // Conference #${conference.id} // Eventify` }}</title>
    </Head>

    <div>
        <UForm ref="form" :state="state" :schema="schema" @submit="submit">
            <UCard class="w-[400px]">
                <template #header>
                    <div class="flex items-center gap-3">
                        <h3 class="text-xl font-semibold">Edit conference</h3>
                    </div>
                </template>

                <div class="flex flex-col gap-5">
                    <UFormGroup label="Name" name="name" size="xl" required>
                        <UInput placeholder="Amazing banana workouts" v-model="state.name"/>
                    </UFormGroup>

                    <UFormGroup label="Host prefix"
                                name="host_prefix"
                                size="xl"
                                required>
                        <template #help>
                            <span class="block truncate">
                                {{ config.public.userFrontend.replace('*', state.host_prefix) }}
                            </span>
                        </template>

                        <UInput placeholder="banana"
                                v-model="state.host_prefix"/>
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
            </UCard>
        </UForm>
    </div>

    <UModal v-model="removeModal">
        <form>
            <UCard :ui="{ring: ''}">
                <template #header>
                    <div class="flex items-center justify-between">
                        <h5 class="font-semibold text-lg">Remove conference</h5>

                        <UButton color="gray"
                                 variant="link"
                                 icon="i-heroicons-x-mark"
                                 size="xl"
                                 :padded="false"
                                 @click="removeModal = false"/>
                    </div>
                </template>

                <p class="font-semibold">Do you really want to delete this conference?</p>
                <p>All conference-related items will be deleted. Statistics will not be available.</p>

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