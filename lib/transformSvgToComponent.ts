import { transform } from '@babel/core'

export const transformSvgToComponent = (code: string): string => {
  const transformation = transform(code, {
    babelrc: false,
    configFile: false,
    plugins: [
      require.resolve('babel-plugin-html-attributes-to-jsx'),
      require.resolve('@babel/plugin-syntax-jsx'),

      ({ types }) => {
        const restElement = types.restElement ? types.restElement : types.restProperty

        const programVisitor = {
          Program(path: any) {
            path.node.body.unshift(
              types.importDeclaration(
                [types.importDefaultSpecifier(types.identifier('React'))],
                types.stringLiteral('react')
              )
            )
          },
        }

        const svgExpressionVisitor = {
          ExpressionStatement(path: any) {
            if (!path.get('expression').isJSXElement()) {
              return
            }

            if (path.get('expression.openingElement.name').node.name !== 'svg') {
              return
            }

            const children = types.jsxFragment(
              types.jSXOpeningFragment(),
              types.jSXClosingFragment(),
              path.get('expression.children').map(({ node }: any) => node)
            )

            path.node.expression.children = [
              types.objectExpression([
                types.objectProperty(types.identifier('children'), types.identifier('children'), false, true),
              ]),
            ]

            path.replaceWith(
              types.exportDefaultDeclaration(
                types.arrowFunctionExpression(
                  [
                    types.objectPattern([
                      types.objectProperty(
                        types.identifier('as'),
                        types.assignmentPattern(types.identifier('Component'), types.stringLiteral('svg')),
                        false,
                        true
                      ),
                      types.objectProperty(
                        types.identifier('children'),
                        types.assignmentPattern(types.identifier('children'), children),
                        false,
                        true
                      ),
                      restElement(types.identifier('props')),
                    ]),
                  ],
                  path.get('expression').node
                )
              )
            )
          },
        }

        const svgVisitor = {
          JSXClosingElement(path: any) {
            if (path.node.name.name.toLowerCase() !== 'svg') {
              return
            }

            path.node.name.name = 'Component'
          },

          JSXOpeningElement(path: any) {
            if (path.node.name.name.toLowerCase() !== 'svg') {
              return
            }

            path.node.attributes.push(types.jSXSpreadAttribute(types.identifier('props')))
            path.node.name.name = 'Component'
          },
        }

        return {
          visitor: Object.assign({}, programVisitor, svgExpressionVisitor, svgVisitor),
        }
      },
    ],
  })

  if (!transformation?.code) {
    throw new Error('SVG could not be transformed into a component')
  }

  return transformation.code
}
