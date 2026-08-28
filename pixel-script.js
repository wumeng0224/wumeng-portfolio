(function(){
  if(!window.matchMedia||!matchMedia('(pointer:fine)').matches)return;
  document.body.classList.add('pixel-mode');

  var canvas=document.createElement('canvas');
  canvas.setAttribute('aria-hidden','true');
  canvas.style.cssText='position:fixed;inset:0;z-index:9998;pointer-events:none;width:100%;height:100%';
  document.body.appendChild(canvas);
  var ctx=canvas.getContext('2d',{alpha:true});
  var dpr=1,particles=[],running=false,lastSpawn=0;

  function resize(){
    dpr=Math.min(window.devicePixelRatio||1,1.5);
    canvas.width=Math.round(innerWidth*dpr);
    canvas.height=Math.round(innerHeight*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  addEventListener('resize',resize,{passive:true});

  function frame(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    for(var i=particles.length-1;i>=0;i--){
      var p=particles[i];
      p.life-=.075;p.x-=.18;p.y+=.08;
      if(p.life<=0){particles.splice(i,1);continue}
      ctx.globalAlpha=p.life;
      ctx.fillStyle=i%2?'#68f6ff':'#1762ff';
      var size=p.size*(.55+.45*p.life);
      ctx.fillRect(Math.round(p.x),Math.round(p.y),Math.ceil(size),Math.ceil(size));
    }
    ctx.globalAlpha=1;
    if(particles.length){requestAnimationFrame(frame)}else{running=false}
  }

  addEventListener('pointermove',function(e){
    var now=performance.now();
    if(now-lastSpawn<42)return;
    lastSpawn=now;
    particles.push({x:e.clientX-4,y:e.clientY+8,size:4+Math.random()*3,life:1});
    if(particles.length>12)particles.shift();
    if(!running){running=true;requestAnimationFrame(frame)}
  },{passive:true});
})();
