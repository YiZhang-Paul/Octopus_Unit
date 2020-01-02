import { injectable } from 'inversify';

import ILogger from '../interfaces/logger.interface';

@injectable()
export default class Logger implements ILogger {

    public log(a = '', ...b: string[]): void {
        if (process.env.NODE_ENV !== 'testing') {
            console.log(a, ...b);
        }
    }
}
