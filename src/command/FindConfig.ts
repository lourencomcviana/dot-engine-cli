import {findFiles} from "./Glob";
import inquirer from "inquirer";
import path from "path";
import {Config} from "../model/ConfigFile";

export default async function  loadConfigs(globConfigPass:string): Promise<Config.Main> {
    const configPath = await findConfig(globConfigPass);
    const configAbsolutePath = path.resolve(process.cwd(),configPath);
    const config = await import(configAbsolutePath);
    const configModule =  config.default as Config.Main
    configModule.this = configAbsolutePath;
    configModule.path = path.parse(configAbsolutePath);
    return configModule;
}

export async function findConfig(globConfigPass:string) {
    const configs = await findFiles(globConfigPass);
    // possibilidade de rodar várias configs?
    if(configs.length > 1) {
        const choises =  configs.map(filepath => {
            return {
                name: filepath
            }
        })
        const saida =  await inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'select one configuration file',
                    name: 'config',
                    choices: [
                        new inquirer.Separator(' = Files = '),
                        ...choises
                    ]
                }
            ]);
        return saida.config;
    } else if(configs.length === 1 ) {
        return configs[0]
    } else {
        throw new Error('No configuration file found. Configuration should be named "dec.config.js"')
    }
}
