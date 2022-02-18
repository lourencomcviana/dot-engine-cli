import {Config} from "./ConfigFile";
import {TemplateConfig} from "./Template";
import TemplateResult = TemplateConfig.TemplateResult;
export interface ProcessMethod {
    (data: object, args: object, config: Config.Main): Promise<any>
}

export interface ProcessName {
    (config: Config.Main, template: TemplateResult): Promise<string>
}

