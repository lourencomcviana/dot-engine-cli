
import * as dot from 'dot';
import {RenderFunction, template} from "dot";
import {promise as glob} from "glob-promise";
import * as fs from 'fs-extra';
/***
 * get jst files
 * @param directory
 */
export async function findJstFiles(directory: string): Promise<string[]>{
    return glob(directory)
        .then( files =>{
            if(files.length==0){
                throw new Error(`no file found for '${directory}'`);
            }
            return files
        })
}

export async function readJstFiles(files: string[]): Promise<string[]> {
    const promisses = files.map(file =>
        fs.readFile(file,'UTF-8')
    )

    return Promise.all(promisses);
}

/***
 * use dotjs to generate functions
 * @param template
 */
export function compile(template: string | string[]): RenderFunction[]{
    const templateSettings = {
        strip: true
    };
    let templatesToCompile: string[];
    if(typeof template === 'string') {
        templatesToCompile = [template]
    } else {
        templatesToCompile = template;
    }
    return templatesToCompile.map(templateToCompile =>
        dot.compile(templateToCompile, templateSettings)
    )
}

export  async function run(directory: string, data: object) : Promise<string[]> {
    const templates = await readAndCompile(directory);
    return templates.map(template => template(data))
}

export default async function readAndCompile(directory: string) : Promise<RenderFunction[]> {
    const files = await findJstFiles(directory);
    const filesContents = await readJstFiles(files);
    return compile(filesContents);

}
