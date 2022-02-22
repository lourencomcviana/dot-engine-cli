import yargs from "yargs";
import loadConfigs from "@app/command/FindConfig";
import {executeTemplate, executeCompilation, readCompiled} from "@app/command/DotCompiling";
import {hello} from "@modules/hello";

hello();
export function mainUi() {
    yargs.scriptName('dec')
        .usage('$0 <cmd> [args]')
        .command(
            'run [configuration]',
            'run a dec project',
            (yargs) => {
                yargs.positional('configuration', {
                    type: 'string',
                    describe: 'specify the configuration file dec-cli will run. Can be specified as a glob path',
                    default: '**/dec.config.js'
                }).option('c', {
                    type: 'boolean',
                    describe: 'if should compile before running',
                })
            },
            async function (argv) {
                await execute(argv.configuration as string, !!argv.c);
            })
        .command(
            'compile [configuration]',
            'compile a dec project',
            (yargs) => {
                yargs.positional('configuration', {
                    type: 'string',
                    describe: 'specify the configuration file dec-cli will run. Can be specified as a glob path',
                    default: '**/dec.config.js'
                })
            },
            async function (argv) {
                await compile(argv.configuration as string);
            })
        .demandCommand()
        .showHelpOnFail(true)
        .help()
        .argv
}
async function execute(globConfigPass:string, shouldCompile:boolean) {
    const config = await loadConfigs(globConfigPass);
    let templates;
    if(shouldCompile) {
        templates = await executeCompilation(config)
    } else {
        templates = await readCompiled(config);
    }
    await executeTemplate(config,templates)

}

async function compile(globConfigPass:string) {
    const config = await loadConfigs(globConfigPass);

    return await executeCompilation(config);
}
