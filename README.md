# @pretto/picto

[![npm version](https://img.shields.io/npm/v/@pretto/picto.svg?style=flat)](https://www.npmjs.com/package/@pretto/picto)

Provides a pictogram set used by the design system and other tools.

## FAQ

### How to contribute?

1. Add a new svg file under the _./svg/_ folder

Name it properly!

- Name defines the importing name. (eg. `import { Envelope } from '@pretto/picto'`).
- Names must be formatted in [pascalcase](https://techterms.com/definition/pascalcase).
- Avoid duplicates.

2. Open a pull request

3. Request a review

4. Squash and merge

### How to use the library?

```sh
yarn add @pretto/picto
```

- **Using named import**

```jsx
import { Envelope } from '@pretto/picto'

const myComponent = () => <Envelope />
```

- **Using namespaces**

```jsx
import * as P from '@pretto/picto'

const myComponent = () => <P.Envelope />
```

### How to publish a new version?

When a branch is merged into master, it will automatically deploy a new version to npm.
