
// use .check(demandOneOfOption ('f', 'c')) to work with yatgs
export const demandOneOfOption = (...options: string[]) => (argv: any) => {
    const count = options.filter(option => argv[option]).length;
    const lastOption = options.pop();

    if (count === 0) {
        throw new Error(`Exactly one of the arguments ${options.join(', ')} or ${lastOption} is required`);
    }
    else if (count > 1) {
        throw new Error(`Arguments ${options.join(', ')} and ${lastOption} are mutually exclusive`);
    }

    return true;
};
