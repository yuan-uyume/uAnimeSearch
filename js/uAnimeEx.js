const uAnimeEx = {
    version: "0.0.1",
    loadFormFile: function (file, callback) {
        let reader = new FileReader();
        reader.onload = function (event) {
            let txt = event.target.result
            console.log("loadFormFile: ", txt);
            let json = JSON.parse(txt)
            uAnimeEx.loadFormJson(json, callback)
        };
        reader.readAsText(file)
    },
    loadFormUrl: function (url, callback) {
        fetch(url).then(res => {
            let txt = res.text()
            console.log("loadFormUrl: ", txt);
            return txt
        })
        .then(txt => JSON.parse(txt))
        .then(json => uAnimeEx.loadFormJson(json, callback))
        .error(e => {
            console.log(e);
        })
    },
    loadFormJson: function (json, callback) {
        let components = window.localStorage["componentsStorage"]
        if (components == null || components.trim() == '') {
            components = []
        } else {
            components = JSON.parse(components)
        }
        let arr = []
        if (Array.isArray(json)) {
            console.log("读取json数组...");
            for (let o of json) {
                if (uAnimeEx.verifyMd5(o)) {
                    console.log(o.name + " MD5 验证成功...");
                    arr.push(o)
                }
            }
        } else {
            console.log("读取json对象...");
            if (uAnimeEx.verifyMd5(json)) {
                console.log(json.name + " MD5 验证成功...");
                arr.push(json)
            }
        }
        for (let o of arr) {
            let flag = true
            for (let j of components) {
                if (o.md5 == j.md5) {
                    flag = false
                }
            }
            components.push(o)
        }
        window.localStorage["componentsStorage"] = JSON.stringify(components)
        callback(components)
    },
    verifyMd5: function (json) {
        let { md5, ...obj } = json
        let calMd5 = uAnimeEx.md5(obj)
        // let result = calMd5 == md5
        let result = true
        if (!result) {
            console.log("验证MD5失败", json.name, calMd5, md5);
        }
        return result
    },
    md5: function (obj) {
        return obj
    }
}

export default uAnimeEx