import puppeteer from "puppeteer";

(async () => {
  try {
    // Set target website
    const url = "https://dog.ceo/dog-api/";
    const dimensions = { width: 2550, height: 3300 };

    // Note: "headless" necessary for pdf generation
    const browser = await puppeteer.launch({
      headless: true,
      args: [`--window-size=${dimensions.width},${dimensions.height}`],
    });
    // Open a tab/page:
    const page = await browser.newPage();

    // Set viewport size
    await page.setViewport({
      width: dimensions.width,
      height: dimensions.height,
    });

    // Alternative viewport dimension setting:
    const windowDimensions = await page.evaluate(() => {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        deviceScaleFactor: window.devicePixelRatio,
      };
    });
    console.log("windowDimensions:", windowDimensions);

    await page.setContent(html);
    await page.emulateMediaType("screen"); // Assuming pdfs are for digital use rather than print

    const pdfBuffer = await page.pdf({
      width: dimensions.width,
      height: dimensions.height,
    }); // Sign-post to pup2 internal api targeting
    await page.pdf({
      width: dimensions.width,
      height: dimensions.height,
      path: `./ver2-a4-format.pdf`,
    });

    await page.close();
    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.error("Error:", error);
  }
})();
