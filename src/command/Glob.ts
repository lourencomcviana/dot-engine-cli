import {promise as glob} from "glob-promise";
import * as fs from "fs-extra";
import {FileConfig} from "../model/Template";

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

export async function readFiles(files: string[]): Promise<FileConfig.File[]> {

    const configs = files.map(file => {
        return createFileConfig(file)
    }).map(async fileConfig => {
        const content =  await fs.readFile(fileConfig.srcFile, 'UTF-8')
        return {
            srcFile: fileConfig.srcFile,
            content: content
        };
    })
   return Promise.all(configs);
}

export async function findAndReadFiles(globPath: string): Promise<FileConfig.GlobFile> {
    const files = await findFiles(globPath);
    return {
        glob: globPath,
        found: await readFiles(files)
    };
}

function createFileConfig(file: string): FileConfig.Option{
    return {
        srcFile: file
    }
}
