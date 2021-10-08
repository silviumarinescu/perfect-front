const helper = {
  importMap: [
    {
      name: "react",
      url: "https://unpkg.com/react@latest/umd/react.development.js",
      windowProp: "React",
    },
    {
      name: "lodash",
      url: "https://unpkg.com/lodash@latest/lodash.js",
      windowProp: "_",
    },
    {
      name: "react-dom",
      url: "https://unpkg.com/react-dom@latest/umd/react-dom.development.js",
      windowProp: "ReactDOM",
    },
    {
      name: "react-router-dom",
      url: "https://unpkg.com/react-router-dom@latest/umd/react-router-dom.min.js",
      windowProp: "ReactRouterDOM",
    },
    {
      name: "styled-components",
      url: "https://unpkg.com/styled-components@4.0.1/dist/styled-components.min.js",
      windowProp: "styled",
    },
    {
      name: "mocha",
      url: "https://unpkg.com/mocha@latest/mocha.js",
      windowProp: "mocha",
    },
    {
      name: "chai",
      url: "https://unpkg.com/chai@latest/chai.js",
      windowProp: "chai",
    },
  ],
  textExtensions: [{ name: "scss" }, { name: "css" }, { name: "svg" }],
  tree: [],
  parent: "",
  getImportPath: (path, parent) => {
    const parentPath = parent
      .split("/")
      .filter((p) => p.indexOf(".") == -1)
      .join("/");

    if (path.startsWith("../")) {
      let lvl = 0;
      let tmpPath = path;
      while (tmpPath.startsWith("../")) {
        tmpPath = tmpPath.substring(3);
        lvl++;
      }
      const pLvl = parentPath.split("/").length;
      return (
        parentPath
          .split("/")
          .filter((d, i) => i < pLvl - lvl)
          .join("/") +
        "/" +
        tmpPath
      );
    } else {
      return parentPath + path.replace("./", "/");
    }
  },
  getPath: (path, parent = null) => {
    if (path.startsWith("/")) {
      return path;
    } else if (path.startsWith(".")) {
      if (parent) {
        return helper.getImportPath(path, parent);
      } else {
        return path;
      }
    } else {
      return helper.importMap.find((im) => im.name == path || im.url == path)
        .url;
    }
  },
  getFile: (file) => {
    if (file.startsWith("http")) {
      return () => {};
    }

    return new Promise((a) => {
      a(
        require("fs")
          .readFileSync("./src/" + file)
          .toString()
      );
    });
  },
};
const React = require("react");

class ReactParser {
  constructor() {
    this.Babel = require("@babel/standalone");
    this.Babel.registerPlugin("importIntercepter", (api) => ({
      visitor: {
        ImportDeclaration(path) {
          if (!helper.tree.find((t) => t.path == path.node.source.value)) {
            path.node.source.value = helper.getPath(
              path.node.source.value,
              helper.parent
            );
            if (!helper.tree.find((t) => t.path == path.node.source.value))
              helper.tree.push({
                resolved: false,
                path: path.node.source.value,
              });
          }
        },
      },
    }));
  }
  async getCode(file, initial = false) {
    const node = helper.tree.find((node) => node.path == helper.getPath(file));
    let rawCode = "";
    if (node && node.resolved && node.code) rawCode = node.code;
    else {
      if (file.startsWith("/"))
        rawCode = await helper.getFile(file.substring(1));
      else rawCode = await helper.getFile(file);
    }

    let code = rawCode;
    const ex = helper.textExtensions.find((e) => file.endsWith(e.name));
    if (ex) {
      if (ex.compile) return await ex.compile(code, file);
      else return code;
    }
    if (!file.startsWith("http")) {
      let oldParent = helper.parent;
      helper.parent = file;
      code = this.Babel.transform(rawCode, {
        filename: file.split("/")[file.split("/").length - 1],
        presets: ["es2015", "typescript", "react"],
        plugins: [["importIntercepter"]],
      }).code;
      helper.parent = oldParent;
      helper.tree.push({
        resolved: true,
        path: helper.getPath(file, helper.parent),
        code,
      });
      let unresolved = helper.tree.findIndex((t) => !t.resolved);
      while (unresolved != -1) {
        helper.tree[unresolved].resolved = true;
        helper.tree[unresolved].code = await this.getCode(
          helper.tree[unresolved].path
        );
        unresolved = helper.tree.findIndex((t) => !t.resolved);
      }
    }

    const require = (file) => {
      if (file == "https://unpkg.com/react@latest/umd/react.development.js")
        return React;
      const code = helper.tree.find((t) => t.path == helper.getPath(file)).code;
      const exports = {};
      if (!file.startsWith("/") && !file.startsWith(".")) {
        const node = helper.importMap.find(
          (im) => im.name == file || im.url == file
        );
        exports.default = eval(code);
      } else {
        helper.parent = file;
        const ex = helper.textExtensions.find((e) => file.endsWith(e.name));
        if (ex) {
          return code;
        }
        eval(code);
      }
      return exports.default;
    };
    if (initial) {
      const rt = eval(code);
      helper.tree = [];
      helper.parent = "";
    return rt;
    } else return code;
  }
}

module.exports = ReactParser;
