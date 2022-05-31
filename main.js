const puppeteer = require("puppeteer");
const fs = require("fs");
const { exit } = require("process");

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

const minimal_args = [
  "--autoplay-policy=user-gesture-required",
  "--disable-background-networking",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-client-side-phishing-detection",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-dev-shm-usage",
  "--disable-domain-reliability",
  "--disable-extensions",
  "--disable-features=AudioServiceOutOfProcess",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-notifications",
  "--disable-offer-store-unmasked-wallet-cards",
  "--disable-popup-blocking",
  "--disable-print-preview",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-setuid-sandbox",
  "--disable-speech-api",
  "--disable-sync",
  "--hide-scrollbars",
  "--ignore-gpu-blacklist",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-default-browser-check",
  "--no-first-run",
  "--no-pings",
  "--no-sandbox",
  "--no-zygote",
  "--password-store=basic",
  "--use-gl=swiftshader",
  "--use-mock-keychain",
];
const lichhoc = (function getData(USERNAME, PASSWORD) {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: minimal_args,
    });
    const page = await browser.newPage();
    await page.goto(
      "https://sso.hcmut.edu.vn/cas/login?service=https://mybk.hcmut.edu.vn/my/homeSSO.action"
    );
    await page.waitForSelector("#username");
    await page.click("#username");
    await page.type("#username", USERNAME);
    await page.waitForSelector("#password");
    await page.type("#password", PASSWORD);
    await page.waitForSelector(".btn-submit");
    await page.click(".btn-submit");
    await page.goto("https://mybk.hcmut.edu.vn/stinfo/", {
      waitUntil: "domcontentloaded",
    });
    const urlAddress = await page.url();
    if (urlAddress != "https://mybk.hcmut.edu.vn/stinfo/") {
      await browser.close();
      reject("Sai mat khau");
    } else {
      await page.waitForSelector(
        "#jqxTabs > div.jqx-tabs-content.jqx-widget-content.jqx-rc-b > div > div > div:nth-child(4) > div > div > div.box-content-home > div > div:nth-child(1)"
      );
      await page.click(
        "#jqxTabs > div.jqx-tabs-content.jqx-widget-content.jqx-rc-b > div > div > div:nth-child(4) > div > div > div.box-content-home > div > div:nth-child(1)"
      );
      page.on("response", async (response) => {
        if (
          response.url() ==
          "https://mybk.hcmut.edu.vn/stinfo/lichthi/ajax_lichhoc"
        ) {
          console.log("Get calendar successfully");
          const result = await response.json();
          await browser.close();
          resolve(result);
        }
      });
    }
  });
})(USERNAME, PASSWORD);
const grade = (function getData(USERNAME, PASSWORD) {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: minimal_args,
    });
    const page = await browser.newPage();
    await page.goto(
      "https://sso.hcmut.edu.vn/cas/login?service=https://mybk.hcmut.edu.vn/my/homeSSO.action"
    );
    await page.waitForSelector("#username");
    await page.click("#username");
    await page.type("#username", USERNAME);
    await page.waitForSelector("#password");
    await page.type("#password", PASSWORD);
    await page.waitForSelector(".btn-submit");
    await page.click(".btn-submit");
    await page.goto("https://mybk.hcmut.edu.vn/stinfo/", {
      waitUntil: "domcontentloaded",
    });
    const urlAddress = await page.url();
    if (urlAddress != "https://mybk.hcmut.edu.vn/stinfo/") {
      await browser.close();
      reject("Sai mat khau");
    } else {
      await page.waitForSelector(
        "#jqxTabs > div.jqx-tabs-content.jqx-widget-content.jqx-rc-b > div > div > div:nth-child(4) > div > div > div.box-content-home > div > div:nth-child(3)"
      );
      await page.click(
        "#jqxTabs > div.jqx-tabs-content.jqx-widget-content.jqx-rc-b > div > div > div:nth-child(4) > div > div > div.box-content-home > div > div:nth-child(3)"
      );
      page.on("response", async (response) => {
        if (
          response.url() == "https://mybk.hcmut.edu.vn/stinfo/grade/ajax_grade"
        ) {
          console.log("Get grade successfully");
          const result = await response.json();
          await browser.close();
          resolve(result);
        }
      });
    }
  });
})(USERNAME, PASSWORD);

const start = async () => {
  await lichhoc
    .then(async (data) => {
      await fs.writeFileSync(
        "lichhoc" + USERNAME + ".json",
        JSON.stringify(data)
      );
    })
    .catch((error) => console.log(error));
  await grade
    .then(async (data) => {
      await fs.writeFileSync("diem" + USERNAME + ".json", JSON.stringify(data));
    })
    .catch((error) => console.log(error));
  exit();
};

start();
