import {genFinalFilePath} from "@app/command/DotCompiling";
import {TemplateConfig} from "@app/model/Template";
import TemplateResult = TemplateConfig.TemplateResult;
import {Config} from "@app/model/ConfigFile";
import * as path from "path";

function mockConfig(): Config.Main {
    return {
        "outDir":"./dist",
        "jst":"./models/*.jst",
        "name":"bin/hello-world.html",
        sameFileAppend: true,
        "data":{
            "name":"test"
        },
        "this": '',
        path: path.parse('./'),
        process: []
    }
}

function mockTemplateResult(): TemplateResult {
    return {
        file: {
            srcFile: './a',
            destFile:'./b',
            content: 'test'
        },
        content:'',
        renderFunction: function (){return 'test'}
    }
}

test('test static genFileName', async () => {
    const config = mockConfig()
    const templateResult = mockTemplateResult()
    const fileName = await genFinalFilePath(config,templateResult );
    expect(fileName).toBe(path.resolve(process.cwd(),`bin${path.sep}hello-world.html`));
});
