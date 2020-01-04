import IHookHandler from './hook-handler.interface';

export default interface IHookHandlerSet<TContext, TResolved> {
    [name: string]: IHookHandler<TContext, TResolved>;
}
