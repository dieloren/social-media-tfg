<script setup>
import {ChatBubbleLeftRightIcon, HandThumbUpIcon, ArrowDownTrayIcon, PencilIcon} from '@heroicons/vue/24/outline'
import {HandThumbUpIcon as HandThumbUpIconSolid} from '@heroicons/vue/24/solid'
import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/vue'
import PostUserHeader from "@/Components/app/PostUserHeader.vue";
import {router, usePage} from '@inertiajs/vue3'
import {isImage} from '@/helpers.js'
import {PaperClipIcon} from "@heroicons/vue/24/solid/index.js";
import axiosClient from "@/axiosClient.js";
import InputTextArea from "@/Components/InputTextArea.vue";
import IndigoButton from "@/Components/app/IndigoButton.vue";
import {ref} from "vue";
import ReadMoreLess from "@/Components/app/ReadMoreLess.vue";
import EditDeleteDropdown from "@/Components/app/EditDeleteDropdown.vue";

const authUser = usePage().props.auth.user;
const editingComment = ref(null)

const props = defineProps({
    post: Object
})

const newCommentText = ref('')
let showLikes = false;

const emit = defineEmits(['editClick', 'attachmentClick'])

function openEditModal() {
    emit('editClick', props.post)
}

function deletePost() {
    if (window.confirm('Are you sure you want to delete this post?')) {
        router.delete(route('post.destroy', props.post), {
            preserveScroll: true
        })
    }
}

function openAttachment(ind){
    emit('attachmentClick', props.post, ind)
}

function sendReaction() {
    axiosClient.post(route('post.reaction', props.post), {
        reaction: 'like'
    })
        .then(({data}) => {
            props.post.num_of_reactions = data.num_of_reactions
            props.post.current_user_has_reacted = data.current_user_has_reacted
            showLikes = true
        })
}

function createComment() {
    axiosClient.post(route('post.comment.create', props.post), {
        comment: newCommentText.value
    })
        .then(({data}) => {
            newCommentText.value = ''
            props.post.comments.unshift(data)
            props.post.num_of_comments++;
        })
}

function startCommentEdit(comment) {
    editingComment.value = {
        id: comment.id,
        comment: comment.comment.replace(/<br\s*\/?>/gi, '\n')
    }
}

function deleteComment(comment) {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
        return false;
    }
    axiosClient.delete(route('post.comment.delete', comment.id))
        .then(({data}) => {
            props.post.comments = props.post.comments.filter(c => c.id !== comment.id)
            props.post.num_of_comments--;
        })
}

function updateComment() {
    axiosClient.put(route('post.comment.update', editingComment.value.id), {
        comment: editingComment.value.comment
    })
        .then(({data}) => {
            props.post.comments = props.post.comments.map((c) => {
                if (c.id === data.id) {
                    return data
                }
                return c
            })
            editingComment.value = null
        })
}

</script>

