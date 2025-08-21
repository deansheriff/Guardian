# Project Optimization Plan

Here is a summary of suggested optimizations for your project.

## Dependency Management

### High Priority

*   **`@react-google-maps/api`**: This library is archived and no longer maintained. It is highly recommended to migrate to a more modern, actively maintained library to ensure you receive security updates and bug fixes.
    *   **Recommendation**: Replace with [`vis.gl/react-google-maps`](https://vis.gl/frameworks/react-google-maps) or [`react-map-gl`](https://visgl.github.io/react-map-gl/).

### Medium Priority

*   **`patch-package`**: Using `patch-package` indicates that you are manually patching a dependency. This can be brittle and make upgrades difficult.
    *   **Recommendation**: Contribute your patch to the upstream package or find an alternative library that better suits your needs without requiring patches.
*   **`cross-fetch` & `undici`**: Modern versions of Next.js (12.2+) include a polyfilled `fetch` implementation for both client and server environments. These packages are likely redundant.
    *   **Recommendation**: Remove `cross-fetch` and `undici` unless you have a specific use case that requires them. You can do this by running:
        ```bash
        npm uninstall cross-fetch undici
        ```
*   **`buffer`**: This is a polyfill for Node.js's `Buffer` API. It may not be necessary in modern browsers.
    *   **Recommendation**: Investigate if you can remove this dependency. Test your application thoroughly after removing it to ensure no functionality is broken.
        ```bash
        npm uninstall buffer
        ```
*   **`@types/uuid`**: The `uuid` package now includes its own TypeScript definitions.
    *   **Recommendation**: Remove the redundant `@types/uuid` package.
        ```bash
        npm uninstall @types/uuid
        ```

## Next.js Configuration (`next.config.ts`)

The following changes have already been applied:

*   **`typescript.ignoreBuildErrors`**: Was set to `true`, now `false`. This will prevent builds from succeeding if there are TypeScript errors, helping to catch bugs early.
*   **`eslint.ignoreDuringBuilds`**: Was set to `true`, now `false`. This ensures your code is linted during the build process, maintaining code quality.
*   **`env` block**: The non-standard `env` block was removed. Environment variables should be prefixed with `NEXT_PUBLIC_` in your `.env` files to be exposed to the browser.
