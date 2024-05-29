<script setup>
import PostItem from "@/Components/app/PostItem.vue";
const post1 = {
    user: {
        id: 1,
        avatar: 'https://randomuser.me/api/portraits/men/82.jpg',
        name: 'Sergio',
    },
    group: null,
    attachments: [
        {
            id: 1,
            name: 'test.png',
            url: 'https://picsum.photos/1000',
            mime: 'image/png',
        },
        {
            id: 2,
            name: 'test2.png',
            url: 'https://picsum.photos/1000',
            mime: 'image/png',
        },
        {
            id: 4,
            name: 'myDoc.docx',
            url: '#',
            mime: 'application/msword',
        }
    ],
    body: `
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque egestas tellus a sem viverra, in pulvinar ante lacinia. Aliquam risus ipsum, finibus a leo vel, gravida interdum leo. Nunc rutrum ut est vitae mollis. Aliquam erat volutpat. Donec turpis odio, vulputate eget sollicitudin vel, condimentum nec justo. Maecenas interdum diam a arcu molestie mattis. Nam cursus condimentum ante ut fringilla.</p>
    `,
    createdAt: '2021-09-01 15:00',
}
const post2 = {
    user: {
        id: 2,
        avatar: 'https://randomuser.me/api/portraits/men/81.jpg',
        name: 'Diego',
    },
    group: {
        id: 1,
        name: 'Grupo de prueba',
    },
    body: `
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque egestas tellus a sem viverra, in pulvinar ante lacinia. Aliquam risus ipsum, finibus a leo vel, gravida interdum leo. Nunc rutrum ut est vitae mollis. Aliquam erat volutpat. Donec turpis odio, vulputate eget sollicitudin vel, condimentum nec justo. Maecenas interdum diam a arcu molestie mattis. Nam cursus condimentum ante ut fringilla.</p>
    `,
    createdAt: '2021-09-01 13:00',
}

defineProps({
    posts: Array
})
</script>

<template>
    <div class="overflow-auto">
        <PostItem v-for="post of posts" :key="post.id" :post="post"/>
    </div>
</template>

<style scoped>

</style>
