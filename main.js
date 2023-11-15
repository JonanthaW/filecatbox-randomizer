const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
let driver;

(async function initialize() {
    try {
        let options = new firefox.Options();
        driver = await new Builder()
                    .forBrowser('firefox')
                    .setFirefoxOptions(options.addArguments('--headless')) // Browser should not appear
                    .build();
        await tryLink();
    }
    catch (err) {
        console.log(err);
    }
})();

async function tryLink() {
    let url = generateURL();
    try {
        await driver.get(`https://files.catbox.moe/${url}.mp4`);
        const element = await driver.findElement(By.tagName('html'));
        const text = await element.getText();

        if (text === "404! not found!") {
            //console.log('Link not found!');
            await driver.sleep(50);
            await tryLink();
        } else {
            console.log('Link found! = ' + url);
            await tryLink();
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

function generateURL() {
    let url = "";
    for (let i = 0; i < 6; i++) {
        url += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return url;
}
