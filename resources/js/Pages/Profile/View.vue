<template>
    <AuthenticatedLayout>
        <div class="max-w-[800px] mx-auto h-full overflow-auto">
            <div
                v-show="showNotification && status === 'cover-image-updated'"
                class="my-2 py-2 px-3 font-medium text-sm bg-emerald-500 text-white"
            >
                Your cover image has been updated.
            </div>
            <div
                v-if="errors.cover"
                class="my-2 py-2 px-3 font-medium text-sm bg-red-400 text-white"
            >
                {{ errors.cover }}
            </div>
            <div class="group relative bg-white">
                <img :src="coverImageSource || user.cover_url || '/img/default_cover.jpeg'" class="w-full h-[200px] object-cover">
                <div class="absolute top-2 right-2">
                    <button v-if="!coverImageSource" class="bg-gray-50 hover:bg-gray-100 tex-gray-8000 py-1 px-2 text-xs flex items-center opacity-0 group-hover:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        Update Cover Image
                        <input type="file" class="absolute left-o top-0 right-0 bottom-0 opacity-0 cursor-pointer"
                               @change="onCoverChange"/>
                    </button>
                    <div v-else class="flex gap-2 bg-white p-2 opacity-0 group-hover:opacity-100">
                        <button
                            @click="cancelCoverImage"
                            class="bg-gray-50 hover:bg-gray-100 tex-gray-8000 py-1 px-2 text-xs flex items-center">
                            <XMarkIcon class="w-4 h-4 mr-2"/>
                            Cancel
                        </button>
                        <button
                            @click="submitCoverImage"
                            class="bg-gray-800 hover:bg-gray-900 text-gray-100 py-1 px-2 text-xs flex items-center">
                            <CheckIcon class="w-4 h-4 mr-2"/>
                            Confirm
                        </button>
                    </div>
                </div>
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
import {computed, ref, watch} from "vue";
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { CheckIcon } from "@heroicons/vue/24/solid";
import { useForm } from "@inertiajs/vue3";

const imagesForm = useForm({
    avatar: null,
    cover: null,
})

const showNotification = ref(true);

const coverImageSource = ref('');

const authUser = usePage().props.auth.user;

const isMyProfile = computed(() => authUser && authUser.id == props.user.id)

const props = defineProps({
    errors: Object,
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

function onCoverChange(event) {
    imagesForm.cover = event.target.files[0];
    if (imagesForm.cover) {
        const reader = new FileReader();
        reader.onload = () => {
            coverImageSource.value = reader.result;
        }
        reader.readAsDataURL(imagesForm.cover);
    }
}

function cancelCoverImage() {
    imagesForm.cover = null;
    coverImageSource.value = '';
}

function submitCoverImage() {
    imagesForm.post(route('profile.updateCover'), {
        onSuccess: (user) => {
            cancelCoverImage()
            setTimeout(() => {
                showNotification.value = false;
            }, 3000)
        }
    });
}

</script>


<style scoped>

</style>