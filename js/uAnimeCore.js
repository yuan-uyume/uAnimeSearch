const uAnimeCore = {
    version: "0.0.1",
    components: [],
    log: function (component, ...txt) {
        console.log(component.name + "(" + component.md5 + ")", ...txt);
    },
    replace(txt, ...data) {
        let t = txt, i = 1
        for (let s of data) {
            t = t.replaceAll("{"+i+"}", s)
            i ++
        }
        return t
    },
    initCore: function () {
        try {
            uAnimeCore.components = uAnimeCore.loadSearchComponents()
            console.log(uAnimeCore);
            return true
        } catch(e) {
            throw e
        }
        return false
    },
    searchAnime: function (component, word, limit, callback) {
        if (uAnimeCore.components.length < 1) {
            uAnimeCore.initCore()
        }
        if (component.search.api) {} else {
            uAnimeCore.searchAnimeHtml(component, word, limit, callback)
        }
    },
    searchAnimeHtml: function (component, word, limit, callback) {
        let page = uAnimeCore.getSearchPageHtml(component, word, limit) // total pageNum limit
        if (page.pageNum == null || page.pageNum == undefined) {
            page.pageNum = uAnimeCore.getPageNum(total, limit)
        }
        uAnimeCore.log(component, "search word: " + word, page)
        if (page.pageNum == null || page.pageNum == undefined || page.pageNum < 1) {
            return callback({
                type: 1,
                msg: "获取番剧页数失败，番剧消失在了异次元",
                data: []
            })
        }
        uAnimeCore.getSearchResultHtml(component, word, 1, limit, page, data, callback)
    },
    loadSearchComponents: function () {
        // 从本地储存中获取搜索组件
        return JSON.parse(window.localStorage["componentsStorage"])
    },
    getSearchComponents: function() {
        return uAnimeCore.components == [] ? null : uAnimeCore.components
    },
    getSearchPageHtml: function (component, word, limit) {
        let url = uAnimeCore.replace(uAnimeCore.getUrl(component), word)
        uAnimeCore.log(component, uAnimeCore.replace("getSearchPageHtml {1} from {2}", word, url))
        fetch(url)
        .then(res => {
            let txt = res.text()
            this.log(component, txt)
            return txt
        })
    },
    getSearchResultHtml: function (component, word, currentPage, limit, page, data, callback) {
        uAnimeCore.log(component, uAnimeCore.replace("search word {1} page {2} (l: {3})", word, currentPage, limit))
        let result = []
        // 发送网络请求获取结果
        
        if (uAnimeCore.collectSearchResult(component, data, result, word, currentPage, page)) {
            callback({
                type: 0,
                msg: "搜索成功！",
                data: data
            })
        }
    },
    collectSearchResult: function (component, data, addData, word, currentPage, page) {
        uAnimeCore.log(component, uAnimeCore.replace("collect {1} page {2}", word, currentPage), addData)
        data.push(...addData)
        if (data.length == page.total) {
            return true
        }
        return false
    },
    getUrl: function(component) {
        return component.search.site + component.search.path
    }
}

export default uAnimeCore