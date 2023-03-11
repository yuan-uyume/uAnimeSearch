<script>
export default {
  data() {
    return {
      isCollapse: false
    }
  }
}
</script>

<template>
  <el-container>
    <el-aside>
      <el-menu :style="{'min-width': isCollapse ? 'none' : '200px'}" default-active="1" :collapse="isCollapse" @open="handleOpen"
        @close="handleClose">
        <el-switch v-model="isCollapse" style="margin-left: 6px"/>
        <el-menu-item index="1">
          <el-icon><Search /></el-icon>
          <template #title>
            <span>搜索</span>
          </template>
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon><Star /></el-icon>
          <template #title>
            <span>收藏</span>
          </template>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon><Setting /></el-icon>
          <template #title>源管理</template>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><MostlyCloudy /></el-icon>
          <template #title>订阅管理</template>
        </el-menu-item>
        <el-menu-item index="5">
          <el-icon><User /></el-icon>
          <template #title>关于我们</template>
        </el-menu-item>
      </el-menu>
      <div style="position: relative;z-index: 1;">
        <div style="position: absolute;top:-365px;background-image: url('icons/search.png');width: 100%;height: 365px;">
        </div>
      </div>
    </el-aside>
    <el-container>
      <el-main>
        <RouterView />
        <el-backtop :right="100" :bottom="100" />
      </el-main>
      <el-footer>
        <el-row justify="center" align="middle" style="height: 100%;">
          <span style="color: rgb(180, 180, 180);text-align: center;">
            powered by uyume uno anun seven_people @ 2023
          </span>
        </el-row>
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
