const { Builder, By } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');


// Get the number of drivers from the user (replace 2 with the desired number)
const numDrivers = 1;

// Constants
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const MAX_URL_LENGTH = 6;
const BASE_URL = 'https://files.catbox.moe/';

// Function to initialize WebDrivers
async function initializeWebDrivers(numDrivers) {
    const drivers = [];

    try {
        let options = new firefox.Options();

        for (let i = 0; i < numDrivers; i++) {
            const driver = await new Builder()
                .forBrowser('firefox')
                .setFirefoxOptions(options.addArguments('--headless'))
                .build(); 
            drivers.push(driver);
        }

        console.log(`${numDrivers} WebDrivers initialized successfully.`);

        // Run tryLink for all tabs concurrently
        await Promise.all(drivers.map((driver, index) => tryLink(driver, index + 1)));
    } catch (err) {
        console.error('Error initializing WebDrivers:', err);
    } finally {
        // Close all drivers when done
        await Promise.all(drivers.map(driver => driver.quit()));
    }
}

// Main function to attempt accessing the link
async function tryLink(driver, tabNumber) {
    let url = generateRandomURL();
    try {
        await driver.get(`${BASE_URL}${url}.mp4`);
        const element = await driver.findElement(By.tagName('html'));
        const text = await element.getText();

        if (text === "404! not found!") {
            //console.log(`Tab ${tabNumber}: Link not found for URL: ${url}`);
            await driver.sleep(100);
            await tryLink(driver, tabNumber);
        } else {
            console.log(`Tab ${tabNumber}: Link found! URL: ${BASE_URL}${url}.mp4`);
            await tryLink(driver, tabNumber);
        }
    } catch (error) {
        console.error(`Tab ${tabNumber}: An error occurred:`, error);
    }
}

// Function to generate a random URL
function generateRandomURL() {
    let url = "";
    for (let i = 0; i < MAX_URL_LENGTH; i++) {
        url += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return url;
}

// Execute the initialization
(async function () {
    await initializeWebDrivers(numDrivers);
})();
