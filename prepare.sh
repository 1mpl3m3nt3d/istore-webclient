#corepack enable
#corepack prepare yarn@3.2.3 --activate
#yarn set version berry
#yarn plugin import typescript
#yarn plugin import interactive-tools
#yarn config set --home enableTelemetry false
#yarn config set enableTelemetry false
#yarn config set nodeLinker pnp
#yarn config set pnpEnableEsmLoader true
#yarn config set pnpEnableInlining true
#yarn config set pnpFallbackMode dependencies-only
#yarn config set pnpMode strict
#yarn config set packageExtensions --json "{ \"@mui/x-date-pickers@*\": { \"dependencies\": { \"react-dom\": \"*\" } }, \"chalk@*\": { \"dependencies\": { \"#ansi-styles\": \"npm:ansi-styles@*\", \"#supports-color\": \"npm:supports-color@*\" } }, \"material-ui-popup-state@*\": { \"dependencies\": { \"react-dom\": \"*\" } }, \"npm-check-updates@*\": { \"dependencies\": { \"ini\": \"*\" } }, \"stylelint-config-recommended-scss@*\": { \"dependencies\": { \"postcss\": \"*\" } }, \"stylelint-config-xo-scss@*\": { \"dependencies\": { \"postcss\": \"*\" } } }"
yarn install
yarn up
#yarn dlx @yarnpkg/sdks vscode
