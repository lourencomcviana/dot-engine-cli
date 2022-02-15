#!/usr/bin/env node
import yargs from "yargs";
import loadConfigs from "./command/FindConfig";
import {findAndReadFiles} from "./command/Glob";
import {TemplateConfig} from "./model/Template";
import {run} from "./command/DotCompiling";


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

    findAndReadFiles(config.jst,config)
        .then(files => files.found[0])
        .then(async file => {
            console.log(await new TemplateConfig.TemplateItem(
                file
            ).run(config.data))

        })
}
