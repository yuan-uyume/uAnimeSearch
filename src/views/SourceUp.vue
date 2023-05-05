<template>
    <div>
        <div>
            <el-row>
                <el-col>
                    <el-button @click="handleAdd">添加</el-button>
                    <el-button type="success" @click="handleUpate">更新</el-button>
                    <el-button type="danger" style="margin-left: 8px;" @click="handleDelete">删除</el-button>
                    <el-button @click="save">保存配置更改</el-button>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" :selectable="selectable" />
                <el-table-column prop="name" label="名称" width="180" />
                <el-table-column prop="address" label="地址" width="280" />
                <el-table-column prop="date" label="更新时间" width="280" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button size="small" type="success" @click="handleUpate(scope.$index, scope.row)">更新</el-button>
                        <el-button size="small" :disabled="this.isSys(scope.row.address)"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" :disabled="this.isSys(scope.row.address)" type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog v-model="dialogVisible" title="分组" width="30%" :before-close="handleClose">
            <el-input type="text" v-model="form.name" placeholder="请输入名称">
                <template #prepend>名称</template>
            </el-input>
            <el-input type="text" style="margin-top: 18px;" v-model="form.address" placeholder="请输入ID">
                <template #prepend>地址</template>
            </el-input>
            <template #footer>
                <span class="dialog-footer">
                    <el-button
                        @click="{ this.form.address = this.formBack.address; this.form.name = this.formBack.name; dialogVisible = false }">取消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            dialogVisible: false,
            form: {},
            formBack: {},
            selection: [],
            tableData: []
        }
    },
    created() {
        this.load()
    },
    methods: {
        load() {
            this.tableData = JSON.parse(localStorage['upSources'] || `[{
                "ghproxy": true,
                "name": "uyume_likes",
                "address": "https://raw.githubusercontent.com/yuan-uyume/uAnimeSearch/master/data/uyume_like.json"
            }]`)
            this.$message({
                    type: "success",
                    message: "加载订阅源成功！"
                })
        },
        save() {
            localStorage['upSources'] = JSON.stringify(this.tableData)
            this.$message({
                    type: "success",
                    message: "保存成功！"
                })
        },
        handleSelectionChange(data) {
            console.log('handleSelectionChange', data);
            this.selection = data
        },
        selectable(row, idx) {
            return !this.isSys(row.address)
        },
        isSys(url) {
            return url.trim() == 'https://raw.githubusercontent.com/yuan-uyume/uAnimeSearch/master/data/uyume_like.json'
        },
        handleDelete(idx, row) {
            if (row) {
                console.log("del source up", idx, row)
                this.tableData.splice(idx, 1)
            } else {
                for (let d of this.selection) {
                    idx = this.tableData.indexOf(d)
                    console.log("del source up", idx, d)
                    this.tableData.splice(idx, 1)
                }
            }
            this.$message({
                    type: "success",
                    message: "删除成功！"
                })
        },
        handleEdit(idx, row) {
            this.formBack = Object.assign({}, row)
            this.form = row
            this.dialogVisible = true
        },
        handleUpate(idx, row) {
            if (row) {
                let url = row.address
                let sys = this.isSys(url)
                if ('ghproxy' in row && row.ghproxy) {
                    url = "https://ghproxy.com/" + url
                }
                let loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                })

                this.uExt.loadFormUrl(url, (data) => {
                    loading.close()
                    this.$message({
                        message: '更新搜索源成功',
                        type: 'success',
                    })
                }, sys)
            } else {
                let data = [...this.tableData.filter(d => { return this.isSys(d.address) }), ...this.selection]
                console.log('update', data);
                let loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                })
                let i = 0
                for (let d of data) {
                    let url = d.address
                    let sys = this.isSys(url)
                    if ('ghproxy' in d && d.ghproxy) {
                        url = "https://ghproxy.com/" + url
                    }
                    this.uExt.loadFormUrl(url, (dd) => {
                        i ++
                        if (i >= data.length) {
                            loading.close()
                        }
                        this.$message({
                            message: '更新搜索源成功',
                            type: 'success',
                        })
                    }, sys)
                }
            }
        }
    },
}
</script>