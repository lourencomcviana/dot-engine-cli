#!/usr/bin/env node
import yargs from "yargs";
import loadConfigs from "./src/command/FindConfig";
import {executeTemplate, run} from "./src/command/DotCompiling";


yargs.scriptName('dec-cli')
    .usage('$0 <cmd> [args]')
    .command(
        'run [configuration]',
        'run a dec project',
        (yargs) => {
                yargs.positional('configuration', {
                    type: 'string',
                    describe: 'specify the configuration file dec-cli will run. Can be specified as a glob path',
                    default: '**/dec.config.js'
                })
            },
        async function (argv) {
                await execute(argv.configuration as string);
            })
    .demandCommand()
    .showHelpOnFail(true)
    .help()
    .argv

async function execute(globConfigPass:string) {
    const config = await loadConfigs(globConfigPass);

    const templates = await run(config);
    await executeTemplate(config,templates)

}
