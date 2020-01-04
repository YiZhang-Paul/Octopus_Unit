import 'mocha';
import { spy, SinonSpy, assert as sinonExpect } from 'sinon';

import Types from '../../../ioc/types';
import Container from '../../../ioc/container';
import ILogger from '../../../interface/io/logger.interface';

context('logger unit test', () => {
    let logger: ILogger;
    let logSpy: SinonSpy<[any?, ...any[]], void>;

    beforeEach('stub setup', () => {
        logSpy = spy(console, 'log');
    });

    beforeEach('test setup', () => {
        logger = Container.get<ILogger>(Types.ILogger);
    });

    afterEach('test teardown', () => {
        logSpy.restore();
    });

    describe('log', () => {
        it('should log on development mode', () => {
            process.env.NODE_ENV = 'development';

            logger.log('');

            sinonExpect.calledOnce(logSpy);
        });

        it('should not log on production mode', () => {
            process.env.NODE_ENV = 'production';

            logger.log('');

            sinonExpect.notCalled(logSpy);
        });
        it('should not log on test mode', () => {
            process.env.NODE_ENV = 'testing';

            logger.log('');

            sinonExpect.notCalled(logSpy);
        });
    });
});
