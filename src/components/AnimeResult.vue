<template>
    <div style="max-width: 950px;">
        <el-row class="result-item" v-for="item, index in data" :key="item.hash">
            <el-col span="6" style="min-width: 200px;padding-right: 18px;">
                <div>
                    <a :href="item.url">
                        <img :src="item.image" :alt="item.title">
                    </a>
                </div>
            </el-col>
            <el-col span="15" style="min-width: 600px;">
                <div>
                    <div style="height: 36px;overflow-x: hidden;overflow-y: auto;">
                        <a :href="item.url" target="_blank" rel="noopener noreferrer">
                            <h2>{{ item.title }}</h2>
                        </a>
                    </div>
                    <div style="height: 100px;overflow-x: hidden;overflow-y: auto;">
                        <div>
                            tag
                        </div>
                        <div>
                            {{ item.info }}
                        </div>
                    </div>
                    <div style="height: 60px;overflow-x: hidden;overflow-y: auto;">
                        eps
                    </div>
                </div>
            </el-col>
            <el-col span="3" style="min-width: 100px;justify-content: center;">
                <el-button>收藏</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            default () {
                return []
            }
        }
    }
}
</script>

<style>
.result-item {
    border: 1px solid rgb(245, 240, 240);
    border-radius: 6px;
    padding: 10px 12px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
}
</style>