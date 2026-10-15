const {chromium}=require('playwright');
const fs=require('node:fs');
const out=require('node:path').join(__dirname,'../docs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage();let errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 const widths=[320,360,375,390,402,430,480,600,768,850,1024,1280,1440,1920];let results=[];
 for(const width of widths){await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:4173/badboys-barbearia-demo/');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1000);
  const result=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left < -1)&&getComputedStyle(e).position!=='fixed'}).map(e=>({tag:e.tagName,class:e.className})),brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)}));results.push(result);
  if([375,390,430,1440].includes(width)){await page.screenshot({path:`${out}/screenshot-${width}.png`,fullPage:true});}
 }
 fs.writeFileSync(`${out}/responsive-results.json`,JSON.stringify({results,errors},null,2));
 console.log(JSON.stringify({results,errors},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
