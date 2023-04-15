import MD5 from '../lib/md5.js'
const uAnimeEx = {
    version: "0.0.1",
    loadFormFile: function (file, callback) {
        try {
            let reader = new FileReader();
            reader.onload = function (event) {
                let txt = event.target.result
                console.log("loadFormFile: ", txt);
                let json = JSON.parse(txt)
                uAnimeEx.loadFormJson(json, callback)
            };
            reader.readAsText(file)
        } catch (e) {
            callback(null)
        }
    },
    loadFormUrl: function (url, callback, sys) {
        fetch(url).then(res => res.text())
            .then(txt => {
                let json = JSON.parse(txt);
                console.log("loadFormUrl: ", json)
                uAnimeEx.loadFormJson(json, callback, sys)
            })
            .catch(e => {
                console.log("fetch error:", e);
                callback(null)
            })
    },
    loadFormJson: function (json, callback, sys) {
        try {
            console.log("loadFormJson: ", json)
            if (!uAnimeEx.verifyMd5Arr(json.rules)) {
                callback(null)
                return
            }

            if (!uAnimeEx.verifyMd5(json)) {
                console.error(json.id, json.name, "验证md5失败停止导入");
                callback(null)
                return
            }

            if (sys) {
                console.log("load json to componentsStorage", sys);
                window.localStorage["componentsStorage"] = JSON.stringify(json)
                callback(json)
            } else {
                console.log("load json to userComponents", sys);
                let userComponentsHashAddr = JSON.parse(window.localStorage["userComponentsHash"] ? window.localStorage["userComponentsHash"] : "[]")
                let ohash = json.md5, flag = false
                for (let hash of userComponentsHashAddr) {
                    let userComponent = JSON.parse(window.localStorage[hash])
                    if (json.id == userComponent.id) {
                        // 替换
                        ohash = hash
                        flag = true
                    }
                }
                if (json.md5 != ohash) {
                    delete window.localStorage[ohash]
                    let index = userComponentsHashAddr.indexOf(ohash);
                    if (index > -1) {
                        userComponentsHashAddr.splice(index, 1);
                    }
                }
                if (!(flag && json.md5 == ohash)) {
                    window.localStorage[json.md5] = JSON.stringify(json)
                    userComponentsHashAddr.push(json.md5)
                    window.localStorage["userComponentsHash"] = JSON.stringify(userComponentsHashAddr)
                }
                callback(json)
            }
        } catch (e) {
            callback(null)
        }
    },
    verifyMd5Arr: function (arr) {
        let flag = true
        for (let json of arr) {
            if (!uAnimeEx.verifyMd5(json)) {
                flag = false
            }
        }
        return flag
    },
    verifyMd5: function (json) {
        let { md5, ...obj } = json
        let calMd5 = uAnimeEx.md5(obj)
        let result = calMd5 == md5
        // let result = true
        if (!result) {
            console.log("验证MD5失败", json.name, calMd5, md5);
        }
        return result
    },
    md5: function (obj) {
        return MD5.hex_md5(JSON.stringify(obj))
    },
    updateMd5: function (data) {
        let { md5, ...obj } = data
        data.md5 = uAnimeEx.md5(obj)
        return data
    }
}

export default uAnimeEx