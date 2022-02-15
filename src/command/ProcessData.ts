import {Config} from "../model/ConfigFile";
import * as path from "path";
export class Processor {

    async process(config: Config.Main) {
        let data= Object.assign({},config.data);
        const baseDir=path.parse(config.this);

        config.process.map(async process => {
            const module = await import(path.resolve(config.this, process.file));

            data = module(Object.assign({},data),process.args, Object.assign({},config));
        })
    }
}
