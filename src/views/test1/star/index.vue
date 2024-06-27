<template>
  <div @click="navigateToStar1">222</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'MyComponent',
  setup() {
    const router = useRouter()

    const navigateToStar1 = () => {
      router.push('/test1/star1')
    }

    return {
      navigateToStar1,
    }
  },
})
</script>

<style scoped lang="scss"></style>
