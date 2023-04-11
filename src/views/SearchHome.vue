<template>
    <div style="height: 100%;">
        <div style="padding: 0 12px;margin-bottom: 72px;">
            <div>
                <el-row :gutter="80">
                    <el-col span="16" style="flex: 1;min-width: 416px;margin: 8px;">
                        <el-row gutter="16" style="min-width: 416px;">
                            <el-col span="18" style="flex: 1;min-width: 350px;">
                                <el-input @keyup.enter.native="onSearch" type="text" placeholder="搜索内容"
                                    v-model="search.value"></el-input>
                            </el-col>
                            <el-col span="6" style="flex: 0;min-width: 50px;">
                                <el-button @click="onSearch">搜索</el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col span="8" style="flex: 0;min-width: 230px;margin: 8px;">
                        <el-button @click="drawer = true">搜索源</el-button>
                        <el-button @click="isMore = !isMore">更多</el-button>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 24px;margin-left: -7px;" gutter="30" v-show="isMore">
                    <el-col style="flex: 1;margin-bottom: 10px;max-width: 200px;min-width: 200px;" span="7">
                        <el-tree-select placeholder="选择筛选源" v-model="treeValue" :data="treeData" multiple
                            :render-after-expand="false" show-checkbox />
                    </el-col>
                    <el-col style="flex: 1;margin-bottom: 10px;min-width: 200px;" span="10">
                        <el-input type="text" placeholder="筛选内容..." v-model="search.filterValue"></el-input>
                    </el-col>
                    <el-col style="flex: 1;margin-bottom: 10px;min-width: 200px;" span="7">
                        <el-button>筛选</el-button>
                    </el-col>
                </el-row>
                <el-divider></el-divider>
            </div>
            <div>
                <el-row style="padding-bottom: 32px;">
                    <el-col span="20">
                        <AnimeResult :data="showSearchData" />
                    </el-col>
                    <el-col span="4">

                    </el-col>
                </el-row>
            </div>
        </div>
        <el-row style="position: fixed;bottom: 40px;z-index: 2;background-color: white;height: 32px;width: 100%;">
            <el-pagination style="position: absolute;bottom: 0;" :current-page="page.current" :page-size="page.size"
                :page-sizes="[10, 20, 30]" :disabled="disabled" background layout="total, sizes, prev, pager, next, jumper"
                :total="pageTotal" @size-change="genPageData" @current-change="changePage" />
        </el-row>
        <el-drawer v-model="drawer" title="搜索源启用配置" :before-close="handleDrawerClose">
            <div>
                <el-tree ref="sourcesTree" show-checkbox :data="sources" node-key="md5" default-expand-all
                    :expand-on-click-node="false">
                    <template #default="{ node, data }" style="margin: 12px 0;">
                        <span class="custom-tree-node">
                            <span :style="{ color: data.sys ? 'darkseagreen' : '' }">{{ data.name }}</span>
                        </span>
                    </template>
                </el-tree>
            </div>
        </el-drawer>
    </div>
</template>

