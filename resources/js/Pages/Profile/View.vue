<template>
    <AuthenticatedLayout>
        <div class="w-[800px] mx-auto h-full overflow-auto">
            <div class="relative bg-white">
                <img src="https://www.prodraw.net/fb_cover/images/fb_cover_65.jpg" class="w-full h-[200px] object-cover">
                <div class="flex">
                    <img src="https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp"
                         class="ml-[48px] w-[128px] h-[128px] -mt-[64px]">
                    <div class="flex justify-between items-center flex-1 p-4">
                        <h2 class="font-bold text-lg">{{ user.name }}</h2>
                        <PrimaryButton v-if="isMyProfile">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            Edit Profile
                        </PrimaryButton>
                    </div>
                </div>
            </div>
            <div class="border-t">
                <TabGroup>
                    <TabList class="flex bg-white">
                        <Tab v-if="isMyProfile" v-slot="{ selected }" as="template">
                            <TabItem :selected="selected" text="About"/>
                        </Tab>
                        <Tab v-slot="{ selected }" as="template">
                            <TabItem :selected="selected" text="Posts"/>
                        </Tab>
                        <Tab v-slot="{ selected }" as="template">
                            <TabItem :selected="selected" text="Followers"/>
                        </Tab>
                        <Tab v-slot="{ selected }" as="template">
                            <TabItem :selected="selected" text="Followings"/>
                        </Tab>
                        <Tab v-slot="{ selected }" as="template">
                            <TabItem :selected="selected" text="Photos"/>
                        </Tab>
                    </TabList>

                    <TabPanels class="mt-2">
                        <TabPanel v-if="isMyProfile">
                            <Edit :must-verify-email="mustVerifyEmail" :status="status"/>
                        </TabPanel>
                        <TabPanel class="bg-white p-3 shadow">
                            Posts
                        </TabPanel>
                        <TabPanel class="bg-white p-3 shadow">
                            Followers
                        </TabPanel>
                        <TabPanel class="bg-white p-3 shadow">
                            Following
                        </TabPanel>
                        <TabPanel class="bg-white p-3 shadow">
                            Photos
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import TabItem from "@/Pages/Profile/Partials/TabItem.vue";
import Edit from "@/Pages/Profile/Edit.vue";
import {usePage} from "@inertiajs/vue3";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import {computed} from "vue";

const authUser = usePage().props.auth.user;

const isMyProfile = computed(() => authUser && authUser.id == props.user.id)

const props = defineProps({
    mustVerifyEmail: {
        type: Boolean,
    },
    status: {
        type: String,
    },
    user: {
        type: Object,
    }
})

</script>


<style scoped>

</style>
