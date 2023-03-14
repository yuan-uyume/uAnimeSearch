<template>
    <div>
        <div>
            <el-row :gutter="80">
                <el-col span="16" style="flex: 1;min-width: 416px;margin: 8px;">
                    <el-row gutter="16" style="min-width: 416px;">
                        <el-col span="18" style="flex: 1;min-width: 350px;">
                            <el-input type="text" placeholder="搜索内容"></el-input>
                        </el-col>
                        <el-col span="6" style="flex: 0;min-width: 50px;">
                            <el-button>搜索</el-button>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col span="8" style="flex: 0;min-width: 230px;margin: 8px;">
                    <el-button>搜索源</el-button>
                    <el-button @click="isMore = !isMore">更多</el-button>
                </el-col>
            </el-row>
            <el-row style="margin-top: 24px;margin-left: 0px;" gutter="30" v-show="isMore">
                <el-col style="margin-bottom: 10px;" span="7">
                    <el-tree-select placeholder="选择筛选源" v-model="treeValue" :data="treeData" multiple
                        :render-after-expand="false" show-checkbox />
                </el-col>
                <el-col style="margin-bottom: 10px;" span="10">
                    <el-input type="text" placeholder="筛选内容..."></el-input>
                </el-col>
                <el-col style="margin-bottom: 10px;" span="7">
                    <el-button>筛选</el-button>
                </el-col>
            </el-row>
        </div>
        <el-divider></el-divider>
        <div>

        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            isMore: false,
            treeValue: '',
            treeData: []
        }
    }
}
</script>