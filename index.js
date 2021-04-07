const path = require('path');
const ResolvePathByString = (str, filename) => {
    if (str.startsWith('.') || str.startsWith('/')) {
        return str;
    }

    try {
        const options = filename.split(path.sep).reduce((acc, cur, i, arr) => {
            const item = `${arr.slice(0, -(i + 1)).join(path.sep)}${path.sep}package.json`;
            acc.push(item);
            return acc;
        }, []);

        let resolvePath = '';

        for (let pkgPath of options) {
            try {
                const { dependencies = {}, devDependencies = {} } = require(pkgPath);
                const deps = { ...dependencies, ...devDependencies };
                const depKey = Object.keys(deps).find((key) => str.startsWith(key));

                if (depKey) {
                    const depPath = require.resolve(depKey);
                    const directories = path.dirname(depPath).split(path.sep);
                    const endPoints = str.replace(`${depKey}${path.sep}`, '').split(path.sep);
                    const firstEndPoint = endPoints[0];
                    const index = directories.lastIndexOf(firstEndPoint);

                    if (index > -1) {
                        resolvePath = directories.slice(0, index).concat(endPoints).join(path.sep);
                    } else {
                        resolvePath = directories.concat(endPoints).join(path.sep);
                    }

                    break;
                }
            } catch (err) {
                continue;
            }
        }

        return resolvePath || str;
    } catch (error) {
        return str;
    }
};
module.exports = function ({ types: t }) {
    return {
        visitor: {
            CallExpression: (nodePath, { opts = {}, filename }) => {
                if (
                    t.isMemberExpression(nodePath.node.callee, { computed: false }) &&
                    t.isIdentifier(nodePath.get('callee').node.object, { name: 'require' }) &&
                    t.isIdentifier(nodePath.get('callee').node.property, { name: 'context' }) &&
                    t.isStringLiteral(nodePath.get('arguments')[0])
                ) {
                    const args = nodePath.node.arguments;
                    const [{ value }] = args;

                    args[0] = opts[value]
                        ? t.stringLiteral(opts[value])
                        : t.stringLiteral(ResolvePathByString(value, filename));
                }
            },
        },
    };
};
