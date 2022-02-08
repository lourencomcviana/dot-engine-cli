
import {RenderFunction, compile as dotCompile} from "dot";
import {findAndreadFiles} from "./Glob";


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
        dotCompile(templateToCompile, templateSettings)
    )
}

export  async function run(directory: string, data: object) : Promise<string[]> {
    const templates = await readAndCompile(directory);
    return templates.map(template => template(data))
}

export default async function readAndCompile(directory: string) : Promise<RenderFunction[]> {
    const filesContents = await findAndreadFiles(directory);
    return compile(filesContents);

}
