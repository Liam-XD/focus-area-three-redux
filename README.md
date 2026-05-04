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
  - [Skipping Tests](#skipping-tests)
  - [Conduct a Dry Run](#conduct-a-dry-run)
- [Reporters](#reporters)
- [Cleanup](#cleanup)
- [Configuration](#configuration)
  - [Core config and setup files](#core-config-and-setup-files)
  - [Cucumber Features](#cucumber-features)
  - [Step Definitions](#step-definitions)
  - [Support Files](#support-files)
- [Future Enhancements](#future-enhancements)
- [Extending the Tests](#extending-the-tests)
- [Conclusion](#conclusion)

## Prerequisites

- [Node.js](https://nodejs.org/en/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Visual Studio Code](https://code.visualstudio.com/) (recommended for editing and running the tests)
- [Cucumber for VSCode extension](https://marketplace.visualstudio.com/items?itemName=CucumberOpen.cucumber-official)

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

TBD

## Run tests

### All Tests

Run the following command to execute all Cucumber feature tests:

```bash
TBD
```

Test results will be displayed in the terminal. A report (e.g., HTML or JSON) will be generated in the reports/ directory.

### Specific Feature File

TBD

### Specific Scenario

TBD

### Specific Tag

TBD

### Skipping Tests

TBD

### Conduct a Dry Run

TBD

### ESLinting

TBD

## Reporters

TBD

## Configuration

### Core config and setup files

TBD

## Future Enhancements

TBD

## Extending the Tests

TBD

## Conclusion

TBD

Add response typings to client methods for stronger assertions.
Add an auth fixture/context later so token handling is reusable for BDD steps.
