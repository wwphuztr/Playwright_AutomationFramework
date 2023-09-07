Environments: This folder contains global objects that provide access to environment variables during runtime. Specifically, it will contain the URL, account name, partial URL, prefix, and suffix

common: This folder is used to encapsulate functionalities and elements that are common across multiple pages of our application. This page class typically includes methods and locators that are reused across different pages to avoid duplication and easier to maintain.

fixtures: In Playwright, a "fixture" is a concept used to set up and manage the test environment for your test cases. It provides a way to define common setups and teardowns that are shared across multiple test cases. Fixtures help you encapsulate repetitive or shared code, making your test scripts more organized, readable, and maintainable

pageObjects: This folder will create classes that represent individual pages or components of a web application. Each Page Object contains the locators (identifiers) of the UI elements on that page and methods to interact with those elements.

test2:  The "test" folder is where you create individual test scripts that execute your test cases. These test scripts use the Page Objects to interact with the UI elements and perform the actions required to validate the functionality of your application

playwright.config.ts: The playwright.config.ts file is a configuration file used in Playwright to define settings, options, and various configurations for running your tests.
