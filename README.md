# CreateFuture Focus Area Three (again!)

## Introducing API Testing with Playwright & Cucumber

This project is set up for end-to-end testing using [Playwright](https://playwright.dev/) with TypeScript support.
The BDD tool of choice is [Playwright-BDD](https://vitalets.github.io/playwright-bdd/#/.

For this project, I have chosen to demonstrate API testing using the [Restful Booker Platform](https://restful-booker.herokuapp.com/) as an example. This allows us to focus on testing API endpoints without the need for a frontend interface.

The Restful Booker API is, by name, RESTful and uses standard HTTP methods such as GET, POST, PUT, PATCH and DELETE.
The [API documentation can be accessed here](https://restful-booker.herokuapp.com/apidoc/index.html).

I will utilise these endpoints to authorise, create, update and delete bookings as part of the test scenarios.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Install dependencies](#2-install-dependencies)
  - [3. Quick Start](#3-quick-start)
  - [4. Environment Variables](#4-environment-variables)
- [Run tests](#run-tests)
  - [All Tests](#all-tests)
  - [Specific Feature File](#specific-feature-file)
  - [Specific Scenario](#specific-scenario)
  - [Specific Tag](#specific-tag)
  - [Debug Environment Loading](#debug-environment-loading)
- [Reporters](#reporters)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)
- [Extending the Tests](#extending-the-tests)
- [Conclusion](#conclusion)

## Prerequisites

- [Node.js](https://nodejs.org/en/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Visual Studio Code](https://code.visualstudio.com/) (recommended for editing and running the tests)

## Getting Started

### 1. Clone the repository

Clone this repository to your local machine using the following command:

```bash
git clone https://github.com/Liam-XD/focus-area-three-redux

cd focus-area-three-redux
```

### 2. Install dependencies

Run the following commands when within your project root directory:

```bash
npm install
npx playwright install
```

_Note: Playwright requires additional browser binaries to be installed for UI testing. The command `npx playwright install` takes care of this. However, as we are focusing on API testing, this step is optional._

### 3. Quick Start

```bash
git clone https://github.com/Liam-XD/focus-area-three-redux.git && cd focus-area-three-redux && npm install && npx playwright install && code .
```

_Note: for the last part of the command (`code .`) to work, you need to have Visual Studio Code installed and the `code` command available in your system PATH._

_Open VS Code → Press Cmd+Shift+P → run Shell Command: Install 'code' command in PATH._
_Close and reopen your terminal._
_Verify: code --version_

### 4. Environment Variables

Create a .env file in the root directory of the project to store your environment variables. Here is an example of what the .env file should look like.
For the sake of simplicity, I have included the Restful Booker API credentials in the example below. In a real-world scenario, I'd keep these credentials secure and not hardcoded in the repository:

```env
RB_BASE_URL=https://restful-booker.herokuapp.com
RB_USERNAME=admin
RB_PASSWORD=password123
```

There is a .env.example file in the root directory that you can use as a template for your .env file.

## Run tests

I have added some scripts within the package.json file to make it easier to run the tests. You can run the tests using the following commands:

### All Tests

Run the following command to execute all BDD tests:

```bash
npm run test:bdd
```

This command will first read the Gherkin .feature files and generate standard Playwright test files (.js) from them, placing them in the .features-gen folder.
If there's an issue with one of the steps, it will exit with an error indicating the problem.
If the generation is successful, it will then execute the generated Playwright tests.

### Specific Feature File

The feature files are using tags to allow for more specific test execution. For example, the auth.feature file is tagged with @auth and the booking.feature file is tagged with @booking.

```bash
npm run test:bdd:auth
npm run test:bdd:booking
npm run test:bdd:feature -- .features-gen/features/booking.feature.spec.js
```

Pass the generated feature spec path after `--` so npm forwards it to Playwright.

### Specific Scenario

```bash
npm run test:bdd:scenario -- "Delete an existing booking"
```

Pass the scenario title after `--` so npm forwards it to Playwright's `--grep` option.

### Specific Tag

```bash
npm run test:bdd:smoke
npm run test:bdd:negative
```

### Debug Environment Loading

Environment variable loading from `.env` is quiet by default to reduce terminal noise.

Use the following command when troubleshooting missing or misnamed env variables:

```bash
DEBUG_ENV=1 npx playwright test
```

This prints a concise summary of how many variables were loaded, or an error if `.env` could not be read.

## Reporters

I've added two reporters to the Playwright configuration: the default HTML reporter and the Allure reporter for more detailed test reports.

To view the HTML report after running the tests, use the following command:

```bash
npm run html:report
```

To view the Allure report after running the tests, use the following command:

```bash
npm run allure:report
```

## Project Structure

```text
focus3/
├── README.md
├── package.json
├── playwright.config.ts
├── features/
│   ├── auth.feature
│   └── booking.feature
├── src/
│   ├── api/
│   │   ├── client/
│   │   │   ├── authApi.ts
│   │   │   └── bookingApi.ts
│   │   └── types/
│   │       ├── authTypes.ts
│   │       └── bookingTypes.ts
│   ├── config/
│   │   ├── constants.ts
│   │   └── env.ts
│   ├── test-data/
│   │   └── factories/
│   │       └── bookingFactory.ts
│   └── utils.ts
└── tests/
    └── steps/
        ├── auth.steps.ts
        ├── booking.steps.ts
        └── support/
            ├── authState.ts
            └── httpState.ts
```

## Future Enhancements

The booking Endpoint has a dependency on the auth endpoint for token generation. Currently, the token is generated within the booking steps when needed. In the future, I would like to mock the Auth endpoint to return a static token for testing purposes. This would allow the booking tests to be more isolated and not rely on the Auth endpoint for token generation.

The cleanup process is handled in the after step and is maybe a bit basic. Also, if there's an issue and we delete the booking then we won't be able to review the booking for debugging.

## Extending the Tests

To extend the test coverage, you can create additional feature files in the `features/` directory and corresponding step definition files in the `test/steps/` directory.
Make sure to follow the existing structure and conventions used in the project for consistency.

## Conclusion

This project demonstrates how to conduct API testing using Playwright, Typescript and playwright-bdd.

- I've implemented tests that perform GET, POST, PUT, PATCH and DELETE operations against the Restful Booker API, covering both positive and negative scenarios.
- There is at least one test that retrieves filtered data and asserts on the response to validate that the filtering is working as expected.
- The tests are integrated with BDD-style Gherkin feature files, making them easy to read and understand for both technical and non-technical stakeholders.
