from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import random
import string

# Constants
ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
MAX_URL_LENGTH = 6
BASE_URL = 'https://files.catbox.moe/'

# File paths
not_found_urls_file_path = 'notFoundURLs.txt'
working_urls_file_path = 'workingURLs.txt'

# Function to initialize WebDriver
def initialize_webdriver():
    try:
        options = webdriver.FirefoxOptions()
        options.add_argument('--headless')
        driver = webdriver.Firefox(options=options)
        print("WebDriver initialized successfully.")

        # Run try_link
        try_link(driver)

    except Exception as e:
        print('Error initializing WebDriver:', e)
    finally:
        # Close the driver when done
        driver.quit()

# Main function to attempt accessing the link
def try_link(driver):
    url = generate_random_url()

    # Check if the URL has already been tested and found not found
    if is_url_not_found(url):
        print(f"URL already tested and not found: {url}")
        return

    try:
        driver.get(f"{BASE_URL}{url}.mp4")
        ##element = driver.find_element(By.CSS_SELECTOR, "body > img:nth-child(1)")
        ##src = element.get_attribute('src')
        ##if src == "https://files.catbox.moe/official/images/404.png":
        
        element = driver.find_element(By.CSS_SELECTOR, "body")
        src = element.text

        if src == "404! not found!":
            print(f"Link not found for URL: {url}")
            add_to_not_found_urls(url)  # Add the URL to the notFoundURLs file
            time.sleep(0.05)
            try_link(driver)
        else:
            print(f"Link found! URL: {BASE_URL}{url}.mp4")
            add_to_working_urls(url)  # Add the URL to the workingURLs file
            time.sleep(0.05)
            try_link(driver)
    except Exception as error:
        print("An error occurred:", error)

# Function to generate a random URL
def generate_random_url():
    return ''.join(random.choice(ALPHABET) for _ in range(MAX_URL_LENGTH))

# Function to check if the URL is in the not_found_urls file
def is_url_not_found(url):
    try:
        not_found_urls = get_not_found_urls()
        return url in not_found_urls
    except Exception as error:
        print('Error checking if URL is not found:', error)
        return False

# Function to get the content of the not_found_urls file
def get_not_found_urls():
    try:
        with open(not_found_urls_file_path, 'r') as file:
            content = file.read()
            return content.strip().split('\n')
    except FileNotFoundError:
        return []
    except Exception as error:
        print('Error reading not_found_urls file:', error)
        return []

# Function to add the URL to the not_found_urls file
def add_to_not_found_urls(url):
    try:
        with open(not_found_urls_file_path, 'a') as file:
            file.write(url + '\n')
    except Exception as error:
        print('Error adding URL to not_found_urls file:', error)

# Function to add the URL to the working_urls file
def add_to_working_urls(url):
    try:
        with open(working_urls_file_path, 'a') as file:
            file.write(url + '\n')
    except Exception as error:
        print('Error adding URL to working_urls file:', error)

# Execute the initialization
if __name__ == "__main__":
    initialize_webdriver()
