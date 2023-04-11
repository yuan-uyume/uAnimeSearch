<template>
    <div style="max-width: 950px;">
        <el-row class="result-item" v-for="item, index in data" :key="item.hash">
            <el-col span="6" style="min-width: 200px;max-width: 200px;padding-right: 18px;max-height: 200px;">
                <div class="on-border">
                    <a :href="item.url" style="position: relative;bottom:7px;width: 100%;">
                        <img style="width: 112%;position: relative;left: -6%;top:7px" :src="getUrl(item.image)"
                            :alt="item.title">
                    </a>
                </div>
            </el-col>
            <el-col span="15" style="min-width: 600px;">
                <div>
                    <div style="height: 36px;overflow-x: hidden;overflow-y: auto;">
                        <el-link style="color: #00bd7e" :underline="false" :href="item.url" target="_blank" rel="noopener noreferrer">
                            <h2>{{ item.title }}</h2>
                        </el-link>
                    </div>
                    <div style="height: 100px;max-width: 600px;overflow-x: hidden;overflow-y: hidden;">
                        <div style="height: 24px;color: grey;font-size: 12px;">
                            <span v-if="item.source">
                                {{ item.source }}（{{item.sourceHash}}）|| 
                            </span>
                            <span v-if="item.tags && item.tags.length > 0">
                                <span class="result-item-tags" v-for="tag, index in item.tags"
                                :key="index">{{ tag }}</span>
                            </span>
                        </div>
                        <div style="word-wrap:normal;text-overflow: ellipsis">
                            {{ item.info }}
                        </div>
                    </div>
                    <div class="result-item-eps-box">
                        <span class="result-item-eps" v-for="ep, index in item.eps" :key="ep.url">
                            <el-link :href="ep.url">
                                <el-button text bg>{{ ep.title }}</el-button>
                            </el-link>
                        </span>
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
export default {
    props: {
        data: {
            type: Array,
            default() {
                return []
            }
        }
    },
    methods: {
        getUrl(url) {
            if (!(url && url.trim() != '')) {
                url = '@/icons/image1.png'
            }
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
    margin-bottom: 24px;
}

.result-item:hover {
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

.on-border:hover img {
    transform: scale(1.1)
}

.result-item-tags{
    margin-right: 5px;
}
.result-item-eps{
    margin-right: 8px;
    margin-bottom: 5px;
    display: inline-block;
}
.result-item-eps-box:hover{
    background-color: rgb(253, 253, 253);
}
.result-item-eps-box{
    height: 60px;
    overflow-x: hidden;
    overflow-y: auto;
    max-width: 600px;
}
</style>