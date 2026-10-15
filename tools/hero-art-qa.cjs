const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const out=path.resolve(__dirname,'../docs/hero-update');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}); const results=[];
 for(const [w,h,reduced] of [[375,812,false],[390,844,false],[430,932,false],[1440,900,false],[320,568,false],[768,1024,false],[1024,768,false],[1920,1080,false],[844,390,false],[390,844,true]]){
  const page=await browser.newPage({viewport:{width:w,height:h},reducedMotion:reduced?'reduce':'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/badboys-barbearia-demo/');
  await page.evaluate(()=>document.fonts.ready);await page.locator('.reveal-logo').evaluate(i=>i.decode());
  await page.waitForTimeout(250);
  const initial=await page.locator('.reveal-logo').evaluate(i=>getComputedStyle(i).opacity);
  if(!reduced)await page.evaluate(()=>{const e=document.querySelector('.intro-experience');window.scrollTo(0, Math.max(0,(e.offsetHeight-innerHeight)*.85));});
  await page.waitForTimeout(300);
  const data=await page.evaluate(()=>{const f=document.querySelector('.responsive-hero'),i=f.querySelector('img'),s=getComputedStyle(i);return {viewport:[innerWidth,innerHeight],overflow:document.documentElement.scrollWidth>innerWidth,art:f.dataset.art,fit:s.objectFit,position:s.objectPosition,bounds:JSON.parse(f.dataset.logoBounds),frame:[f.clientWidth,f.clientHeight],src:i.currentSrc,natural:[i.naturalWidth,i.naturalHeight],opacity:s.opacity,clip:s.clipPath,transform:s.transform,resources:performance.getEntriesByType('resource').filter(r=>r.name.includes('badboys-hero')).map(r=>r.name)}});
  data.initialOpacity=initial;data.reduced=!!reduced;data.errors=errors;
  const [l,t,r,b]=data.bounds;data.logoInside=l>=0&&t>=0&&r<=data.frame[0]+.1&&b<=data.frame[1]+.1;
  if(data.overflow||!data.logoInside||errors.length||data.clip!=='none'||data.resources.length!==1||t<Math.min(98,h*.2)-.1||b>h-Math.min(78,h*.16)+.1)throw Error(JSON.stringify(data));
  if([375,390,430,1440,1920,844].includes(w)){
   data.screenshot=`hero-${w}${reduced?'-reduced':''}.png`;
   await page.screenshot({path:path.join(out,data.screenshot)});
  }
  results.push(data);await page.close();
 }
 fs.writeFileSync(path.join(out,'responsive-results.json'),JSON.stringify(results,null,2));await browser.close();console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
