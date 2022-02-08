import {promise as glob} from "glob-promise";
import * as fs from "fs-extra";

/***
 * get jst files
 * @param globPath
 */
export async function findFiles(globPath: string): Promise<string[]>{
    return glob(globPath)
        .then( files =>{
            if(files.length===0){
                throw new Error(`no file found for '${globPath}'`);
            }
            return files
        })
}

export async function readFiles(files: string[]): Promise<string[]> {
    const promisses = files.map(file =>
        fs.readFile(file,'UTF-8')
    )

    return Promise.all(promisses);
}

export async function findAndreadFiles(globPath: string): Promise<string[]> {
    const files = await findFiles(globPath);
    return await readFiles(files);
}
