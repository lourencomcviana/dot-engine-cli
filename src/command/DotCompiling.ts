
import {RenderFunction, compile as dotCompile} from "dot";
import {findAndReadFiles} from "./Glob";
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
    const fileName = path.parse(templateItem.File.destFile).name;
    fnStr = fnStr.replace(/function (\w+)/, `function ${fileName}`)
    fnStr += `module.exports=${fileName};`
    await fs.writeFile(templateItem.File.destFile, fnStr);
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

function compile(template: string): RenderFunction{
    const templateSettings = {
        strip: true,
        selfcontained:false,
    };

    return dotCompile(template, {templateSettings})
}

