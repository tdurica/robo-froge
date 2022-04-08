const puppeteer = require("puppeteer");

module.exports =  async function htmlToImage (imgId, numFroges,user4,actionLabel,usdVal) {
  const browser = await puppeteer.launch({
    // headless: false,devtools: true,
    // slowMo: 250, // slow down by 250ms
    args: ['--allow-file-access-from-files', '--enable-local-file-accesses'],
  });

  const page = await browser.newPage();
  // await page.setContent(html,{
  //   waitUntil:'networkidle0'//load |domcontentloaded |networkidle0|networkidle2
  // });
  await page.goto(path.resolve(__dirname , '/builder.html'))
  await page.setViewport({
    width: 500,
    height: 500,
    deviceScaleFactor: 2,
  })
  const body = await page.$("body");
  const $froges = await page.$("#froges");
  const $txtype = await page.$("#txtype");
  const $boxBg = await page.$("#boxBg");
  const $user4 = await page.$("#user4");
  const $usdVal = await page.$("#usdVal");
  await page.evaluate(($froges,$boxBg,$user4,$txtype,$usdVal, imgId, numFroges,user4,actionLabel,usdVal) => {
    debugger;
    $usdVal.textContent = ''//'$'+usdVal;
    $txtype.textContent = 'INCOMING MESSAGE FROM MOONCO'//actionLabel;
    $user4.textContent = user4;
    $boxBg.style.backgroundImage = `url("frogs/${imgId}.jpg")`;//url("frogs/003.jpg")
    // $froges.innerHTML = ('<img src="froge-logo.svg"/>'.repeat(numFroges));
    $froges.innerHTML = ('');
    debugger;
  },$froges,$boxBg,$user4,$txtype,$usdVal, imgId, numFroges,user4,actionLabel,usdVal);
  // await $froges.dispose()

  const imageBuffer = await body.screenshot({
    type:'png',//jpeg, png or webp
    // quality: 100,//0-100 (not png)
    // omitBackground:
    //
    // -9**++-*//
    // true,
    // clip:{widt0.484h:300,height:185,x:0,y:0}
  });
  await page.close();
  await browser.close();
  return imageBuffer;
}
