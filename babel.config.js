module.exports = {
  "presets": [ ["@babel/preset-env", { "ignore": false }], ["@babel/preset-react", { "ignore": false }]],
  "plugins": [
    "dynamic-import-node",
    "@babel/plugin-proposal-class-properties",
    ["@babel/plugin-transform-modules-commonjs", {"loose": true}]

  ],
}
