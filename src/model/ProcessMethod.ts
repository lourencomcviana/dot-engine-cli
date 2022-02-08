import {Config} from "./ConfigFile";
export interface ProcessMethod {
    (data: object, args: object, config: Config.Main): Promise<any>
}
