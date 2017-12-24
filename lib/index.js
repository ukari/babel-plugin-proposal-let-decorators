module.exports = function (babel) {
  var t = babel.types;
  return {
    inherits: require("@babel/plugin-syntax-let-decorators").default,
    visitor: {
      VariableDeclaration: function VariableDeclaration(path) {
        if (path.node.decorators) {
          if (path.node.kind == "let") {
            path.node.declarations.map(function (x) {
              return x;
            }).reverse().map(function (node) {
              path.node.decorators.map(function (decorator) {
                var identifier = t.identifier(node.id).name;
                path.insertAfter(t.expressionStatement(t.assignmentExpression("=", identifier, t.callExpression(decorator.expression, [identifier]))));
              });
            });
          }
        }
      }
    }
  };
};