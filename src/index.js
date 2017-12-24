module.exports = function(babel) {
  var t = babel.types;
  return {
    inherits: require("@babel/plugin-syntax-let-decorators").default,
    visitor: {
      VariableDeclaration: function(path){
        if (path.node.decorators) {
          if (path.node.kind == "let") {
            path.node.declarations
              .map(x => x)
              .reverse()
              .map(node => {
                path.node.decorators.map(decorator => {                
                  let identifier = t.identifier(node.id).name;
                  path.insertAfter(
                    t.expressionStatement(t.assignmentExpression("=", identifier, t.callExpression(decorator.expression, [identifier]))))
                })
              });
          } 
        }
      }
    }
  };
};

