const {chromium}=require('playwright');
const fs=require('node:fs');const assert=require('node:assert/strict');
const out=require('node:path').join(__dirname,'../docs');
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});try{
 const page=await browser.newPage({viewport:{width:375,height:812},reducedMotion:'reduce'});
 await page.addInitScript(()=>{window.metrics={lcp:null,cls:0};new PerformanceObserver(list=>{for(const e of list.getEntries())window.metrics.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.metrics.cls+=e.value;}).observe({type:'layout-shift',buffered:true});});
 await page.goto('http://127.0.0.1:4173/badboys-barbearia-demo/');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1200);
 const metrics=await page.evaluate(()=>window.metrics);await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').textContent(),'Pular para o conteúdo');
 await page.getByRole('button',{name:'Abrir menu'}).click();await page.keyboard.press('Escape');assert.equal(await page.locator(':focus').getAttribute('id'),'menu-toggle');
 const audits=[];async function audit(label){await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const r=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));audits.push({label,violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});}
 await audit('serviço mobile');await page.getByRole('button',{name:'Sobrancelha R$ 5,00',exact:true}).click();const next=()=>page.getByRole('button',{name:'CONTINUAR',exact:true}).click();await next();await next();await audit('calendário mobile');
 const dates=page.locator('.calendar-grid button:not(:disabled)');await dates.last().click();await page.screenshot({path:`${out}/calendar-mobile.png`});await next();await audit('horário mobile');await page.getByLabel('Horário desejado',{exact:true}).fill('11:42');await next();await audit('formulário mobile');
 const landscape=[];for(const width of [568,667,844,932]){await page.setViewportSize({width,height:390});landscape.push(await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth})));}
 await page.setViewportSize({width:1440,height:900});await audit('formulário desktop');
 fs.writeFileSync(`${out}/additional-results.json`,JSON.stringify({metrics:{...metrics,note:'Amostra local sem limitação de rede ou CPU. Não representa métricas de campo. INP não medido.'},audits,landscape,keyboard:['skip link','Escape fecha menu e devolve foco']},null,2));console.log(JSON.stringify({metrics,audits,landscape},null,2));
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});

