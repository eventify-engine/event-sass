<script setup lang="ts">
const blocks = ref<any[]>([]);

const {next}          = useCycleList(['bg-slate-200', 'bg-amber-200', 'bg-pink-200', 'bg-blue-200', 'bg-red-200', 'bg-teal-200', 'bg-fuchsia-200']);
const {inc: incOrder} = useCounter(0);
const {inc: incId}    = useCounter(0);

const dragging = ref<any>();

function dragOver(block: any) {
    const oldOrder       = dragging.value.order;
    dragging.value.order = block.order;
    block.order          = oldOrder;
}

const startPrevBlockWidth = ref<number>(0);

function startPrevBlock(curBlock: any) {
    const prevBlock = blocks.value.find(block => block.order == curBlock.order - 1);
    if (prevBlock)
        startPrevBlockWidth.value = prevBlock.width;
}

function setPrevBlock(curBlock: any, value: number) {
    const prevBlock = blocks.value.find(block => block.order == curBlock.order - 1);
    if (prevBlock)
        prevBlock.width = startPrevBlockWidth.value + value;
}
</script>

<template>
    <div>
        <UButton label="Add block"
                 color="gray"
                 icon="i-heroicons-plus"
                 @click="blocks.push({id: incId(), color: next(), order: incOrder(), width: 100})"/>

        <div class="overflow-clip rounded">
            <div class="flex gap-5 overflow-x-scroll w-full py-5 select-none">
                <SequenceBlock v-for="block in blocks.sort((a, b) => a.order - b.order)"
                               :key="block.id"
                               :block="block"
                               class="h-16 rounded flex items-center justify-between shrink-0 cursor-grab overflow-clip"
                               @out-vector-start="startPrevBlock(block)"
                               @out-vector="setPrevBlock(block, $event)"
                               @dragstart="dragging = block"
                               @dragover.prevent="dragOver(block)"
                               @dragend="dragging = undefined"/>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>