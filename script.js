document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();t.scrollIntoView({behavior:'smooth'})})});

(function(){
  var style=document.createElement('style');
  style.textContent='.page-jump{position:fixed;inset:0;z-index:9999;background:#173326;opacity:0;pointer-events:none;transition:opacity .16s ease;display:grid;place-items:center;color:#f3ead9;font:700 13px Arial;letter-spacing:.12em}.page-jump.show{opacity:1}.page-jump:after{content:"正在打开项目…";padding:12px 18px;border:1px solid #f3ead966;background:#173326}';
  document.head.appendChild(style);
  var mask=document.createElement('div');mask.className='page-jump';document.body.appendChild(mask);

  function prefetch(a){
    if(!a||a.dataset.prefetched)return;
    var url=new URL(a.href,location.href);
    if(url.origin!==location.origin||!url.pathname.endsWith('.html'))return;
    var l=document.createElement('link');l.rel='prefetch';l.href=url.href;document.head.appendChild(l);a.dataset.prefetched='1';
  }
  var links=[].slice.call(document.querySelectorAll('a.card,a[href$=".html"]'));
  links.forEach(function(a){
    a.addEventListener('mouseenter',function(){prefetch(a)},{once:true});
    a.addEventListener('touchstart',function(){prefetch(a)},{passive:true,once:true});
    a.addEventListener('click',function(e){
      if(e.defaultPrevented||e.button>0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      var url=new URL(a.href,location.href);
      if(url.origin!==location.origin)return;
      e.preventDefault();mask.classList.add('show');
      setTimeout(function(){location.href=url.href},90);
    });
  });
  if('IntersectionObserver'in window){
    var io=new IntersectionObserver(function(items){items.forEach(function(x){if(x.isIntersecting){prefetch(x.target);io.unobserve(x.target)}})},{rootMargin:'300px'});
    links.forEach(function(a){io.observe(a)});
  }
  window.addEventListener('pageshow',function(){mask.classList.remove('show')});
  if('serviceWorker'in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/wumeng-portfolio/sw.js').catch(function(){})})}
})();
