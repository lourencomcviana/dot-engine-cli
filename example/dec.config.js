module.exports = {
    "outDir":"./dist",
    "jst":"./models/*.jst",
    "name":"bin/hello-world.html",
    // allow to append results in one file instead of ovewrite
    "sameFileAppend": true,
    "data":{
        "name":"test"
    },
    "dot": {
        "strip": false
    }
}
