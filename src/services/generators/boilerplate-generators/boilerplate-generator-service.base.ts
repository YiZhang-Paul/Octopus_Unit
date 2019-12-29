import CodeGenerator from '../code-generator.base';

export default abstract class BoilerplateGeneratorService<TContext, TResolved> extends CodeGenerator<TContext, TResolved> {

    protected _baseHandlers: { [key: string]: (_: TContext) => Promise<TResolved> } = Object.freeze({
        imports: this.resolveImports.bind(this),
        declarations: this.resolveDeclaration.bind(this),
        mocks: this.resolveMocks.bind(this),
        mockSetups: this.resolveMockSetups.bind(this),
        subject: this.resolveUnitUnderTest.bind(this)
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
    protected abstract resolveImports(context: TContext): Promise<TResolved>;
    protected abstract resolveDeclaration(context: TContext): Promise<TResolved>;
    protected abstract resolveMocks(context: TContext): Promise<TResolved>;
    protected abstract resolveMockSetups(context: TContext): Promise<TResolved>;
    protected abstract resolveUnitUnderTest(context: TContext): Promise<TResolved>;
}
