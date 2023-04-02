<template>
    <div>
        <div>
            <el-row>
                <el-col>
                    <el-button type="success">更新</el-button>
                    <el-button type="danger" style="margin-left: 8px;">删除</el-button>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" label="名称" width="180" />
                <el-table-column prop="address" label="地址" width="280"/>
                <el-table-column prop="date" label="更新时间" width="280" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button size="small" type="success">更新</el-button>
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tableData: [{
                ghproxy: true,
                name: "uyume_likes",
                address: "https://github.com/yuan-uyume/uAnimeSearch/raw/master/data/uyume_like.json"
            }]
        }
    }
}
</script>