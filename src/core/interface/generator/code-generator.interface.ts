import IHookHandlerSet from './hook-handler-set.interface';

export default interface ICodeGenerator<TContext, TResolved> {
    generate(context: TContext, hookHandlers: IHookHandlerSet<TContext, TResolved>): Promise<TContext>;
}
