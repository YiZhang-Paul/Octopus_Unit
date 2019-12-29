import ICodeGenerator from '../interfaces/code-generator.interface';
import IHookHandler from '../interfaces/hook-handler.interface';

type BaseHandler<T, K> = (_: T) => Promise<K>;

export default abstract class CodeGenerator<TContext, TResolved> implements ICodeGenerator<TContext> {

    protected baseHandlers: { [key: string]: BaseHandler<TContext, TResolved> } = {};
    private _hookHandlers: any;

    constructor(hookHandlers: any) {
        this._hookHandlers = hookHandlers;
    }

    public async generate(context: TContext): Promise<TContext> {
        Object.defineProperty(context, 'parsed', {
            value: await this.resolve(context, this.parseSource.bind(this), this._hookHandlers.parser),
            enumerable: true
        });

        for (const key in Object.keys(this.baseHandlers)) {
            Object.defineProperty(context, key, {
                value: await this.resolve(context, this.baseHandlers[key], this._hookHandlers[key]),
                enumerable: true
            });
        }

        return context;
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
