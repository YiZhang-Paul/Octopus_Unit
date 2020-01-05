import { injectable } from 'inversify';

import ILogger from '../../../interface/io/logger.interface';

@injectable()
export default class Logger implements ILogger {

    public log(a = '', ...b: string[]): void {
        const environment = process.env.APP_ENV;

        if (environment === 'development') {
            console.log(a, ...b);
        }
    }
}
