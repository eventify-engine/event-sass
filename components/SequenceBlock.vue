<script setup lang="ts">
const props = defineProps<{
    block: any,
    isFirst: boolean
}>();

const emit = defineEmits<{
    (e: 'outVector', value: number): void,
    (e: 'outVectorStart'): void
}>();

const prevBlockStopped = defineModel<boolean>('prevBlockStopped');

const {x: mouseX} = useMouse();

const resize     = ref<boolean>(false);
const startX     = ref<number>(0);
const startWidth = ref<number>(0);
const alt        = ref<boolean>(false);
const {pressed}  = useMousePressed();

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

    let vector = alt.value ? altVectorX.value : vectorX.value;

    if (!prevBlockStopped.value)
        props.block.width = Math.max(10, snapToGrid(vector + startWidth.value, 10));

    if (alt.value && props.block.width != 10)
        emit('outVector', vectorX.value);
});

watch(pressed, value => {
    if (value)
        return;

    resize.value = false;
    alt.value    = false;
});

function startLeftResize() {
    if (props.isFirst)
        return;

    resize.value = true;
    alt.value    = true;
}
</script>

<template>
    <div :draggable="!resize"
         :style="`width: ${block.width}px;`"
         :class="`${block.color} ${resize ? 'cursor-e-resize' : 'cursor-grab'}`"
         class="group h-16 flex items-center justify-between shrink-0 border-2 border-gray-400/20 rounded-lg relative hover:border-gray-800/20">
        <div class="w-[4px] h-16 cursor-e-resize absolute -top-0.5 -start-0.5 z-10"
             :class="{'group-hover:opacity-0': isFirst}"
             @mousedown="startLeftResize">
        </div>

        <div class="w-full h-full flex items-center justify-center grow">
        </div>

        <div class="w-[4px] h-16 cursor-e-resize absolute -top-0.5 -end-0.5 z-10"
             @mousedown="resize = true">
        </div>
    </div>
</template>

<style scoped>

</style>