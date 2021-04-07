# babel-plugin-require-context-argument-resolve
Babel plugin to resolve modules finding of require.context in test environment

## Usage

babelrc:

```js
"plugins": [
    ["require-context-argument-resolve", {
        "@modules/directory": "${absolutePath}",
        ...
    }]
]

```

or omit the option:

```js
"plugins": [
    ["require-context-argument-resolve"]
]
```

## How it works
This plugin will match the first string parameters that you pass to `require.context` with the key of this plugin options that provided by you and then replace it with the value of that specific key. Or you can omit the option and let this plugin try to resolve.

## Note
You still need `babel-plugin-require-context-hook` to support `require.context` in the test environment. And please put this plugin before `babel-plugin-require-context-hook`.
