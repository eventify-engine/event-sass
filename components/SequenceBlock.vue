<script setup lang="ts">
const props = defineProps<{
    block: any
}>();

const emit = defineEmits<{
    (e: 'outVector', value: number): void,
    (e: 'outVectorStart'): void
}>();

const {x: mouseX} = useMouse();

const resize     = ref<boolean>(false);
const startX     = ref<number>(0);
const startWidth = ref<number>(0);
const alt        = ref<boolean>(false);

const vectorX    = computed(() => mouseX.value - startX.value);
const altVectorX = computed(() => startX.value - mouseX.value);

watch(resize, value => {
    if (!value)
        return;

    startX.value     = mouseX.value;
    startWidth.value = props.block.width;
    emit('outVectorStart');
});

watch(mouseX, value => {
    if (!resize.value)
        return;

    props.block.width = (alt.value ? altVectorX.value : vectorX.value) + startWidth.value;

    if (alt.value)
        emit('outVector', vectorX.value);
});
</script>

<template>
    <div :draggable="!resize"
         :style="`width: ${block.width}px;`"
         :class="`${block.color}`"
         class="group">
        <div class="opacity-0 group-hover:opacity-100 hover:bg-transparent/10 h-full flex items-center shrink-0 px-1"
             @mousedown="resize = true; alt = true;"
             @mouseup="resize = false; alt = false;"
             @mouseleave="resize = false; alt = false;">
            <UIcon name="i-heroicons-chevron-left"/>
        </div>

        <div class="w-full h-full flex items-center justify-center grow">
            {{ vectorX }}
        </div>

        <div class="opacity-0 group-hover:opacity-100 hover:bg-transparent/10 h-full flex items-center shrink-0 px-1"
             @mousedown="resize = true"
             @mouseup="resize = false"
             @mouseleave="resize = false">
            <UIcon name="i-heroicons-chevron-right"/>
        </div>
    </div>
</template>

<style scoped>

</style>