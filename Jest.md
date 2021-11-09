# Настройка JEST
## Сначала настраиваем Babel
```yarn add --dev babel-jest @babel/core @babel/core @babel/preset-env```
```javascript
// babel.config.js
module.exports = {
  presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
};
```
## Ставим пакеты
```yarn add --dev @babel/preset-typescript```
```npm i jest @types/jest ts-jest```
## Затем добавьте @babel/preset-typescript в список пресетов в ваш babel.config.js.

```javascrript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
  ],
};
```

## Настраиваем tsconfig.json
```json
{
  "compilerOptions": {
    "types": ["node", "jest"],
  }
}
```
If you get an error, “Cannot spy the fetch property because it is not a function; undefined given instead”, that’s because fetch has not been polyfill’d in your Jest’s JSDOM environment. As of this writing, there is an open request (jsdom/jsdom#1724) to add fetch API headers into JSDOM.
So as a workaround, instead of using jest.spyOn, you can…
```javascript
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve(fakeUser),
  } as Response)
);
```