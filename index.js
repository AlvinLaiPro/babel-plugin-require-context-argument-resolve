module.exports = function ({ types: t }) {
    return {
        visitor: {
            CallExpression: (path, { opts }) => {
                if (
                    t.isMemberExpression(path.node.callee, { computed: false }) &&
                    t.isIdentifier(path.get('callee').node.object, { name: 'require' }) &&
                    t.isIdentifier(path.get('callee').node.property, { name: 'context' }) &&
                    t.isStringLiteral(path.get('arguments')[0])
                ) {
                    const args = path.node.arguments;
                    const [{value}] = args;

                    if (opts[value]) {
                        args[0] = t.stringLiteral(opts[value]);
                    }
                }
            },
        },
    };
};