<style scoped>
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
import { keys } from 'lodash';
import AnimeResult from '../components/AnimeResult.vue';
export default {
    components: { AnimeResult },
    data() {
        return {
            isMore: false,
            drawer: false,
            treeValue: '',
            treeData: [],
            searchData: [],
            showSearchData: [],
            filterSearchData: [],
            searchComponents: [],
            page: {
                size: 20,
                current: 1,
                pageData: []
            },
            search: {
                value: '',
                filterValue: '',
                components: []
            }
        }
    },
    computed: {
        pageTotal() {
            return this.filterSearchData.length
        }
    },
    watch: {
        searchComponents(searchComponents) {
            let data = this.toRaw(searchComponents)
            console.log("searchComponents", data)
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
            console.log("sources", sources)
            this.sources = sources
        }
    },
    created() {
        this.getSearchComponents()
    },
    mounted() {
        this.loadEnableComponentsAndSelect()
        this.$nextTick(this.getQueryAndSearch)
    },
    methods: {
        filterSearchResult() {
            if (this.filterValue && this.treeValue) {
                this.showSearchData = this.searchData.filter(d => {
                    retrun((d.title.find(this.filterValue) ||
                        d.info.find(this.filterValue) ||
                        d.tag.find(this.filterValue)) &&
                        d.source == this.treeValue)
                })
            }
            this.showSearchData = this.searchData
        },
        onSearch() {
            let searchData = this.toRaw(this.search)
            console.log('start search ... value:', searchData)
            let searchValue = searchData.value.trim()
            let sources = searchData.components
            if (searchValue == '') {
                this.$message({
                    type: "info",
                    message: "搜索内容不能为空"
                })
                return
            }
            if (sources.length <= 0) {
                this.$message({
                    type: "info",
                    message: "搜索源未选择"
                })
                return
            }
            let size = this.page.size

            this.uCore.search(sources, searchValue, 25, (data) => {
                console.log("get search result :", data);
                this.searchData = data.data
                this.filterSearchData = this.searchData
                this.genPageData(size)
            })
        },
        getSearchComponents() {
            let data = this.uCore.getSearchSources(true)
            console.log("created data,", data);
            this.searchComponents = data.userComponents
            if (data.componentsStorage == undefined || Object.keys(data.componentsStorage).length == 0) {
                let componentUp = {
                    ghproxy: true,
                    name: "uyume_likes",
                    address: "https://raw.githubusercontent.com/yuan-uyume/uAnimeSearch/master/data/uyume_like.json"
                }
                let url = componentUp.address
                if ('ghproxy' in componentUp && componentUp.ghproxy) {
                    url = "https://ghproxy.com/" + url
                }
                this.uExt.loadFormUrl(url, (d) => {
                    if (d == null) {
                        return
                    }
                    data.componentsStorage = d
                    data.componentsStorage.sys = true
                    for (let o of data.componentsStorage.rules) {
                        o.sys = true
                    }
                    this.searchComponents[data.componentsStorage.md5] = data.componentsStorage
                    this.$message({
                        message: '更新搜索源成功',
                        type: 'success',
                    })
                }, true)
            } else {
                data.componentsStorage.sys = true
                for (let o of data.componentsStorage.rules) {
                    o.sys = true
                }
                this.searchComponents[data.componentsStorage.md5] = data.componentsStorage
            }

        },
        handleDrawerClose(ignore) {
            let selectValue = this.$refs.sourcesTree.getCheckedNodes(true, false)
            selectValue = this.toRaw(selectValue)
            console.log("selectValue :", selectValue);
            this.search.components = selectValue
            let componentsHashSet = selectValue.map((item, index) => {
                return item.md5
            })
            if (ignore != true) {
                console.log('save enableComponents hashset', componentsHashSet);
                window.localStorage['enableComponents'] = JSON.stringify(componentsHashSet)
                this.$message({
                    type: 'success',
                    message: '保存搜索源启用配置成功...'
                })
            }
            this.drawer = false
        },
        loadEnableComponentsAndSelect() {
            this.drawer = true
            let enableComponents = JSON.parse(window.localStorage['enableComponents'] ? window.localStorage['enableComponents'] : [])
            this.$nextTick(() => {
                this.$refs.sourcesTree.setCheckedKeys(enableComponents)
                this.$message({
                    type: 'success',
                    message: '加载搜索源启用配置成功...'
                })
                this.handleDrawerClose()
            })
        },
        getQueryAndSearch() {
            let params = this.$route.query
            console.log('path params: ', params);
            if ('value' in params && params.value.trim() != '') {
                this.search.value = params.value.trim()
                // 全选搜索组件
                if (params.type && params.type == 0) {
                    this.$nextTick(() => {
                        this.$refs.sourcesTree.setCheckedNodes(this.sources)
                        this.$nextTick(() => {
                            this.handleDrawerClose(true)
                            this.onSearch()
                        })
                    })
                }
            }
        },
        genPageData(size) {
            // 将searchData 拍pageSize的大小切分为 pageData （二维数组）
            // this.page.pageData = [[], [], []]
            let i = 0
            let pageData = []
            let page = []
            for (let item of this.filterSearchData) {
                if (i % size == 0) {
                    page = []
                }
                page.push(item)
                if (++i % size == 0 || i == this.filterSearchData.length) {
                    pageData.push(page)
                }
            }
            this.page.size = size
            this.page.pageData = pageData
            console.log("genPageData end ...", size, pageData);
            this.changePage(1)
        },
        genFilterSearchData() {
            this.filterSearchData = this.searchData.filter(d => {
                return this.search.filterValue == '' || d.title.find(this.search.filterValue) || d.info.find(this.search.filterValue)
            })
            this.genPageData(this.page.size)
        },
        changePage(page) {
            // 点击第几页就是将showSearchData赋值
            this.page.current = page
            this.showSearchData = this.page.pageData[page - 1]
            console.debug('showSearchData', page, this.showSearchData)
        }
    }
}
</script>