<template>
    <div class="bg-white border rounded p-4 mb-3">
        <div class="flex items-center justify-between mb-3">
            <PostUserHeader :post="post" :show-time="true"/>
            <EditDeleteDropdown :user="post.user" @edit="openEditModal" @delete="deletePost"/>
        </div>
        <div class="mb-3">
            <ReadMoreLess :content="post.body" />
            <span v-if="post.created_at !== post.updated_at" class="text-indigo-500">[edited]</span>
        </div>
        <div class="grid gap-3 mb-3" :class="[
            post.attachments.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
        ]">
            <template v-for="(attachment, ind) of post.attachments.slice(0, 4)">

                <div @click="openAttachment(ind)"
                     class="group aspect-square bg-blue-100 flex flex-col items-center justify-center text-gray-500 relative cursor-pointer">

                    <div v-if="ind === 3 && post.attachments.length > 4"
                         class="absolute left-0 top-0 right-0 bottom-0 z-10 bg-black/60 text-white flex items-center justify-center text-2xl">
                        +{{ post.attachments.length - 4 }} more
                    </div>

                    <!-- Download-->
                    <a @click.stop :href="route('post.download', attachment)"
                       class="z-20 opacity-0 group-hover:opacity-100 transition-all w-8 h-8 flex items-center justify-center text-gray-100 bg-gray-700 rounded absolute right-2 top-2 cursor-pointer hover:bg-gray-800">
                        <ArrowDownTrayIcon class="w-4 h-4" />
                    </a>
                    <!--/ Download-->

                    <img v-if="isImage(attachment)"
                         :src="attachment.url"
                         class="object-contain aspect-square"/>
                    <div v-else class="flex flex-col justify-center items-center">
                        <PaperClipIcon class="w-10 h-10 mb-3"/>

                        <small>{{ attachment.name }}</small>
                    </div>
                </div>
            </template>
        </div>
        <Disclosure v-slot="{ open }">
            <div class="flex items-center gap-2 mb-3">
                <button
                    @click="sendReaction"
                    class="text-gray-800 flex gap-1 items-center justify-center rounded-lg hover:bg-gray-200 py-2 px-4 flex-1"
                    :class="[
                    post.current_user_has_reacted ? 'bg-sky-100 hover:bg-sky-200' : 'bg-gray-100 hover:bg-gray-200'
                ]">
                    <HandThumbUpIcon v-if="!post.current_user_has_reacted" class="w-5 h-5"/>
                    <HandThumbUpIconSolid v-if="post.current_user_has_reacted" class="w-5 h-5"/>
                    <span v-if="showLikes">{{post.num_of_reactions}}</span>
                    {{post.current_user_has_reacted ? 'Dislike' : 'Like'}}
                </button>
                <DisclosureButton
                    class="text-gray-800 flex gap-1 items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 py-2 px-4 flex-1"
                >
                    <ChatBubbleLeftRightIcon class="w-5 h-5 mr-2"/>
                    {{post.num_of_comments}}
                    Comments
                </DisclosureButton>
            </div>
            <DisclosurePanel class="mt-3">
                <div class="flex gap-2 mb-3">
                    <a href="javascript:void(0)">
                        <img :src="authUser.avatar_url !== '/storage/' ? authUser.avatar_url : '/img/default_avatar.webp'"
                             class="w-[40px] rounded-full border border-2 transition-all hover:border-blue-500"/>
                    </a>
                    <div class="flex flex-1">
                        <InputTextArea v-model="newCommentText" placeholder="Enter your comment here" rows="1"
                                       class="w-full max-h-[160px] resize-none rounded-r-none"></InputTextArea>
                        <IndigoButton @click="createComment" class="rounded-l-none w-[100px] ">Submit</IndigoButton>
                    </div>
                </div>
                <div>
                    <div v-for="comment of post.comments" :key="comment.id" class="mb-4">
                        <div class="flex justify-between gap-2">
                            <div class="flex gap-2">
                                <a href="javascript:void(0)">
                                    <img :src="comment.user.avatar_url !== '/storage/' ? comment.user.avatar_url : '/img/default_avatar.webp'"
                                         class="w-[40px] rounded-full border border-2 transition-all hover:border-blue-500"/>
                                </a>
                                <div>
                                    <h4 class="font-bold">
                                        <a href="javascript:void(0)" class="hover:underline">
                                            {{ comment.user.name }}
                                        </a>
                                    </h4>
                                    <small class="text-xs text-gray-400">
                                        {{ comment.updated_at }}
                                        <span v-if="comment.created_at !== comment.updated_at">
                                            [edited]
                                        </span>
                                    </small>
                                </div>
                            </div>
                            <EditDeleteDropdown :user="comment.user" @edit="startCommentEdit(comment)" @delete="deleteComment(comment)" />
                        </div>
                        <div v-if="editingComment && editingComment.id === comment.id" class="ml-12">
                            <InputTextArea v-model="editingComment.comment" placeholder="Enter your comment here" rows="1"
                                           class="w-full max-h-[160px] resize-none"></InputTextArea>
                            <div class="flex gap-2 justify-end">
                                <button class="rounded-r-none text-indigo-500" @click="editingComment = null">cancel</button>
                                <IndigoButton @click="updateComment" class="w-[100px]">update</IndigoButton>
                            </div>
                        </div>
                        <ReadMoreLess v-else :content="comment.comment" content-class="text-sm flex flex-1 ml-12" />
                    </div>
                </div>
            </DisclosurePanel>
        </Disclosure>
    </div>
</template>

<style scoped>

</style>
