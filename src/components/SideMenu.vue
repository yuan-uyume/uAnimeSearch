<template>
  <div style="height: 100%;">
    <el-menu 
    :style="{ 'min-width': isCollapse ? 'none' : '200px' }" 
    default-active="/search"
    router="true" 
    :collapse="isCollapse">
      <el-switch v-model="isCollapse" style="margin-left: 6px" />
      <el-menu-item index="/search">
        <el-icon>
          <Search />
        </el-icon>
        <template #title>
          <span>搜索</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/star">
        <el-icon>
          <Star />
        </el-icon>
        <template #title>
          <span>收藏</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/source_manager">
        <el-icon>
          <Setting />
        </el-icon>
        <template #title>源管理</template>
      </el-menu-item>
      <el-menu-item index="/source_up">
        <el-icon>
          <MostlyCloudy />
        </el-icon>
        <template #title>订阅管理</template>
      </el-menu-item>
      <el-menu-item index="/about">
        <el-icon>
          <User />
        </el-icon>
        <template #title>关于我们</template>
      </el-menu-item>
    </el-menu>
    <div style="position: relative;z-index: 1;">
      <div style="position: absolute;top:-365px;background-image: url('icons/search.png');width: 100%;height: 365px;">
      </div>
    </div>
  </div>
</template>

<style>
.el-container {
  width: 100%!important;
  height: 100%!important;
}

.el-menu {
  height: 100%;
}

.el-menu-item {
  z-index: 2;
}
</style>

<script>
export default {
  data() {
    return {
      isCollapse: false
    }
  }
}
</script>