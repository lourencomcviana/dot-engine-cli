#!/usr/bin/env node
import { run} from "./command/DotProcessing";

console.log('The biller app')


const dt = {
    name:'test'
};
const x =run('./example/**.jst', dt)
    .then(y =>{
        console.log(y);
    })

