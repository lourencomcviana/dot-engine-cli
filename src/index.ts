#!/usr/bin/env node
import {readAndCompile, run, write} from "./command/DotCompiling";
import {Config} from "./model/ConfigFile";
import Main = Config.Main;
import {TemplateConfig} from "./model/Template";
import {findAndReadFiles} from "./command/Glob";

const dt = {
    name:'test'
};

const config = {
    jst: './example/**.jst',
    data: dt
} as Main

const x =run(config)
    .then(y =>{
        findAndReadFiles(config.jst)
            .then(files => files.found[0])
            .then(file => {
                new TemplateConfig.TemplateItem(
                    file
                ).run(config.data)
            })
    })



// findAndReadFiles(config.jst)
//     .then(files => files.found[0])
//     .then(file => {
//         new TemplateConfig.TemplateItem(
//             file
//         ).run(config.data)
//     })
