// @ts-nocheck

require('dotenv').config();
const puppeteer = require("puppeteer");
const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36";
const url = 'https://www.ea.com/ea-sports-fc/ultimate-team/web-app/';
const wsChromeEndpointurl = process.env.WEB_SOCKET_DEBUGGER_URL

async function randomDelay(min, max) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise(resolve => setTimeout(resolve, delay));
}

async function switchInfo(page){
  try {
    await page.waitForSelector(infoButton, {timeout: 10000});
    await page.click(infoButton);
    console.log(`ho cliccato infoButton`);
  } catch (error){
    console.log(error)
  }
}

async function getIn(nav_item, page){
  try{
    console.log(process.env[nav_item])
    await page.waitForSelector(process.env[nav_item], {timeout: 10000, clickable: true});
    randomDelay(500, 1000)
    await page.click(process.env[nav_item]);
    await page.click(`${process.env[nav_item]}.selected`);

    console.log(`sono in ${nav_item}`);

  } catch (error){
    console.log(error)
  }
}

async function insert(param, param_selector, dropdownSelector, page){
  try{
    if(param != null){
      await page.waitForSelector(param_selector)

      if(param_selector===(process.env.PLAYER_NAME)){
        await page.type(param_selector, param, { delay: randomDelay(35, 67) });

        await randomDelay(500, 1000);
        try{
          await page.select(dropdownSelector, param); //PROVA SE E' MEGLIO CON param + overall
        } catch (error){
          console.log('NESSUN GIOCATORE CORRISPONDE A QUELLO CERCATO')  //serve ricontrollare se effettivamente è stato messo il giocatore giusto
        }
      }else if(param_selector===(process.env.TM_SEL_MIN_BID) || param_selector===(process.env.TM_SEL_MAX_BID) || param_selector===(process.env.TM_SEL_MIN_BN) || param_selector===(process.env.TM_SEL_MAX_BN)){
        await page.type(param_selector, param, { delay: randomDelay(35, 67) });

      }else{
        await page.click(param_selector);
        await randomDelay(500, 1000);
        await page.select(dropdownSelector, param);
      }
      await randomDelay(50, 100);
    }
  } catch (error){
    console.log(error);
  }

}

async function snipe(times, page){
  let found = false;

  for(let i = 0; i < times; i++){
    while (!found) {

      await page.waitForSelector(process.env.TM_SEARCH);
      await page.click(process.env.TM_SEARCH);

      try {

        await page.waitForSelector(process.env.SEL_BUY_NOW, { timeout: 5000 });
        found = true;
        await randomDelay(1, 19);
        console.log('yay'); //funzione per ACQUIZSTARE

        //try{
        //  await page.click(process.env.SEL_BUY_NOW);
        //  await page.waitForSelector(process.env.SEL_BUY_NOW_CONFIRMATION)
        //  await page.click(process.env.SEL_BUY_NOW_CONFIRMATION);
        //} catch (error){
        //  console.log('Someone was faster, retrying...');
        //  await randomDelay(50, 98);
        //  await page.click(process.env.GO_BACK);
        //  await randomDelay(100, 198);
        //  await page.waitForSelector(process.env.TM_TURN_MAX_PRICE_DOWN);
        //  await page.click(process.env.TM_TURN_MAX_PRICE_DOWN);
        //}

      } catch (error) {
        console.log('Element not found, retrying...');
        await randomDelay(50, 98);
        await page.click(process.env.GO_BACK);
        await randomDelay(100, 198);
        await page.waitForSelector(process.env.TM_TURN_MAX_PRICE_DOWN);
        await page.click(process.env.TM_TURN_MAX_PRICE_DOWN);

      }
    }
  }
}

(async () => {
  try{
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsChromeEndpointurl
    });
  
    const page = await browser.newPage();
    await page.setViewport({ width: 0, height: 0 });
    await page.setUserAgent(ua);
  
    await page.goto(url, {
      waitUntil: "networkidle0",
    });
  
    console.log('wait...');

    //------------------------- GET INTO MARKET -------------------------
    await randomDelay(10000, 11000)
    await getIn('NAV_TRANSFERS', page);
    await randomDelay(500, 1000)
    await getIn('TM_SEARCH_TRANSFER_MARKET', page);


    //--------------------------- SET FILTERS ---------------------------

    let _ = 0 //just for avoiding warnings

    await insert(null,                      process.env.TM_SEL_PLAYER_NAME,     process.env.TM_SEL_DROPDOWN_PLAYER, page)

    await insert(null,                      process.env.TM_SEL_QUALITY,         process.env.TM_SEL_DROPDOWN,        page)
    await insert(null,                      process.env.TM_SEL_RARITY,          process.env.TM_SEL_DROPDOWN,        page)
    await insert(null,                      process.env.TM_SEL_POSITION,        process.env.TM_SEL_DROPDOWN,        page)
    await insert(null,                      process.env.TM_SEL_CHEMISTRY_STYLE, process.env.TM_SEL_DROPDOWN,        page)
    await insert(null,                      process.env.TM_SEL_NATIONALITY,     process.env.TM_SEL_DROPDOWN,        page)
    await insert(null,                      process.env.TM_SEL_LEAGUE,          process.env.TM_SEL_DROPDOWN,        page)
    await insert(null,                      process.env.TM_SEL_CLUB,            process.env.TM_SEL_DROPDOWN,        page)
    await insert(null,                      process.env.TM_SEL_PLAYSTYLE,       process.env.TM_SEL_DROPDOWN,        page)

    await insert(process.env.MIN_BID_VALUE, process.env.TM_SEL_MIN_BID,         _,                                  page)
    await insert(process.env.MAX_BID_VALUE, process.env.TM_SEL_MAX_BID,         _,                                  page)
    await insert(process.env.MIN_BN_VALUE,  process.env.TM_SEL_MIN_BN,          _,                                  page)
    await insert(process.env.MAX_BN_VALUE,  process.env.TM_SEL_MAX_BN,          _,                                  page)

    //------------------------------- SNIPE -------------------------------

    //SERVE FUNZIONE PER CHECKKARE CHE TUTTO SIA GIUSTO

    await snipe(5, page)

  } catch (error){
    console.log(error);
  }
})();

