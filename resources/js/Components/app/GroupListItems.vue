<script setup>
import GroupItem from "@/Components/app/GroupItem.vue";
import TextInput from "@/Components/TextInput.vue";
import {ref} from "vue";

const searchKeyword = ref('');

</script>

<template>
    <TextInput :model-value="searchKeyword" placeholder="Type to search" class="w-full mt-4" />
    <div class="mt-3 h-[200px] lg:flex-1 overflow-auto">
        <div v-if="false" class="text-gray-400 text-center p-3">
            You are not joined to any groups
        </div>
        <div v-else>
            <GroupItem
                image="https://picsum.photos/101"
                title="Group 1"
                description="This is a a way longer description for this particular group, so that means this description is going to be a lot longer than the other ones."
            />
            <GroupItem
                image="https://picsum.photos/100"
                title="Group 1"
                description="This is a group description."
            />
            <GroupItem
                image="https://picsum.photos/101"
                title="Group 1"
                description="This is a a way longer description for this particular group, so that means this description is going to be a lot longer than the other ones."
            />
            <GroupItem
                image="https://picsum.photos/100"
                title="Group 1"
                description="This is a group description."
            />
            <GroupItem
                image="https://picsum.photos/101"
                title="Group 1"
                description="This is a a way longer description for this particular group, so that means this description is going to be a lot longer than the other ones."
            />
            <GroupItem
                image="https://picsum.photos/100"
                title="Group 1"
                description="This is a group description."
            />
            <GroupItem
                image="https://picsum.photos/101"
                title="Group 1"
                description="This is a a way longer description for this particular group, so that means this description is going to be a lot longer than the other ones."
            />
            <GroupItem
                image="https://picsum.photos/100"
                title="Group 1"
                description="This is a group description."
            />
            <GroupItem
                image="https://picsum.photos/101"
                title="Group 1"
                description="This is a a way longer description for this particular group, so that means this description is going to be a lot longer than the other ones."
            />
            <GroupItem
                image="https://picsum.photos/100"
                title="Group 1"
                description="This is a group description."
            />
            <GroupItem
                image="https://picsum.photos/101"
                title="Group 1"
                description="This is a a way longer description for this particular group, so that means this description is going to be a lot longer than the other ones."
            />
            <GroupItem
                image="https://picsum.photos/100"
                title="Group 1"
                description="This is a group description."
            />
        </div>
    </div>
</template>

<style scoped>

</style>
