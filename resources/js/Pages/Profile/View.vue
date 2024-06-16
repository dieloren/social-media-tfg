<template>
    <AuthenticatedLayout>
        <div class="max-w-[800px] mx-auto h-full overflow-auto">
            <div
                v-show="showNotification && success"
                class="my-2 py-2 px-3 font-medium text-sm bg-emerald-500 text-white"
            >
                {{ success }}
            </div>
            <div
                v-if="errors.cover"
                class="my-2 py-2 px-3 font-medium text-sm bg-red-400 text-white"
            >
                {{ errors.cover }}
            </div>
            <div class="group relative bg-white">
                <img :src="user.cover_url !== '/storage/' ? user.cover_url : '/img/default_cover.jpeg'" class="w-full h-[200px] object-cover">
                <div class="absolute top-2 right-2">
                    <button v-if="!coverImageSource" class="bg-gray-50 hover:bg-gray-100 text-gray-800 py-1 px-2 text-xs flex items-center opacity-0 group-hover:opacity-100">
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
                    <div class="relative flex items-center justify-center group/avatar -mt-[64px] ml-[48px] w-[128px] h-[128px] rounded-full">
                        <img :src="user.avatar_url !== '/storage/' ? user.avatar_url : '/img/default_avatar.webp'"
                             class="w-full h-full object-cover rounded-full">
                        <button v-if="!avatarImageSource" class="absolute left-0 top-0 right-0 bottom-0 bg-black/50 text-gray-200 rounded-full opacity-0 flex items-center justify-center group-hover/avatar:opacity-100">
                            <CameraIcon class="w-8 h-8" />

                            <input type="file" class="absolute left-o top-0 right-0 bottom-0 opacity-0 cursor-pointer"
                                   @change="onAvatarChange"/>
                        </button>
                        <div v-else class="absolute top-1 right-0 flex flex-col gap-2">
                            <button
                                @click="cancelAvatarImage"
                                class="w-7 h-7 flex items-center justify-center bg-red-500/80 text-white rounded-full">
                                <XMarkIcon class="w-5 h-5"/>
                            </button>
                            <button
                                @click="submitAvatarImage"
                                class="w-7 h-7 flex items-center justify-center bg-emerald-500/80 text-white rounded-full">
                                <CheckIcon class="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                    <div class="flex justify-between items-center flex-1 p-4">
                        <h2 class="font-bold text-lg">{{ user.name }}</h2>
                    </div>
                </div>
            </div>
            <div class="border-t">
                <TabGroup>
                    <TabList class="flex bg-white">
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
                        <Tab v-if="isMyProfile" v-slot="{ selected }" as="template">
                            <TabItem :selected="selected" text="My profile"/>
                        </Tab>
                    </TabList>

                    <TabPanels class="mt-2">
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
                        <TabPanel v-if="isMyProfile">
                            <Edit :must-verify-email="mustVerifyEmail" :status="status"/>
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
import { CameraIcon } from "@heroicons/vue/24/solid";
import { useForm } from "@inertiajs/vue3";

const imagesForm = useForm({
    avatar: null,
    cover: null,
})

const showNotification = ref(true);

const coverImageSource = ref('');
const avatarImageSource = ref('');

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
    success: {
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

function onAvatarChange(event) {
    imagesForm.avatar = event.target.files[0];
    if (imagesForm.avatar) {
        const reader = new FileReader();
        reader.onload = () => {
            avatarImageSource.value = reader.result;
        }
        reader.readAsDataURL(imagesForm.avatar);
    }
}

function cancelCoverImage() {
    imagesForm.cover = null;
    coverImageSource.value = null;
}

function cancelAvatarImage() {
    imagesForm.avatar = null;
    avatarImageSource.value = null;
}

function submitCoverImage() {
    imagesForm.post(route('profile.updateImages'), {
        onSuccess: (user) => {
            cancelCoverImage()
            setTimeout(() => {
                showNotification.value = false;
            }, 3000)
        }
    });
}

function submitAvatarImage() {
    imagesForm.post(route('profile.updateImages'), {
        onSuccess: (user) => {
            cancelAvatarImage()
            setTimeout(() => {
                showNotification.value = false;
            }, 3000)
        }
    });
}

</script>


<style scoped>

</style>
