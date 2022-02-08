export module Config{
    export interface Main {
        "outDir": string;
        // pasta com os arquivos jst
        "jst": string;
        // nome final do arquivo processado
        "name": string;
        // dados a serem enviados para o template
        data: object;
        process: Process[]
    }

    export interface Process {
        // caminho do js raiz
        file: string;
        // qualquer argumento específico para função
        args: object;
    }
}


