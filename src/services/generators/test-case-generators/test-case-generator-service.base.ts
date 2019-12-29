import CodeGenerator from '../code-generator.base';

export default abstract class TestCaseGeneratorService<TContext, TResolved> extends CodeGenerator<TContext, TResolved> {

    protected _baseHandlers: { [key: string]: (_: TContext) => Promise<TResolved> } = Object.freeze({
        signature: this.resolveSignature.bind(this),
        localData: this.resolveLocalData.bind(this),
        mockSetups: this.resolveMockSetups.bind(this),
        invocation: this.resolveInvocation.bind(this),
        assertions: this.resolveAssertions.bind(this)
    });

    public async generate(context: TContext): Promise<TContext> {
        Object.defineProperty(context, 'parsed', {
            value: await this.resolve(context, this.parseSource.bind(this), this._hookHandlers.parser),
            enumerable: true
        });

        for (const key in Object.keys(this._baseHandlers)) {
            Object.defineProperty(context, key, {
                value: await this.resolve(context, this._baseHandlers[key], this._hookHandlers[key]),
                enumerable: true
            });
        }

        return context;
    }

    protected abstract parseSource(context: TContext): Promise<TResolved>;
    protected abstract resolveSignature(context: TContext): Promise<TResolved>;
    protected abstract resolveLocalData(context: TContext): Promise<TResolved>;
    protected abstract resolveMockSetups(context: TContext): Promise<TResolved>;
    protected abstract resolveInvocation(context: TContext): Promise<TResolved>;
    protected abstract resolveAssertions(context: TContext): Promise<TResolved>;
}
