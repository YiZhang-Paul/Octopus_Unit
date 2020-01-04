import { injectable } from 'inversify';

import ILogger from '../../../interface/io/logger.interface';

@injectable()
export default class Logger implements ILogger {

    public log(a = '', ...b: string[]): void {
        const environment = process.env.NODE_ENV;

        if (environment !== 'production' && environment !== 'testing') {
            console.log(a, ...b);
        }
    }
}
