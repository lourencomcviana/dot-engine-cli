
import {RenderFunction, compile as dotCompile} from "dot";
import {createDirectories, findAndReadFiles} from "./Glob";
import * as fs from "fs-extra";
import {TemplateConfig} from "../model/Template";
import * as path from "path";
import {ParsedPath} from "path";
import {Config} from "../model/ConfigFile";
import {IOptions} from "glob";

/***
 * use dotjs to generate functions
 * @param directory
 * @param options
 */
export async function readAndCompile(directory: string, options:  IOptions | Config.Main) : Promise<TemplateConfig.Templates> {
    const filesContents = await findAndReadFiles(directory, options);
    const itens = filesContents.found.map( fileContent => {
        const templateFn = compile(fileContent.content);
        return new TemplateConfig.TemplateItem(fileContent, templateFn);
    });

    return {
        itens: itens,
        glob: filesContents.glob
    };
}


export async function write(templateItem: TemplateConfig.TemplateItem) : Promise<void> {
    let fnStr = (await templateItem.BuildRenderFunction()).toString();
    const fileName = path.parse(templateItem.file.destFile).name;
    fnStr = fnStr.replace(/function (\w+)/, `function ${fileName}`)
    fnStr += `module.exports=${fileName};`
    await fs.writeFile(templateItem.file.destFile, fnStr);
}

export function parsedPathToString(parsedPath: ParsedPath) {
    let newPath  =  path.join(parsedPath.dir, `${parsedPath.name}.${parsedPath.ext}`)
    return parsedPath.dir.startsWith(".") ? `.${path.sep}${newPath}` : newPath
}

export async function run(config: Config.Main ) {

    const templates = await readAndCompile(config.jst, config);

    const toWriteItens = templates.itens.map(item => write(item))
    await Promise.all(toWriteItens)
    return templates;

}

export async function executeTemplate(config: Config.Main, templates: TemplateConfig.Templates) {
    const results = await Promise.all(templates.itens.map (item =>  item.run(config.data)));

    const savePromisses =  results.map(async templateResult => {
        const fileName =  await genFinalFilePath(config, templateResult);
        createDirectories(path.parse(fileName).dir);
        return fs.writeFile(fileName,templateResult.content)
    })

    await Promise.all(savePromisses);
}

function genFinalFilePath(config: Config.Main, templateResult: TemplateConfig.TemplateResult){
    if (typeof config.name === 'function') {
        const processName = config.name;
        return processName(config, templateResult )
    } else if(typeof config.name === 'string') {
        return path.resolve(config.path.dir, config.name);
    } else {
        throw new Error('Type of naming function is not valid')
    }


}

function compile(template: string): RenderFunction{
    const templateSettings = {
        strip: true,
        selfcontained:false,
    };

    return dotCompile(template, {templateSettings})
}

