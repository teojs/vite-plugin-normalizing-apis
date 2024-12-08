<script setup lang="ts">
import { ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import { Apis, apis } from '@/service';

const msg = ref('')
const getDemo = () => {
  apis.demo({
    params: {
      test: 'test'
    }
  }).then(res => {
    msg.value = res.body
  })
}

const userInfo = ref<Apis.user.list.UserInfo[]>([])
function getUserList() {
  apis.user.list({
    params: {
      id: 1,
      name: 'test'
    },
    data: {
      id: 1,
      name: 'test'
    }
  }).then(res => {
    userInfo.value = res.body
  })
}

getDemo()
getUserList()
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <div style="font-size: 30px;">
      {{ msg }}
    </div>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>