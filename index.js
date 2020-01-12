const puppeteer = require("puppeteer");
const axios = require("axios")

(async () => {
  const url = 'http://api.tianapi.com/txapi/saylove/index?key=06888a8ba73ffb85d6a486033d7f7f17'
  const {data} = await axios.get(url)
  const message = data.newslist[0].content
  console.log(message)

  const browser = await puppeteer.launch({ headless: true });
  const page = (await browser.pages())[0];

  await page.goto("https://user.qzone.qq.com/583544509");

  const loginframeEl = await page.waitForSelector("#login_frame");
  const loginFrame = await loginframeEl.contentFrame();
  await loginFrame.waitFor(".face");
  await loginFrame.click(".face");
  await page.waitFor(".btn-fs-sure");
  await page.click(".btn-fs-sure");
  await page.click(".head-nav-menu>.menu_item_334");

  const containerFrame = await page.frames()[0]; //.find(f => f.name() === 'app_canvas_frame')

  const editorFrame = (await containerFrame.childFrames())[0];

  await page.waitFor(2000);

  await editorFrame.type("body", message);

  await page.evaluate(() => {
    const startDom = document.querySelectorAll('iframe')[1].contentDocument;
    startDom.querySelector('#btnPostMsg').click()
  })
  await page.waitFor(2000);
  await browser.close();
})();
