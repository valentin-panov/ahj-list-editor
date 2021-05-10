import { fork } from 'child_process';

const puppeteer = require('puppeteer');

jest.setTimeout(30000); // default puppeteer timeout

describe('name/price form', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({
      // this should be commented for CI?
      // headless: false, // show gui
      // slowMo: 250,
      // devtools: true, // show devTools
    });

    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('should add .valid class for valid input', async () => {
    await page.goto(baseUrl);
    const showFormElement = await page.$('.container__header-plus');
    await showFormElement.click();
    const form = await page.$('.form');
    const input = await form.$('input[name="name"]');
    await input.type('1');
    const submit = await form.$('#save');
    await submit.click();
    await page.waitForSelector('input[name="name"].valid');
  });

  test('should add .invalid class for invalid input', async () => {
    await page.goto(baseUrl);
    const showFormElement = await page.$('.container__header-plus');
    await showFormElement.click();
    const form = await page.$('.form');
    const submit = await form.$('#save');
    await submit.click();
    await page.waitForSelector('input[name="name"].invalid');
  });

  test('should add .invalid class for invalid input even though some input is valid', async () => {
    await page.goto(baseUrl);
    const showFormElement = await page.$('.container__header-plus');
    await showFormElement.click();
    const form = await page.$('.form');
    const input = await form.$('input[name="name"]');
    await input.type('1');
    const submit = await form.$('#save');
    await submit.click();
    await page.waitForSelector('input[name="price"].invalid');
  });
});
