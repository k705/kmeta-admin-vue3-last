<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: Huccct
 * @Date: 2023-05-21 10:06:22
 * @LastEditors: Huccct
 * @LastEditTime: 2023-05-29 09:33:24
-->
<script setup lang="ts" name="Menu">
// defineProps(['menuList'])
const props = defineProps(['menuList'])
// console.log(props, 'props')
import { useRouter } from 'vue-router'
// 获取路由对象
let $router = useRouter()
const goRoute = (vc) => {
  console.log(vc.index, 'vc.index')
  $router.push(vc.index)
  // console.log(vc, 'vc.index')
  // console.log($router, ' $router')
}
</script>
<template>
  <template v-for="(item, index) in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <template v-if="!item.children">
      <el-menu-item
        v-if="!item.meta.hidden"
        :index="item.path"
        @click="goRoute"
      >
        <el-icon>
          <component :is="item.meta.icon" v-if="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由但只有一个 -->
    <template v-if="item.children && item.children.length === 1">
      <el-menu-item
        v-if="!item.children[0].meta.hidden"
        :index="item.children[0].path"
        @click="goRoute"
      >
        <el-icon>
          <component
            :is="item.children[0].meta.icon"
            v-if="item.children[0].meta.icon"
          ></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由但只有一个 --not home -->
    <!-- <template
      v-if="item.children && item.children.length === 1 && item.path !== '/'"
    >
      <el-sub-menu :index="item.path">
        <template #title>
          <el-icon>
            <component :is="item.meta.icon" v-if="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </template>

        <el-menu-item
          v-if="!item.children[0].meta.hidden"
          :index="item.children[0].path"
        >
          <el-icon>
            <component
              :is="item.children[0].meta.icon"
              v-if="item.children[0].meta.icon"
            ></component>
          </el-icon>
          <template #title>
            <span>{{ item.children[0].meta.title }}</span>
          </template>
        </el-menu-item>
      </el-sub-menu>
    </template> -->
    <!-- 有子路由且大于一个 -->
    <el-sub-menu
      v-if="item.children && item.children.length > 1"
      :index="item.path"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta.icon" v-if="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>
<style lang="scss" scoped></style>
