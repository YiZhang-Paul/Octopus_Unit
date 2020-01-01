class Logger {

    public log(a = '', ...b: string[]): void {
        if (process.env.NODE_ENV !== 'testing') {
            console.log(a, ...b);
        }
    }
}

export default new Logger();
