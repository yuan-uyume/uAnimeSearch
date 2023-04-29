<template>
    <div>
        <div>
            <el-row gutter="56">
                <el-col span="18" style="max-width: 800px;min-width: 300px;flex: 2">
                    <el-input placeholder="输入要搜索的内容"></el-input>
                </el-col>
                <el-col span="6" style="min-width: 300px;flex: 1">
                    <el-button @click="search(0)">
                        搜索
                    </el-button>
                    <el-button @click="update">
                        更新
                    </el-button>
                </el-col>
            </el-row>
            <el-row>
                <div class="u-tags">
                    <el-row>
                        <span v-for="item, index in tags" :key="index">{{ item }}</span>
                    </el-row>
                </div>
            </el-row>
        </div>
        <el-divider />
        <div>
            <el-row style="padding-bottom: 32px;">
                <el-col span="20">
                    <AnimeResult :data="showData" @star="star" />
                </el-col>
                <el-col span="4">
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<style>
.u-tags {
    min-height: 36px;
    margin-top: 12px;
    padding: 4px 6px;
    background-color: rgb(253, 250, 253);
    flex: 1
}
</style>

<script>
import AnimeResult from '../components/AnimeResult.vue'
export default {
    components: { AnimeResult },
    data() {
        return {
            tags: new Set(),
            data: [],
            dataHash: [],
            sources: {},
            searchValue: "",
            showData: [],
            pageData: [],
            filtersData: [],
            page: {
                current: 1,
                pageSize: 10
            }
        }
    },
    created() {
        this.loadSources()
    },
    mounted() {
        this.loadData()
    },
    methods: {
        loadData() {
            this.data = JSON.parse(localStorage['starData'] || '[]')
            this.dataHash = JSON.parse(localStorage['starHash'] || '[]')
            console.log('starData', this.data);
            this.search()
            this.genPageData()
            this.genTags()
        },
        loadSources() {
            let data = Object.assign({}, this.uCore.getSearchSources(true));
            let sources = {}
            if (data.componentsStorage && Object.keys(data.componentsStorage).length > 0) {
                for (let r of data.componentsStorage.rules) {
                    sources[r.md5] = r
                }
            }
            for (let uc in data.userComponents) {
                uc = data.userComponents[uc]
                for (let r of uc.rules) {
                    sources[r.md5] = r
                }
            }
            this.sources = sources
        },
        genTags() {
            this.data.forEach(item => {
                if (typeof item.tags == 'string') {
                    let tags = item.tags.split(",")
                    this.tags.add(...tags)
                } else {
                    this.tags.add(...item.tags);
                }
            });
        },
        genPageData() {
            let dd = [], ddd = [], i = 0
            for (let d of this.filtersData) {
                ddd.push(d)
                if (++i >= this.page.pageSize) {
                    ddd = []
                }
                dd.push(ddd)
            }
            this.pageData = dd
            console.log("pageData", this.pageData);
            this.changeShowData(1)
        },
        search(type) {
            let value = this.searchValue.trim()
            if (value && value != '') {
                if (type) {
                    this.filtersData = this.data.filter(d => {
                        return d.tags.indexOf(value)
                    })
                } else {
                    this.filtersData = this.data.filter(d => {
                        return d.title.indexOf(value) || d.info.indexOf(value) || d.tags.indexOf(value)
                    })
                }
            } else {
                this.filtersData = this.data
            }
        },
        changeShowData(current) {
            if (this.pageData.length > 0) {
                this.showData = this.pageData[--current]
                console.log("changeShowData", current, this.showData);
            }
        },
        star(data) {
            let starHash = this.dataHash
            let starData = this.data
            console.log('data', data, 'starHash.includes(data.md5)', starHash.includes(data.md5));
            if (starHash.includes(data.md5)) {
                data.star = false
                starHash.splice(starHash.indexOf(data.md5), 1)
                starData.splice(starData.indexOf(starData.find(d => {
                    return d.md5 == data.md5
                })), 1)
                localStorage['starHash'] = JSON.stringify(starHash)
                localStorage['starData'] = JSON.stringify(starData)
            } else {
                data.star = true
                starHash.push(data.md5)
                starData.push(data)
                localStorage['starHash'] = JSON.stringify(starHash)
                localStorage['starData'] = JSON.stringify(starData)
            }
        }
    }
}
</script>