const tabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(tab) {
  tabs.forEach(t => {
    const selected = t === tab;
    t.setAttribute('aria-selected', String(selected));
    t.tabIndex = selected ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if(event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if(event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if(event.key === 'Home') next = 0;
    if(event.key === 'End') next = tabs.length - 1;
    if(next !== undefined) { event.preventDefault(); activateTab(tabs[next]); tabs[next].focus(); }
  });
});
const form = document.querySelector('#contact-form');
if(form) {
 const status = document.querySelector('#form-status');
 document.querySelector('#copy-brief').addEventListener('click', async () => {
   if(!form.reportValidity()) return;
   const text = [form.dataset.subject, ...['name','company','email','service','message'].map(name => {
     const field = form.elements.namedItem(name);
     return `${field.closest('label').childNodes[0].textContent.trim()}: ${field.value.trim()}`;
   })].join('\n\n');
   try { await navigator.clipboard.writeText(text); status.textContent = form.dataset.copied; }
   catch { status.textContent = form.dataset.copyFailed; }
 });
 form.addEventListener('submit', async event => {
   event.preventDefault();
   if(!form.dataset.endpoint || !form.reportValidity()) return;
   const button = form.querySelector('[type="submit"]');
   const original = button.textContent;
   button.disabled = true;
   status.textContent = form.dataset.sending;
   try {
     const response = await fetch(form.dataset.endpoint, {
       method:'POST', headers:{'Content-Type':'application/json'},
       body:JSON.stringify({...Object.fromEntries(new FormData(form)),language:document.documentElement.lang}),
       signal:AbortSignal.timeout(15000), credentials:'omit',
     });
     // An explicit JSON acknowledgement prevents reporting an HTML error page as success.
     const result = await response.json();
     if(!response.ok || result.ok !== true) throw new Error('Submission not acknowledged');
     status.textContent = form.dataset.success;
     form.reset();
   } catch { status.textContent = form.dataset.failure; }
   finally { button.disabled = false; button.textContent = original; }
 });
}
