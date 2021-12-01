myICC is a progressively enabled hybrid application

# Table of Contents
- [Configuration](#configuration)
- [Setup for macOS](#setup-for-macos)
- [Testing](#testing)


## Configuration

1. Install all dependencies

    ` yarn install `

2. Run local web server:

    ` yarn dev `

3. Create a build so that build assets are not virtual.  The contents of /www/ folder will be compiled

    ` yarn build `

4. Lint project - just in case before release :)

    ` yarn lint `


## Setup for macOS

1.  NodeJS

    ```
    $ brew install node
    ```

2.  Install NPM:

    ```
    $ brew install npm
    ```

3.  Install Yarn

    ```
    $ brew install yarn
    ```

4.  Clone the Repo and change to that directory:

    ```
    git clone https://github.com/adityajain-Infobeans/vue-unit-test-POC
    ```

5.  Install all dependencies:

    ```
    yarn install
    ```

## Testing

#### Tools

-   Mocha test runner
-   Vue test utils

#### Running tests

```
$ yarn test
or
$ yarn test --watch
```

#### Coverage Report Generation

- Access the http://localhost/coverage dir in browser after running ``` yarn test ```


#### Track a minimum code coverage and a history through git:
```
./coverage.txt
```
