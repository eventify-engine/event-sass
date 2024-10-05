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
const prevBlockStopped    = ref<boolean>(false);

function startPrevBlock(curBlock: any) {
    const prevBlock = blocks.value.find(block => block.order == curBlock.order - 1);
    if (prevBlock) {
        startPrevBlockWidth.value = prevBlock.width;
        prevBlockStopped.value    = false;
    }
}

function setPrevBlock(curBlock: any, value: number) {
    const prevBlock = blocks.value.find(block => block.order == curBlock.order - 1);
    if (prevBlock) {
        prevBlock.width = Math.max(10, snapToGrid(startPrevBlockWidth.value + value, 10));

        prevBlockStopped.value = prevBlock.width == 10;
    }
}
</script>

<template>
    <div>
        <UButton label="Add block"
                 color="gray"
                 icon="i-heroicons-plus"
                 @click="blocks.push({id: incId(), color: next(), order: incOrder(), width: 100})"/>

        <div class="overflow-clip rounded">
            <div class="flex flex-col overflow-x-scroll w-full pt-5 pb-5 select-none">
                <div class="flex mb-2">
                    <div v-for="n in 600"
                         class="border-e w-[10px] shrink-0 relative"
                         :class="{'h-[10px]': n % 60 != 0, 'h-[20px]': n % 60 == 0}">
                    </div>
                </div>

                <div class="flex">
                    <SequenceBlock v-for="(block, index) in blocks.sort((a, b) => a.order - b.order)"
                                   :key="block.id"
                                   :block="block"
                                   :is-first="index == 0"
                                   v-model:prev-block-stopped="prevBlockStopped"
                                   @out-vector-start="startPrevBlock(block)"
                                   @out-vector="setPrevBlock(block, $event)"
                                   @dragstart="dragging = block"
                                   @dragover.prevent="dragOver(block)"
                                   @dragend="dragging = undefined"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>