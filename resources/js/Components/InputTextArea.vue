<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        required: true,
    },
    placeholder: String,
    autoResize: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(['update:modelValue']);

const input = ref(null);

onMounted(() => {
    if (input.value.hasAttribute('autofocus')) {
        input.value.focus();
    }
});

defineExpose({ focus: () => input.value.focus() });

function onInputChange($event) {
     emit('update:modelValue', $event.target.value);

     if (props.autoResize) {
         $event.target.style.height = 'auto';
         $event.target.style.height = $event.target.scrollHeight + 'px';
     }
}

</script>

<template>
    <textarea
        class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
        :value="modelValue"
        @input="onInputChange"
        ref="input"
        :placeholder="placeholder"
    ></textarea>
</template>
