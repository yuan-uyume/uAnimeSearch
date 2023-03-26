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
                <el-button style="margin-left: 16px;" type="success" @click="saveData">
                    保存配置
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
                            <a @click="{dialogVisible = !dialogVisible;form = data;
                            }" v-if="data.children"> 编辑 </a>
                            <a style="margin-left: 8px" @click="remove(node, data)"> 删除 </a>
                        </span>
                    </span>
                </template>
            </el-tree>
        </div>
        <el-dialog v-model="dialogVisible" title="分组" width="30%" :before-close="handleClose">
            <el-input type="text" v-model="form.name" placeholder="请输入名称">
                <template #prepend>名称</template>
            </el-input>
            <el-input type="text" style="margin-top: 18px;" v-model="form.id" placeholder="请输入ID">
                <template #prepend>ID</template>
            </el-input>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="append">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
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
            sources: [],
            dialogVisible: false,
            form: {name: "", id: ""}
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
            console.log("loadData", data)
            let sources = []
            for (let key in data) {
                let obj = data[key]
                console.log("obj", obj)
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
                this.loadData = this.uCore.getSearchSources(true).userComponents
            })
        },
        saveData() {
            let data = this.toRaw(this.sources)
            console.log("saveData...", data)
            let sources = []
            for (let key in data) {
                let obj = data[key]
                console.log("obj", obj)
                let { children, ...o } = obj
                let oobj = {
                    rules: children,
                    ...o
                }
                sources.push(oobj)
            }
            console.log("saveData...end", sources)
            this.uCore.saveSearchSources(sources)
            this.loadData = this.uCore.getSearchSources(true).userComponents
        },
        append(data) {
            // const newChild = {
            //     id: "uyume_like",
            //     md5: "be71f5affe6f36121ec20fb675e97481",
            //     name: "uyume_like",
            //     url: ""
            // }
            // if (!data.children) {
            //     data.children = []
            // }
            // data.children.push(newChild)
            // this.sources = [...this.sources]
            if(this.sources.findIndex((d) => {return d.id == this.form.id && d.md5 != this.form.md5}) == -1) {
                this.uExt.updateMd5(this.form)
            }
            this.dialogVisible = false
        },
        remove(node, data) {
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex((d) => d.md5 === data.md5)
            children.splice(index, 1)
            // this.sources = [...this.sources]
        }
    },
}
</script>