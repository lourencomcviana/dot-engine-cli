import {promise as glob} from "glob-promise";
import {IOptions } from 'glob'
import * as fs from "fs-extra";
import {FileConfig} from "../model/Template";
import {Config} from "../model/ConfigFile";
import isMain = Config.isMain;

/***
 * get jst files
 * @param globPath
 * @param options glob options
 */
export async function findFiles(globPath: string, options:  IOptions | Config.Main = {}): Promise<string[]>{
    let _options:IOptions;
    if(isMain(options)) {
        _options = {cwd: (options as Config.Main).path.dir}
    } else {
        _options = options as IOptions;
    }
    _options.absolute = true;
    return glob(globPath, _options)
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

export async function findAndReadFiles(globPath: string, options:  IOptions | Config.Main = {}): Promise<FileConfig.GlobFile> {
    const files = await findFiles(globPath, options);
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
