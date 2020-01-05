process.env.NODE_ENV = 'testing';

require('@babel/register')({
    cache: false,
    extensions: ['.ts'],
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                },
            }
        ],
        '@babel/preset-typescript',
    ],
    plugins: [
        '@babel/plugin-proposal-optional-chaining',
        [
            '@babel/plugin-proposal-decorators',
            {
                legacy: true
            }
        ],
        [
            '@babel/plugin-proposal-class-properties',
            {
                loose: true
            }
        ],
        'babel-plugin-parameter-decorator',
        [
            'istanbul',
            {
                exclude: [
                    '**/main.ts',
                    '**/app.ts',
                    '**/store/index.ts',
                    '**/*.interface.ts',
                    '**/*.spec.ts'
                ]
            }
        ]
    ]
});
