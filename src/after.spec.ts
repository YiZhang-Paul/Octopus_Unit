import { remote } from 'electron';

declare const window: any;
const path = resolve('path');
const fs = resolve('fs-extra');
// output coverage report after test run
after(() => {
    const isBrowser = process.type && process.type === 'renderer';
    outputCoverage(((isBrowser ? window : global) as any).__coverage__);
});

function resolve(name: string): any {
    return remote ? remote.require(name) : require(name);
}

function outputCoverage(input: Object): void {
    const file = `coverage.${process.type}.json`;
    const fullPath = path.resolve(process.cwd(), `.nyc_output/${file}`);
    fs.outputJsonSync(fullPath, input);
}
