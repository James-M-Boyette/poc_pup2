import puppeteer from "puppeteer";

export default async function handler(req, res) {
  const pageToConvert = req.query.target;
  console.log("pageToConvert:", pageToConvert);

  await generatePdf(pageToConvert).then((pdfBuffer) => {
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  });
}

async function generatePdf(pageToConvert) {
  try {
    // Set target website
    const url = pageToConvert;
    const dimensions = { width: 2550, height: 3300 };

    // Note: "headless" necessary for pdf generation
    const browser = await puppeteer.launch({
      headless: true,
      args: [`--window-size=${dimensions.width},${dimensions.height}`],
    });
    // Open a tab/page:
    const page = await browser.newPage();

    // Set viewport size:
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

    // Go to url:
    await page.goto(url, { waitUntil: "networkidle0" });

    // await page.setContent(html);
    await page.emulateMediaType("screen"); // Assuming pdfs are for digital use rather than print

    // Store page as pdf buffer:
    const pdfBuffer = await page.pdf({
      width: dimensions.width,
      height: dimensions.height,
      printBackground: true,
    });

    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.error("Error:", error);
  }
}
