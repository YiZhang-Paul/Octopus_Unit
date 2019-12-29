import ICodeGenerator from '../interfaces/code-generator.interface';
import IHookHandler from '../interfaces/hook-handler.interface';

type BaseHandler<T, K> = (_: T) => Promise<K>;
type BaseHandlerSet<T, K> = { [key: string]: BaseHandler<T, K> };

export default abstract class CodeGenerator<TContext, TResolved> implements ICodeGenerator<TContext> {

    private _baseHandlers: BaseHandlerSet<TContext, TResolved> = {};

    public async generate(context: TContext, hookHandlers: any): Promise<TContext> {
        Object.defineProperty(context, 'parsed', {
            value: await this.resolve(context, this.parseSource.bind(this), hookHandlers.parser),
            enumerable: true
        });

        for (const key in Object.keys(this._baseHandlers)) {
            Object.defineProperty(context, key, {
                value: await this.resolve(context, this._baseHandlers[key], hookHandlers[key]),
                enumerable: true
            });
        }

        return context;
    }

    protected addBaseHandlers(handlers: BaseHandlerSet<TContext, TResolved>): void {
        Object.assign(this._baseHandlers, handlers);
    }

    protected async resolve(
        context: TContext,
        baseHandler: BaseHandler<TContext, TResolved>,
        hookHandler: IHookHandler<TContext, TResolved>
    ): Promise<TResolved> {

        if (hookHandler && hookHandler.override) {
            return await hookHandler.handle(context, null);
        }
        const resolved = await baseHandler(context);

        return hookHandler ? await hookHandler.handle(context, resolved) : resolved;
    }

    protected abstract parseSource(context: TContext): Promise<TResolved>;
}
