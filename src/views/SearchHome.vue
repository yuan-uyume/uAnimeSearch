<template>
    <div style="height: 100%;">
        <div>
            <el-row :gutter="80">
                <el-col span="16" style="flex: 1;min-width: 416px;margin: 8px;">
                    <el-row gutter="16" style="min-width: 416px;">
                        <el-col span="18" style="flex: 1;min-width: 350px;">
                            <el-input type="text" placeholder="搜索内容" v-model="searchValue"></el-input>
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
            <el-row style="margin-top: 24px;margin-left: -7px;" gutter="30" v-show="isMore">
                <el-col style="flex: 1;margin-bottom: 10px;max-width: 200px;min-width: 200px;" span="7">
                    <el-tree-select placeholder="选择筛选源" v-model="treeValue" :data="treeData" multiple
                        :render-after-expand="false" show-checkbox />
                </el-col>
                <el-col style="flex: 1;margin-bottom: 10px;min-width: 200px;" span="10">
                    <el-input type="text" placeholder="筛选内容..." v-model="filterValue"></el-input>
                </el-col>
                <el-col style="flex: 1;margin-bottom: 10px;min-width: 200px;" span="7">
                    <el-button>筛选</el-button>
                </el-col>
            </el-row>
            <el-divider></el-divider>
        </div>
        <div>
            <el-row>
                <el-col span="20">
                    <AnimeResult :data="showSearchData" />
                </el-col>
                <el-col span="4">

                </el-col>
            </el-row>
        </div>
        <div style="position: fixed;bottom: 65px;z-index: 2;">
            <el-pagination style="position: absolute;bottom: 0;" :current-page="page.current" :page-size="page.size" :page-sizes="[10, 20, 30, 50]"
                :disabled="disabled" background
                layout="total, sizes, prev, pager, next, jumper" :total="pageTotal" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script>
import AnimeResult from '../components/AnimeResult.vue';
export default {
    components: { AnimeResult },
    data() {
        return {
            isMore: false,
            treeValue: '',
            treeData: [],
            searchData: [],
            showSearchData: [{
                title: "biao ti",
                url: "https://www.baidu.com",
                image: "@/icons/image1.png",
                info: "this is a anime search result",
                eps: [
                    {
                        title: '1',
                        url: "#"
                    }
                ]
            }],
            searchComponents: [],
            page: {
                size: 20,
                current:1
            }
        }
    },
    computed: {
        pageTotal() {
            return this.showSearchData.length
        }
    },
    mounted() {
        this.searchComponents = this.uCore.getSearchSources()
    },
    methods: {
        filterSearchResult() {
            if (this.filterValue && this.treeValue) {
                this.showSearchData = this.searchData.filter(d => {
                    retrun ((d.title.find(this.filterValue) || 
                            d.info.find(this.filterValue) ||
                            d.tag.find(this.filterValue)) && 
                            d.source == this.treeValue)
                })
            }
            this.showSearchData = this.searchData
        }
    }
}
</script>