# @pretto/picto

[![npm version](https://img.shields.io/npm/v/@pretto/picto.svg?style=flat)](https://www.npmjs.com/package/@pretto/picto)

Provides a pictogram set used by the design system and other tools.

## FAQ

### How to contribute?

1. Add a new svg file under the svg folder

Name it properly! The name defines the final export name of the component. Names are formatted into pascal case so *line-web.svg* will be imported like `import { LineWeb } from '@pretto/picto'.` Avoid duplicates.

2. Open a pull request

### How to implement the library?

```sh
yarn add @pretto/picto
```

index.js (preferred syntax)

```jsx
import * as P from '@pretto/picto'

const myComponent = () => <P.LineWeb />
```

index.js (alternative)

```jsx
import { LineWeb } from '@pretto/picto'

const myComponent = () => <LineWeb />
```

index.js (alternative)

```jsx
import LineWeb from '@pretto/picto/cjs/LineWeb'

const myComponent = () => <LineWeb />
```

### How to publish a new version?

When a branch is merged into master, it will automatically deploy a new version to npm.
