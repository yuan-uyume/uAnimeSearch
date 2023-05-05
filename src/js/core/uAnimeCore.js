import uExt from './uAnimeEx.js'
import $ from 'jquery'
const uAnimeCore = {
    version: "0.0.1",
    sources: {},
    components: {},
    log: function (component, ...txt) {
        console.log(component ? component.name + "(" + component.md5 + ")" : "uAnimeCore", ...txt);
    },
    error: function (component, ...txt) {
        console.error(component ? component.name + "(" + component.md5 + ")" : "uAnimeCore", ...txt);
    },
    debug: function (component, ...txt) {
        console.debug(component ? component.name + "(" + component.md5 + ")" : "uAnimeCore", ...txt);
    },
    replace(txt, ...data) {
        let t = txt, i = 1
        uAnimeCore.debug(null, "replace", txt, data)
        if (t && typeof t == 'string' && t != '') {
            for (let s of data) {
                try {
                    t = t.replaceAll("{" + i + "}", s)
                } catch (e) {
                    while (t.indexOf("{" + i + "}") > -1) {
                        t = t.replace("{" + i + "}", s)
                    }
                }

                i++
            }
        }
        return t
    },
    initCore: function () {
        try {
            uAnimeCore.sources = uAnimeCore.loadSearchSources()
            console.log('uAnimeCore init', uAnimeCore);
            return true
        } catch (e) {
            throw e
        }
        return false
    },
    search: function (components, word, limit, callback, collectComponentsResultCallback) {
        let data = []
        let complated = []
        let collectComponentsResult = async function (res) {
            if (res.type == 0) {
                uAnimeCore.log(res.component, res.msg, res.data)
            } else {
                uAnimeCore.error(res.component, res.msg, res.data)
            }
            if (res.data && res.data.length > 0) {
                uAnimeCore.log(res.component, 'addEpsInfoToResultItemsByHtml')
                await uAnimeCore.addEpsInfoToResultItemsByHtml(res.component, res.data)
                data.push(...res.data)
            }
            complated.push({
                source: res.component.name,
                sourceMd5: res.component.md5,
                status: res.type,
                msg: res.msg
            })
            uAnimeCore.log(null, uAnimeCore.replace("a source complated, complated {1} total {2}", complated.length, components.length), res.component)
            if (complated.length >= components.length) {
                callback({
                    sources: complated,
                    data: data
                })
            }
        }
        if (collectComponentsResultCallback && typeof collectComponentsResultCallback == 'function') {
            collectComponentsResult = collectComponentsResultCallback
        }
        if (uAnimeCore.sources.length < 1) {
            uAnimeCore.initCore()
        }
        console.log('uCore start search:', word, limit, components)
        for (let cp of components) {
            cp.search.api ? uAnimeCore.searchAnime(cp, word, limit, collectComponentsResult) :
                uAnimeCore.searchAnimeByHtml(cp, word, limit, collectComponentsResult)
        }
    },
    searchAnime: function (component, word, limit, callback) {

    },
    searchAnimeByHtml: async function (component, word, limit, callback) {
        // limit 为限制属性
        uAnimeCore.getSearchPageHtml(component, word)
            .then(html => {
                if (!html || html.trim() == '') {
                    return callback({
                        type: 1,
                        component: component,
                        msg: "获取番剧页html失败，番剧消失在了异次元",
                        data: []
                    })
                }
                let dom = uAnimeCore.transaleTextToDom(html)
                let page = uAnimeCore.parsePage(component, dom)
                uAnimeCore.log(component, "search word: " + word, page)
                if (page && (page.pageNum == 0 || page.total == 0)) {
                    return callback({
                        type: 1,
                        msg: "搜索成功，无结果！",
                        component: component,
                        data: []
                    })
                }
                let data = []
                let currentPage = 1
                let resultItems = uAnimeCore.getResultItemFromHtml(html, component)   
                if (resultItems.length == 0) {
                    return callback({
                        type: 1,
                        msg: "搜索成功，无结果！",
                        component: component,
                        data: []
                    })
                }
                // 如果没有结束页码，就一页一页找找到没有为止
                if (!page || page.pageNum == undefined || page.pageNum == NaN) {
                    page.pageNum = -1
                }
                // 已经获取到这次搜索的页码数据，获取第一页的数据
                // 收集结果并判断是否结束
                uAnimeCore.collectSearchResult(component, data, resultItems, word, currentPage, page, limit)
                    .then(result => {
                        if (result) {
                            callback({
                                type: 0,
                                msg: "搜索成功！只有一页",
                                component: component,
                                data: data
                            })
                        } else {
                            // 获取下一页
                            uAnimeCore.getSearchResultByHtml(component, word, ++currentPage, limit, page, data, callback)
                        }
                    })
            })
    },
    collectSearchResult: function (component, data, addData, word, currentPage, page, limit) {
        return new Promise((resolve, reject) => {
            uAnimeCore.log(component, uAnimeCore.replace("collect {1} page {2}", word, currentPage), addData)
            if (data.length + addData.length > limit) { 
                addData = addData.slice(0, limit - data.length)
            }
            data.push(...addData)
            // page.pageNum == -1 时无法获取页码 那就一页一页找，站到没有为止
            if (data.length >= page.total || (data.length >= limit && limit > 0) || currentPage == page.pageNum) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
    },
    loadSearchSources: function () {
        // 从本地储存中获取搜索组件
        let sources = {}
        let componentsStorage = JSON.parse(window.localStorage["componentsStorage"] ? window.localStorage["componentsStorage"] : "{}")
        sources.componentsStorage = componentsStorage
        sources.userComponents = {}
        console.log('load components', componentsStorage.md5, componentsStorage.name);
        let userComponentsHashAddr = JSON.parse(window.localStorage["userComponentsHash"] ? window.localStorage["userComponentsHash"] : "[]")
        if (userComponentsHashAddr == null || userComponentsHashAddr.length == 0) {
            console.log('components load complated 1', sources);
            return sources
        }
        for (let hash of userComponentsHashAddr) {
            let userComponents = JSON.parse(window.localStorage[hash])
            sources.userComponents[hash] = userComponents
            console.log('load components hash', userComponents.md5, userComponents.name);
        }
        console.log('components load complated 2', sources);
        return sources
    },
    saveSearchSources: function (data, sys) {
        if (sys) {
            window.localStorage["componentsStorage"] = JSON.stringify(data)
        } else {
            let key = []
            for (let d of data) {
                uExt.updateMd5(d)
                key.push(d.md5)
                window.localStorage[d.md5] = JSON.stringify(d)
            }
            window.localStorage["userComponentsHash"] = JSON.stringify(key)
        }
    },
    getSearchSources: function (update) {
        if (update || update != undefined) {
            uAnimeCore.sources = uAnimeCore.loadSearchSources()
        } else {
            if (!(uAnimeCore.sources.userComponents &&
                uAnimeCore.sources.componentsStorage) ||
                uAnimeCore.sources.userComponents.length == 0) {
                uAnimeCore.sources = uAnimeCore.loadSearchSources()
            }
        }
        return uAnimeCore.sources
    },
    transaleTextToDom: function (text) {
        let layout = window.document.createElement('div')
        layout.innerHTML = text
        uAnimeCore.debug(null, 'transaleTextToDom', layout)
        return layout
    },
    parsePage: function (component, dom) {
        let total = uAnimeCore.parseDom(dom, component.htmlDataTrans.page.total)
        let pageNum = uAnimeCore.parseDom(dom, component.htmlDataTrans.page.pageNum)
        let page = {
            total: parseInt(total),
            pageNum: parseInt(pageNum),
            limit: parseInt(component.htmlDataTrans.page.limit)
        }
        if (page && (page.pageNum == undefined || page.pageNum == null || page.pageNum == NaN)) {
            page.pageNum = uAnimeCore.getPageNum(page.total, component.htmlDataTrans.page.limit)
        }
        return page
    },
    parseText: function (text, rule) {
        return uAnimeCore.parseDom(uAnimeCore.transaleTextToDom(text), rule)
    },
    parseDom: function (dom, rule) {
        if (rule && !('find' in rule)) {
            console.error("uCore parse dom :no rule OR no attr 'find' in rule", rule)
            return null
        }
        let find = null
        try {
            find = $(dom)[0]
            this.debug(null, rule, find)
            for (let el of rule.find) {
                if (typeof el == 'number') {
                    if (el == -1) {
                        find = $(find).children()
                    } else {
                        find = find[el]
                    }
                } else {
                    find = $(find).find(el)
                }
                this.debug(null, el, rule, find)
            }
        } catch (e) {
            console.error('pares error', e, rule)
            return null
        }

        if ('attr' in rule && rule.attr.trim() != '') {
            try {
                find = find[rule.attr] || $(find).attr(rule.attr) || $(find).data(rule.attr.split("-")[1])
                this.debug(null, rule.attr, rule, find)
            } catch (e) {
                console.error(uAnimeCore.replace("uCore parse dom : no attr '{1}' in rule", rule.attr))
                return null
            }
        }
        if ('clean' in rule && rule.clean.trim() != '' && typeof find == 'string' && find) {
            let reg = RegExp(rule.clean);
            if (find.match(reg)) {
                find = RegExp.$1
                this.debug(null, rule.clean, rule, find)
            } else {
                find = null
            }
        }
        this.debug(null, "parse end", rule, find)
        return find
    },
    getPageNum: function (total, limit) {
        let page = parseInt(total / limit)
        if (total % limit > 0) {
            page++
        }
        return page
    },
    getUrl: function (component, page) {
        let url = component.search.site + (page ? component.search.page : component.search.path)
        console.log('url', url);
        return url ? url : ''
    },
    getHtmlFromUrl: function (component, url) {
        uAnimeCore.debug(component, 'getHtmlFromUrl', url)
        return new Promise((resole, reject) => {
            fetch(url)
                .then(res => res.text())
                .then(txt => {
                    resole(txt)
                })
                .catch(e => {
                    uAnimeCore.error(component, e)
                    resole(null)
                })
        })
    },
    getSearchPageHtml: async function (component, word) {
        let url = uAnimeCore.replace(uAnimeCore.getUrl(component), word)
        uAnimeCore.log(component, uAnimeCore.replace("getSearchPageHtml word({1}) from {2}", word, url))
        return uAnimeCore.getHtmlFromUrl(component, url)
    },
    getSearchResultByHtml: function (component, word, currentPage, limit, page, data, callback) {
        let url = uAnimeCore.replace(uAnimeCore.getUrl(component, true), word, currentPage)
        uAnimeCore.log(component, uAnimeCore.replace("search word {1} page {2} (l: {3}) from {4}", word, currentPage, limit, url))
        fetch(url)
            .then(res => res.text())
            .then(resultHtml => {
                if(!resultHtml || resultHtml.trim() == '') {
                    return callback({
                        type: 0,
                        msg: "搜索成功(中止)！page:"+currentPage,
                        component: component,
                        data: data
                    })
                }
                let resultItems = uAnimeCore.getResultItemFromHtml(resultHtml, component)
                // 发送网络请求获取结果
                if (resultItems.length == 0) {
                    return callback({
                        type: 0,
                        msg: "搜索成功(中止)！page:"+currentPage,
                        component: component,
                        data: data
                    })
                }
                uAnimeCore.collectSearchResult(component, data, resultItems, word, currentPage, page, limit)
                    .then(result => {
                        if (result) {
                            callback({
                                type: 0,
                                msg: "搜索成功！page:"+currentPage,
                                component: component,
                                data: data
                            })
                        } else {
                            uAnimeCore.getSearchResultByHtml(component, word, ++currentPage, limit, page, data, callback)
                        }
                    })
            })
            .catch(e => {
                uAnimeCore.error(component, e)
                callback({
                    type: 1,
                    msg: "搜索中止...",
                    component: component,
                    data: data
                })
            })
    },
    getResultItemFromHtml: function (html, component) {
        let items = uAnimeCore.parseText(html, component.htmlDataTrans.anime.arr)
        let parseItems = []
        for (let item of items) {
            let parseItem = {}
            // 普通属性
            for (let key of ['title', 'image', 'info', 'url']) {
                parseItem[key] = uAnimeCore.parseDom(item, component.htmlDataTrans.anime[key])
                if (parseItem[key]) {
                    if (['url', 'image'].includes(key)) {
                        if (parseItem[key].startsWith(chrome.runtime.getURL("/"))) {
                            parseItem[key] = parseItem[key].replaceAll(chrome.runtime.getURL("/"), '')
                            if (!parseItem[key].startsWith("/")) {
                                parseItem[key] = '/' + parseItem[key]
                            }
                            parseItem[key] = component.search.site + parseItem[key]
                        }
                        if (parseItem[key].startsWith("/")) {
                            parseItem[key] = component.search.site + parseItem[key]
                        }
                    } else {
                        parseItem[key] = parseItem[key].replaceAll("\t", "").replaceAll("/", "")
                    }
                }
            }
            parseItem.md5 = uExt.resultMd5(parseItem)
            parseItem.source = component.name
            parseItem.sourceHash = component.md5
            parseItems.push(parseItem)
        }
        uAnimeCore.log(component, "getResultItemFromHtml parseItems:", parseItems)
        return parseItems
    },
    getComponent: function(key, update) {
        if (update) {
            uAnimeCore.components = uAnimeCore.genComponents()
        } else if (!(key in uAnimeCore.components)){
            uAnimeCore.components = uAnimeCore.genComponents()
        }
        let result = uAnimeCore.components[key] || null
        uAnimeCore.debug(null, "getComponent", key, result)
        return result
    },
    genComponents: function() {
        let sources = uAnimeCore.getSearchSources(true)
        let result = {}
        let componentsStorage = sources.componentsStorage
        let userComponents = sources.userComponents
        // console.log(Object.keys(componentsStorage));
        // console.log('componentsStorage',componentsStorage && Object.keys(componentsStorage) > 0,'userComponents',componentsStorage && Object.keys(componentsStorage) > 0);
        if (componentsStorage && Object.keys(componentsStorage).length > 0) {
            for (let rule of componentsStorage.rules) {
                result[rule.md5] = rule
            }
        }
        if (userComponents && Object.keys(userComponents).length > 0) {
            for (let component of userComponents) {
                for (let rule of component.rules) {
                    result[rule.md5] = rule
                }
            }
        }
        uAnimeCore.components = result
        uAnimeCore.debug(null, "uAnimeCore.components", uAnimeCore.components)
        return uAnimeCore.components
    },
    addEpsInfoToResultItemsByHtml: function (component, resultItems) {
        return new Promise(resolve => {
            let i = 0
            if (resultItems.length == 0) {
                return resolve(resultItems)
            }
            let j = 0
            for (let item of resultItems) {
                if (item.url && item.url.trim() != '') {
                    uAnimeCore.getHtmlFromUrl(component, item.url).then(html => {
                        uAnimeCore.log(component, "get eps for ", item, item.url)
                        if (html && html.trim() != '') {
                            let eps = uAnimeCore.parseText(html, component.htmlDataTrans.anime.eps.arr)
                            uAnimeCore.debug(component, "addEpsInfoToResultItemsByHtml", item, eps)
                            let epsData = []
                            for (let ep of eps) {
                                let epData = {}
                                for (let key of ['title', 'url']) {
                                    epData[key] = uAnimeCore.parseDom(ep, component.htmlDataTrans.anime.eps[key])
                                    if (key == 'url') {
                                        if (epData[key].startsWith(chrome.runtime.getURL("/"))) {
                                            epData[key] = epData[key].replaceAll(chrome.runtime.getURL("/"), '')
                                            if (!epData[key].startsWith("/")) {
                                                epData[key] = '/' + epData[key]
                                            }
                                            epData[key] = component.search.site + epData[key]
                                        }
                                    }
                                }
                                epsData.push(epData)
                            }
                            item.eps = epsData
                        }
                        if (++i >= resultItems.length) {
                            resolve(resultItems)
                        }
                    })
                } else {
                    if (++j >= resultItems.length) {
                        resolve(resultItems)
                    }
                }
            }
        })
    },
    updateEpsInfoForResultItemByHtml: function (item) {
        return new Promise((resolve , reject) => {
            let component = uAnimeCore.getComponent(item.sourceHash)
            if (component == null) {
                component = uAnimeCore.components.filter(d => {
                    d.name == item.name
                })
                if (component && component.length > 0) {
                    component = component[0]
                    item.sourceHash = component.MD5
                } else {
                    resolve(item)
                }
            }
            if (item.url && item.url.trim() != '') {
                uAnimeCore.getHtmlFromUrl(component, item.url).then(html => {
                    uAnimeCore.log(component, "get eps for ", item, item.url)
                    if (html && html.trim() != '') {
                        let eps = uAnimeCore.parseText(html, component.htmlDataTrans.anime.eps.arr)
                        uAnimeCore.debug(component, "addEpsInfoToResultItemsByHtml", item, eps)
                        let epsData = []
                        for (let ep of eps) {
                            let epData = {}
                            for (let key of ['title', 'url']) {
                                epData[key] = uAnimeCore.parseDom(ep, component.htmlDataTrans.anime.eps[key])
                                if (key == 'url') {
                                    if (epData[key].startsWith(chrome.runtime.getURL("/"))) {
                                        epData[key] = epData[key].replaceAll(chrome.runtime.getURL("/"), '')
                                        if (!epData[key].startsWith("/")) {
                                            epData[key] = '/' + epData[key]
                                        }
                                        epData[key] = component.search.site + epData[key]
                                    }
                                }
                            }
                            epsData.push(epData)
                        }
                        item.eps = epsData
                    }
                    resolve(item)
                })
            }
        })
    }
}

export default uAnimeCore