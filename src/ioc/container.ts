import { Container } from 'inversify';

import ILogger from '../services/interfaces/logger.interface';
import Logger from '../services/io/logger';

import Types from './types';

const container = new Container();
container.bind<ILogger>(Types.ILogger).to(Logger);

export default container;
