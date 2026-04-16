import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();
    
    // Wait for the page to load
    await page.goto('https://venueflow-bdknjnccqa-uc.a.run.app/', {waitUntil: 'networkidle0'});
    
    // Wait an extra two seconds to be sure
    await new Promise(r => setTimeout(r, 2000));
    
    const text = await page.evaluate(() => document.body.innerText);
    const html = await page.evaluate(() => document.body.innerHTML);
    console.log("PAGE TEXT:", text);
    console.log("PAGE HTML length:", html.length);
    
    await browser.close();
})();
