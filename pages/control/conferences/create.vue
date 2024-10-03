<script setup lang="ts">
import {type InferType, object, string} from "yup";
import type {Form, FormSubmitEvent} from "#ui/types";
import ConferenceRepository from "~/repos/ConferenceRepository";

definePageMeta({
    layout: 'control'
});

const state = ref({
    name       : '',
    host_prefix: ''
});

const repo    = new ConferenceRepository();
const form    = ref<Form<Schema>>();
const loading = ref<boolean>(false);
const toast   = useToast();

watch(() => state.value.name, (value, oldValue) => {
    function transform(input: string): string {
        return input.toLowerCase()
                    .replaceAll(/ /g, '-')
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
        const response = await repo.store({
            id: 0,
            ...state.value
        });

        await navigateTo(`/control/conferences/${response.data.id}`);
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
        <title>Create conference // Eventify</title>
    </Head>

    <div class="h-full py-10">
        <UForm ref="form" :state="state" :schema="schema" @submit="submit">
            <UCard class="w-96">
                <template #header>
                    <div class="flex items-center gap-3">
                        <UButton icon="i-heroicons-arrow-left-16-solid"
                                 :padded="false"
                                 square
                                 variant="link"
                                 color="gray"
                                 size="xl"
                                 class="mt-0.5"
                                 to="/control"/>
                        <h3 class="text-xl font-semibold">Create conference</h3>
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
                            <span class="block truncate">{{ `${state.host_prefix}.event.vrkitty.ru` }}</span>
                        </template>

                        <UInput placeholder="banana"
                                v-model="state.host_prefix"/>
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