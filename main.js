const { Builder, By } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const fs = require('fs').promises;

// Get the number of drivers from the user (replace 2 with the desired number)
const numDrivers = 1;

// Constants
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const MAX_URL_LENGTH = 6;
const BASE_URL = 'https://files.catbox.moe/';

// File paths
const notFoundURLsFilePath = 'notFoundURLs.txt';
const workingURLsFilePath = 'workingURLs.txt';

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

    // Check if the URL has already been tested and found not found
    if (await isUrlNotFound(url)) {
        console.log(`Tab ${tabNumber}: URL already tested and not found: ${url}`);
        return;
    }

    try {
        await driver.get(`${BASE_URL}${url}.mp4`);
        //const element_img = await driver.findElement(By.css ("body > img:nth-child(1)"))
        //const src_img = await element_img.getAttribute('src')
        // if (src == "https://files.catbox.moe/official/images/404.png")
        const element = await driver.findElement(By.css("body"));
        const src = await element.getText();
    
        if (src == "404! not found!") {
            console.log(`Tab ${tabNumber}: Link not found for URL: ${url}`);
            await addToNotFoundURLs(url); // Add the URL to the notFoundURLs file
            await driver.sleep(50);
            await tryLink(driver, tabNumber);
        } else {
            console.log(`Tab ${tabNumber}: Link found! URL: ${BASE_URL}${url}.mp4`);
            await addToWorkingURLs(url); // Add the URL to the workingURLs file
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

// Function to check if the URL is in the notFoundURLs file
async function isUrlNotFound(url) {
    try {
        const notFoundURLs = await getNotFoundURLs();
        return notFoundURLs.includes(url);
    } catch (error) {
        console.error('Error checking if URL is not found:', error);
        return false;
    }
}

// Function to get the content of the notFoundURLs file
async function getNotFoundURLs() {
    try {
        const content = await fs.readFile(notFoundURLsFilePath, 'utf-8');
        return content.trim().split('\n');
    } catch (error) {
        // If the file doesn't exist, return an empty array
        if (error.code === 'ENOENT') {
            return [];
        }
        console.error('Error reading notFoundURLs file:', error);
        return [];
    }
}

// Function to add the URL to the notFoundURLs file
async function addToNotFoundURLs(url) {
    try {
        await fs.appendFile(notFoundURLsFilePath, url + '\n');
    } catch (error) {
        console.error('Error adding URL to notFoundURLs file:', error);
    }
}

// Function to add the URL to the workingURLs file
async function addToWorkingURLs(url) {
    try {
        await fs.appendFile(workingURLsFilePath, url + '\n');
    } catch (error) {
        console.error('Error adding URL to workingURLs file:', error);
    }
}

// Execute the initialization
(async function () {
    await initializeWebDrivers(numDrivers);
})();