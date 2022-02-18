import {RenderFunction} from "dot";
import * as path from "path";
import {parsedPathToString} from "../command/DotCompiling"



export module TemplateConfig {
    interface ITemplateItem {
        readonly file: FileConfig.File & FileConfig.Destination;
        readonly renderFunction?: RenderFunction;
    }
    export class TemplateItem implements ITemplateItem {
        private readonly _file: FileConfig.File & FileConfig.Destination;
        private _renderFunction: RenderFunction | undefined;

        constructor(
            file: FileConfig.File,
            renderFunction?: RenderFunction
        ) {
            const pathToFile = path.parse(file.srcFile);
            pathToFile.ext = 'js';

            const data:any = Object.assign({}, file);
            data.destFile = parsedPathToString(pathToFile);

            this._file = data;
            // ler arquivo do proccesso?
            if(!renderFunction) {
                this._renderFunction = undefined;
            } else {
                this._renderFunction = renderFunction;
            }
        }

        get file() {
            return this._file
        }

        get renderFunction() {
            return this._renderFunction;
        }

        async BuildRenderFunction(): Promise<RenderFunction> {
            if (this.renderFunction) {
                return this.renderFunction;
            } else {
                const destFile = this.file.destFile
                let evalFun: any;
                try {
                    evalFun = await import(destFile);
                }catch (e) {
                    console.error(e);
                    process.exit(-1);
                }
                this._renderFunction = evalFun.default as RenderFunction;
                return this._renderFunction ;
            }
        }

        async run(args: any) : Promise<TemplateResult>{
            const fun = await this.BuildRenderFunction()
            const result = fun(args);
            return {
                content: result,
                file: this.file,
                renderFunction: fun
            };
        }
    }

    export interface TemplateResult extends ITemplateItem{
        readonly content: string;
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
