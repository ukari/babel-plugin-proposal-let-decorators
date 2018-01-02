const { BLOCK_SCOPED_SYMBOL } = require("@babel/types");

function PatternToExpression(t, pattern) {
  if (t.isArrayPattern(pattern)) {
    return t.arrayExpression(
      pattern.elements.map(element => PatternToExpression(t, element)),
    );
  } else if (t.isObjectPattern(pattern)) {
    return t.objectExpression(
      pattern.properties.map(prop => PatternToExpression(t, prop)),
    );
  } else {
    if (t.isRestElement(pattern)) {
      return t.spreadElement(pattern.argument);
    } else {
      return pattern;
    }
  }
}

function IdToAssignLeft(t, id) {
  if (t.isIdentifier(id)) {
    return id;
  } else if (t.isObjectPattern(id)) {
    return t.objectPattern(id.properties);
  } else if (t.isArrayPattern(id)) {
    return t.arrayPattern(id.elements);
  } else {
    return id;
  }
}

function aliasProcess(t, path, node, now) {
  if (now.left) {
    if (now.right) {
      aliasProcess(t, path, node, now.right);
    }
    path.insertAfter(
      t.expressionStatement(
        t.assignmentExpression("=", IdToAssignLeft(t, now.left), node.id),
      ),
    );
  }
}

module.exports = function(babel) {
  const t = babel.types;
  return {
    name: "babel-plugin-proposal-let-decorators",
    inherits: require("@babel/plugin-syntax-let-decorators").default,
    visitor: {
      VariableDeclaration: function(path) {
        if (path.node.decorators) {
          if (
            path.node.kind == "let" ||
            path.node[BLOCK_SCOPED_SYMBOL] == true
          ) {
            path.node.declarations
              .map(x => x)
              .reverse()
              .map(node => {
                path.node.decorators.length &&
                  aliasProcess(t, path, node, node.init);
                path.node.decorators.map(decorator => {
                  const id = node.id;
                  path.insertAfter(
                    t.expressionStatement(
                      t.assignmentExpression(
                        "=",
                        IdToAssignLeft(t, id),
                        t.callExpression(decorator.expression, [
                          PatternToExpression(t, id),
                        ]),
                      ),
                    ),
                  );
                });
              });
          }
        }
      },
    },
  };
};
