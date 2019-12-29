import ICodeGenerator from '../interfaces/code-generator.interface';
import IHookHandler from '../interfaces/hook-handler.interface';
import ICodeParser from '../interfaces/code-parser.interface';

type BaseHandler<T, K> = (_: T) => Promise<K>;
type BaseHandlerSet<T, K> = { [key: string]: BaseHandler<T, K> };

export default abstract class CodeGenerator<TContext, TResolved> implements ICodeGenerator<TContext> {

    private _baseHandlers: BaseHandlerSet<TContext, TResolved> = {};
    private _parser: ICodeParser<TContext, TResolved>;

    constructor(parser: ICodeParser<TContext, TResolved>) {
        this._parser = parser;
    }

    public async generate(context: TContext, hookHandlers: any): Promise<TContext> {
        const parsed = await this._parser.parse(context);
        Object.defineProperty(context, 'parsed', { value: parsed, enumerable: true });

        for (const key in Object.keys(this._baseHandlers)) {
            const resolved = await this.resolve(context, this._baseHandlers[key], hookHandlers[key]);
            Object.defineProperty(context, key, { value: resolved, enumerable: true });
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
