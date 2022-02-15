import {RenderFunction} from "dot";
import * as path from "path";
import {parsedPathToString} from "../command/DotCompiling";
import * as fs from "fs-extra";


export module TemplateConfig {
    export class TemplateItem {
        private readonly file: FileConfig.File & FileConfig.Destination;
        private renderFunction: RenderFunction | undefined;
        constructor(
            file: FileConfig.File,
            renderFunction?: RenderFunction
        ) {
            const pathToFile = path.parse(file.srcFile);
            pathToFile.ext = 'js';

            const data:any = file;
            data.destFile = parsedPathToString(pathToFile);

            this.file = data;
            // ler arquivo do proccesso?
            if(!renderFunction) {
                this.renderFunction = undefined;
            } else {
                this.renderFunction = renderFunction;
            }
        }


        get File() {
            return this.file
        }

        async BuildRenderFunction(): Promise<RenderFunction> {
            if (this.renderFunction) {
                return this.renderFunction;
            } else {
                const destFile = path.resolve(process.cwd(),this.file.destFile)
                let evalFun: any;
                try {
                    evalFun = await import(destFile);
                }catch (e) {
                    console.error(e);
                    process.exit(-1);
                }
                this.renderFunction = evalFun.default as RenderFunction;
                return this.renderFunction ;
            }
        }

        async run(...args: any[]) : Promise<string>{
            const fun = await this.BuildRenderFunction()
            return fun(args);
        }
    }

    export interface Templates extends FileConfig.Glob{
        itens: TemplateItem[]
    }
}


export module FileConfig{
    export interface Option {
        srcFile: string
    }

    export interface File extends Option{
        content: string
    }

    export interface GlobFile extends Glob{
        found: File[]
    }

    export interface Glob {
        glob: string
    }

    export interface Destination {
        destFile: string
    }
}
