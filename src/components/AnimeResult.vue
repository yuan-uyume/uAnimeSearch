<template>
    <div style="max-width: 950px;">
        <el-row class="result-item" v-for="item, index in data" :key="item.hash">
            <el-col span="6" style="min-width: 200px;max-width: 200px;padding-right: 18px;max-height: 200px;">
                <div class="on-border">
                    <a :href="item.url" style="position: relative;bottom:7px;width: 100%;">
                        <img style="width: 112%;position: relative;left: -6%;top:7px" :src="getUrl(item.image)" :alt="item.title">
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
                <el-button style="float: right;">收藏</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script type="moudle">
// import { createRequire } from 'module';
export default {
    props: {
        data: {
            type: Array,
            default () {
                return []
            }
        }
    },
    methods: {
        getUrl(url) {
            if (url.startsWith("http")) {
                return url
            } else if (url.startsWith("@")) {
                return new URL(url.substring(1, url.length), import.meta.url).href
            } else {
                return "http://" + url
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

.result-item:hover{
    box-shadow: 0px 0px 15px rgba(0, 0, 0, .20);
}

.on-border {
    overflow: hidden;
    height: 100%;
    width: 100%;
    border-radius: 5px;
    border: 3px solid whitesmoke
}
.on-border:hover {
    border: 3px solid rgba(114, 196, 160, .12);
    box-shadow: 0px 0px 16px rgba(114, 196, 160, .12);
}

.on-border img {
    transition: all 1s;
}

.on-border:hover img{
    transform: scale(1.1)
}

</style>