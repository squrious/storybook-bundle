# Storybook For Symfony

This bundle provides a basic integration for Storybook into a Symfony application using Twig Components.

> WARNING: this is NOT ready to use

# Installation

Clone this repo and install the bundle in your project. 

Install Storybook in your project:

```bash
$ yarn add @storybook/cli 
$ yarn run sb init -t server
```

Remove the auto generated `src/stories` directory, and replace the content of `.storybook/main.js` with: 

```javascript
/** @type { import('@storybook/server-webpack5').StorybookConfig } */
const config = {
  // Here you change your stories location:
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(json|yaml|yml)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: {
    name: "@storybook/server-webpack5",
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
```

In `.storybook/preview.js`, add the server parameter: 
```javascript
/** @type { import('@storybook/server').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Here you configure your Symfony server URL:  
    server: {
      url: 'https://localhost:8000'
    }
  },
};

export default preview;
```

Run Storybook with:
```bash
$ yarn run storybook
```

# Writing stories

TODO

# License

MIT License (MIT): see [LICENSE](./LICENSE).

# References

- [Storybook](https://storybook.js.org/)
- [TwigComponent](https://symfony.com/bundles/ux-twig-component/current/index.html)
