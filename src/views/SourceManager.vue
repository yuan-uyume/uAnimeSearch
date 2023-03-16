<template>
    <div>
        <div>
            <el-upload ref="upload" action="javascrpt:void(0)" accept=".json" :limit="1" :on-exceed="handleExceed"
                :on-change="handleChange" :auto-upload="false">
                <template #trigger>
                    <el-button type="primary">选择搜索源配置文件</el-button>
                </template>
                <el-button style="margin-left: 16px;" type="success" @click="submitUpload">
                    加载搜索源
                </el-button>
                <template #tip>
                    <div class="el-upload__tip text-red">
                        限制选择一个文件，格式为json。
                    </div>
                </template>
            </el-upload>
        </div>
        <div>
            <el-tree :data="showSources" show-checkbox node-key="md5" default-expand-all :expand-on-click-node="false">
                <template #default="{ node, data }" style="margin: 12px 0;">
                    <span class="custom-tree-node">
                        <span>{{ data.name }}</span>
                        <span style="float: right;">
                            <a @click="append(data)"> Append </a>
                            <a style="margin-left: 8px" @click="remove(node, data)"> Delete </a>
                        </span>
                    </span>
                </template>
            </el-tree>
        </div>
    </div>
</template>

<style>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    padding-right: 8px;
}
</style>

<script>
import { genFileId } from 'element-plus'
export default {
    data() {
        return {
            file: null,
            loadData: [],
            sources: []
        }
    },
    created() {
        this.loadData = this.uCore.getSearchSources(true).userComponents
    },
    mounted() {
        console.log(this.sources);
        console.log(this.showSources);
    },
    watch: {
        loadData(loadData) {
            let data = this.toRaw(loadData)
            console.log("loadData", data);
            let sources = []
            for (let key in data) {
                let obj = data[key]
                console.log("obj", obj);
                let { rules, ...o } = obj
                let oobj = {
                    children: rules,
                    ...o
                }
                sources.push(oobj)
            }
            this.sources = sources
        }
    },
    computed: {
        showSources() {
            return this.sources
        }
    },
    methods: {
        handleExceed(files) {
            this.$refs.upload.clearFiles()
            this.file = files[0]
            this.file.uid = genFileId()
            this.$refs.upload.handleStart(this.file)
        },
        handleChange(file) {
            this.file = file
        },
        submitUpload() {
            console.log(this.file);
            this.uExt.loadFormFile(this.file.raw, (data) => {
                console.log("loadFormFile", data)
                this.$refs.upload.clearFiles()
            })
        }
    },
}
</script>