import uExt from './uAnimeEx.js'
import $ from 'jquery'
const uAnimeCore = {
    version: "0.0.1",
    sources: [],
    log: function (component, ...txt) {
        console.log(component? component.name + "(" + component.md5 + ")" : "uAnimeCore", ...txt);
    },
    error: function (component, ...txt) {
        console.error(component? component.name + "(" + component.md5 + ")" : "uAnimeCore", ...txt);
    },
    debug: function (component, ...txt) {
        console.debug(component? component.name + "(" + component.md5 + ")" : "uAnimeCore", ...txt);
    },
    replace(txt, ...data) {
        let t = txt, i = 1
        for (let s of data) {
            t = t.replaceAll("{" + i + "}", s)
            i++
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
    search: function(components, word, limit, callback) {
        let data = []
        let complated = []
        let collectComponentsResult = function(res) {
            if (res.type == 0) {
                uAnimeCore.log(res.component, res.msg, res.data)
            } else {
                uAnimeCore.error(res.component, res.msg, res.data)
            }
            if (res.type == 0) {
                data.push[res.data]
            }
            complated.push[res.component.md5]
            if (complated.length >= components.legth) {
                callback({

                })
            }
        }
        if (uAnimeCore.sources.length < 1) {
            uAnimeCore.initCore()
        }
        console.log('uCore start search:', word, limit, components)
        for (let cp of components) {
            cp.search.api ? uAnimeCore.searchAnime(cp, word, limit, collectComponentsResult) : 
            uAnimeCore.searchAnimeHtml(cp, word, limit, collectComponentsResult)
        }
    },
    searchAnime: function (component, word, limit, callback) {
        
    },
    searchAnimeHtml: async function (component, word, limit, callback) {
        try {
            let page = await uAnimeCore.getSearchPageHtml(component, word, limit) // total pageNum limit
            if (page && (page.pageNum == undefined || page.pageNum == null)) {
                page.pageNum = uAnimeCore.getPageNum(page.total, component.htmlDataTrans.page.limit)
            }
            uAnimeCore.log(component, "search word: " + word, page)
            if (!page || page.pageNum == undefined || page.pageNum == null || page.pageNum < 1) {
                return callback({
                    type: 1,
                    component: component,
                    msg: "获取番剧页数失败，番剧消失在了异次元",
                    data: []
                })
            }
            uAnimeCore.getSearchResultHtml(component, word, 1, limit, page, data, callback)
        } catch (e) {
            return callback({
                type: 1,
                msg: e,
                component: component,
                data: []
            })
        }
    },
    loadSearchSources: function () {
        // 从本地储存中获取搜索组件
        let sources = {}
        let componentsStorage = JSON.parse(window.localStorage["componentsStorage"] ? window.localStorage["componentsStorage"] : "[]")
        sources.componentsStorage = componentsStorage
        sources.userComponents = {}
        console.log('load components', componentsStorage.name);
        let userComponentsHashAddr = JSON.parse(window.localStorage["userComponentsHash"] ? window.localStorage["userComponentsHash"] : "[]")
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
    saveSearchSources: function (data, sys) {
        if (sys) {
            window.localStorage["componentsStorage"] = JSON.stringify(data)
        } else {
            let key = []
            for (let d of data) {
                let { m, ...obj } = d
                d.md5 = uExt.md5(obj)
                key.push(d.md5)
                window.localStorage[d.md5] = JSON.stringify(d)
            }
            window.localStorage["userComponentsHash"] = JSON.stringify(key)
        }
    },
    getSearchSources: function (update) {
        if (uAnimeCore.sources.componentsStorage.legth == 0 ||
            uAnimeCore.sources.userComponents.legth == 0) {
            uAnimeCore.sources = uAnimeCore.loadSearchSources()
        }
        if (update && update != undefined) {
            uAnimeCore.sources = uAnimeCore.loadSearchSources()
        }
        return uAnimeCore.sources
    },
    getSearchPageHtml:async function (component, word, limit) {
        let url = uAnimeCore.replace(uAnimeCore.getUrl(component), word)
        uAnimeCore.log(component, uAnimeCore.replace("getSearchPageHtml word({1}) from {2}", word, url))
        return new Promise((resole, reject) => {
            fetch(url)
            .then(res => res.text())
            .then(txt => {
                this.debug(component, word, txt)
                let total = uAnimeCore.parseText(txt, component.htmlDataTrans.page.total)
                let pageNum = uAnimeCore.parseText(txt, component.htmlDataTrans.page.pageNum)
                resole({
                    total: parseInt(total),
                    pageNum: parseInt(pageNum)
                })
            })
            .catch(e =>{
                uAnimeCore.error(component, e)
                resole({})
            })
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
                component: component,
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
    getUrl: function (component) {
        return component.search.site + component.search.path
    },
    transaleDom: function (text) {
        let layout = window.document.createElement('div')
        layout.innerHTML = text
        uAnimeCore.debug(null, 'transaleDom', layout)
        return layout
    },
    parseText: function (text, rule) {
        return uAnimeCore.parseDom(uAnimeCore.transaleDom(text), rule)
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
            console.error('pares error', e , rule) 
            return null
        }
        
        if ('attr' in rule) {
            try {
                find = find[rule.attr]
                this.debug(null, rule.attr, rule, find)
            } catch (e) {
                console.error(uAnimeCore.replace("uCore parse dom : no attr '{1}' in rule", rule.attr)) 
                return null
            }
        }
        if ('clean' in rule) {
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
    getPageNum: function(total, limit) {
        let page = parseInt(total / limit)
        if (total % limit > 0) {
            page ++
        }
        return page
    }
}

export default uAnimeCore