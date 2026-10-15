const {chromium}=require('playwright');
const fs=require('node:fs');const assert=require('node:assert/strict');
const out=require('node:path').join(__dirname,'../docs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});const context=await browser.newContext({viewport:{width:390,height:844},permissions:['clipboard-read','clipboard-write'],reducedMotion:'reduce'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/badboys-barbearia-demo/');await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:`${out}/hero-mobile.png`});
 await page.getByRole('button',{name:'Abrir menu'}).click();await page.getByRole('navigation',{name:'Navegação principal'}).getByRole('link',{name:'Serviços',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Abrir menu'}).getAttribute('aria-expanded'),'false');
 await page.getByRole('button',{name:'Selecionar Barba, R$ 15,00'}).click();assert.equal(await page.getByRole('button',{name:'Barba R$ 15,00',exact:true}).getAttribute('aria-pressed'),'true');
 const next=()=>page.getByRole('button',{name:'CONTINUAR',exact:true}).click();
 await next();await next();await next();assert.ok(await page.getByRole('alert').isVisible());
 const tomorrow=await page.evaluate(()=>{const d=new Date();d.setDate(d.getDate()+1);return new Intl.DateTimeFormat('en-GB',{timeZone:'America/Sao_Paulo'}).format(d)});
 const day=page.getByRole('button',{name:tomorrow,exact:true});if(!await day.count()){await page.getByRole('button',{name:'Próximo mês'}).click();}await day.click();await next();
 await page.getByLabel('Horário desejado',{exact:true}).fill('08:00');await next();assert.ok(await page.getByRole('alert').isVisible());await page.getByLabel('Horário desejado',{exact:true}).fill('10:37');await next();
 await next();assert.ok(await page.getByRole('alert').isVisible());await page.getByLabel('Nome (obrigatório)',{exact:true}).fill('André Teste');await page.getByLabel('Observação (opcional)',{exact:true}).fill('Gostaria de confirmar este horário.');await next();
 assert.ok(await page.getByRole('heading',{name:'Confira sua solicitação.'}).isVisible());const message=await page.getByLabel('Mensagem da solicitação').inputValue();assert.ok(message.includes('Serviço: Barba'));assert.ok(message.includes('10:37'));assert.ok(!message.includes('Telefone:'));assert.ok(message.includes('André Teste'));
 await page.getByRole('button',{name:'COPIAR MENSAGEM',exact:true}).click();assert.equal((await page.evaluate(()=>navigator.clipboard.readText())).replace(/\r\n/g,'\n'),message);assert.ok(await page.getByRole('button',{name:'MENSAGEM COPIADA'}).isVisible());
 await page.screenshot({path:`${out}/booking-mobile.png`,fullPage:true});
 await page.getByRole('button',{name:'Editar Nome',exact:true}).click();assert.equal(await page.getByLabel('Nome (obrigatório)').inputValue(),'André Teste');await next();
 assert.equal(await page.evaluate(()=>localStorage.length),0);assert.equal(await page.evaluate(()=>sessionStorage.length),0);
 await page.setViewportSize({width:320,height:740});console.log('overflow',await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>({tag:e.tagName,cls:String(e.className),parent:e.parentElement.outerHTML.slice(0,400),bounds:e.getBoundingClientRect().toJSON()}))));
 await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const axe=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
 fs.writeFileSync(`${out}/accessibility-results.json`,JSON.stringify({violations:axe.violations,incomplete:axe.incomplete.map(r=>({id:r.id,impact:r.impact})),passes:axe.passes.length},null,2));console.log('axe',axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
 await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:4173/badboys-barbearia-demo/');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${out}/hero-desktop.png`});
 fs.writeFileSync(`${out}/functional-results.json`,JSON.stringify({passed:['menu e âncoras','seleção pela lista de serviços','validação sem data','bloqueio de horário fora do funcionamento','nome obrigatório','resumo completo','cópia real no clipboard','edição preserva dados','nenhum dado em localStorage ou sessionStorage'],consoleErrors:errors},null,2));await browser.close();console.log('functional passed');
})().catch(e=>{console.error(e);process.exit(1)});

