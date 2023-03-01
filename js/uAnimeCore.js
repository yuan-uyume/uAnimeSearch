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
    searchAnime: function (component, word, limit, callback) {
        if (uAnimeCore.components.length < 1) {
            uAnimeCore.initCore()
        }
        let page = uAnimeCore.getSearchPage(component, word, limit) // total pageNum limit
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
        uAnimeCore.getSearchResult(component, word, 1, limit, page, data, callback)
    },
    getSearchComponents: function () {
        // 从本地储存中获取搜索组件
        return JSON.parse(window.localStorage["componentsStorage"])
    },
    initCore: function () {
        uAnimeCore.components = uAnimeCore.getSearchComponents()
        console.log(uAnimeCore);
    },
    getSearchPage: function (component, word, limit) {

    },
    getSearchResult: function (component, word, currentPage, limit, page, data, callback) {
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
    }
}

export default uAnimeCore