# Playwright Tests for HackerRank

## Installation instructions

If accessing this project from GitHub Please fork and clone this directory from https://github.com/epixieme/qa_wolf_take_home/

To install and update the package.json please use 

``` npm i ``` 

The project contains an index.ts file that extracts the title and URL of the top 10 articles and saves them to CSV using the node.js fs module.

This is a Typescript project so to run the index.ts please use the following command which is linked to a tsx in in the package.json:

```
npm run dev

```
# Tests
There are also some Playwright tests.

These have been set up using the page object model with custom fixtures contained in a base file.

In order to run these tests, please use:

```
npm run tests
```

The script also runs a helper function called deletesnapshots that deletes snapshots so that there is a clean baseline for visual tests each time it is run.

- The deletesnapshots function can either be run through a script `npm run tests` in the terminal or manually.
 
Note: Try and run tests in isolation because of the limitations of the HackerRank site. If tests are run at the same time this will generate errors owing to HackeRank limitations.

## Types of Test
Tests are organised by page and then feature.
- Visual
- Authentication
- Validation



