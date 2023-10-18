const puppeteer = require('puppeteer');

(async () => {
  // Launch a headless Chrome browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 720 },
  });

  // Create a new page in the browser
  const page = await browser.newPage();

  // User credentials
  const user_email = "abcd@gmail.com";  // Replace with your email
  const user_password = "xxxxx";    // Replace with your intranet password

  // Navigate to the login page
  await page.goto("https://intranet.alxswe.com/auth/sign_in");

  // Fill in the login form and submit
  await page.waitForSelector('form');
  await page.type('input[name="user[email]"]', user_email);
  await page.type('input[name="user[password]"]', user_password);
  await page.click('input[name="commit"]');
  
  // Wait for the login to be processed
  await page.waitForTimeout(5000);

  // Navigate to the authenticated page containing the resources
  await page.goto("https://intranet.alxswe.com/projects/current");


  const resourcesHandles = await page.$$('ul > li');

  for (const resourcehandle of resourcesHandles) {
    const resourceName = await page.evaluate((el) => el.querySelector('a').textContent, resourcehandle);
    const resourceUrl = await page.evaluate((el) => el.querySelector('a').getAttribute('href'), resourcehandle);

    if (!resourceUrl.startsWith("/projects/1")) {
        continue;
    }

    const completeUrl = "https://intranet.alxswe.com" + resourceUrl;
    const newPage = await browser.newPage();
    await newPage.goto(completeUrl, { waitUntil: 'load' });
    
    // Save the page as PDF
    await newPage.pdf({
        path: resourceName + ".pdf",
        format: 'A4'
    });
    
    await newPage.close();
  }

  // Close the browser
  await browser.close();
})();