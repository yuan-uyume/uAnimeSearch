import uExt from './uAnimeEx.js'

const uAnimeCore = {
    version: "0.0.1",
    sources: [],
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
            uAnimeCore.sources = uAnimeCore.loadSearchSources()
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
    loadSearchSources: function () {
        // 从本地储存中获取搜索组件
        let sources = {}
        let componentsStorage = JSON.parse(window.localStorage["componentsStorage"]?window.localStorage["componentsStorage"]:"[]")
            sources.componentsStorage = componentsStorage
            sources.userComponents = {}
            console.log('load components', componentsStorage.name);
            let userComponentsHashAddr = JSON.parse(window.localStorage["userComponentsHash"]?window.localStorage["userComponentsHash"]:"[]")
            if (userComponentsHashAddr == null || userComponentsHashAddr.legth == 0) {
                console.log('components load complated', sources);
                return
            }
            for (let hash of userComponentsHashAddr) {
                let userComponents = JSON.parse(window.localStorage[hash])
                sources.userComponents[hash] = userComponents
                console.log('load components', userComponents.name);
            }
            console.log('components load complated', sources);
        return sources
    },
    saveSearchSources: function (data) {
        let key = []
        for(let d of data) {
            let {m , ...obj} = d
            d.md5 = uExt.md5(obj)
            key.push(d.md5)
            window.localStorage[d.md5] = JSON.stringify(d)
        }
        window.localStorage["userComponentsHash"] = JSON.stringify(key)
    },
    getSearchSources: function(update) {
        if (uAnimeCore.sources.componentsStorage.legth == 0 ||
            uAnimeCore.sources.userComponents.legth == 0) {
            uAnimeCore.sources = uAnimeCore.loadSearchSources()
        }
        if(update && update != undefined) {
            uAnimeCore.sources = uAnimeCore.loadSearchSources()
        }
        return uAnimeCore.sources
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