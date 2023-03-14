<script>
import SideMenu from './components/SideMenu.vue';
export default {
  components: {SideMenu},
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
      <SideMenu/>
    </el-aside>
    <el-container>
      <el-main style="height: 100%;overflow-y: auto;overflow-x: hidden;">
        <router-view/>
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

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
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

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
