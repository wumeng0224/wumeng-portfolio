(function(){
  var AudioCtx=window.AudioContext||window.webkitAudioContext;
  var audio=null;
  var muted=localStorage.getItem('pixelSoundMuted')==='1';

  function ensureAudio(){
    if(!AudioCtx||muted)return null;
    if(!audio)audio=new AudioCtx();
    if(audio.state==='suspended')audio.resume();
    return audio;
  }
  function tone(freq,delay,duration,gain,type){
    var a=ensureAudio();if(!a)return;
    var start=a.currentTime+(delay||0),osc=a.createOscillator(),vol=a.createGain();
    osc.type=type||'square';osc.frequency.setValueAtTime(freq,start);
    vol.gain.setValueAtTime(.0001,start);
    vol.gain.exponentialRampToValueAtTime(gain||.045,start+.008);
    vol.gain.exponentialRampToValueAtTime(.0001,start+duration);
    osc.connect(vol);vol.connect(a.destination);osc.start(start);osc.stop(start+duration+.02);
  }
  function introSound(){
    [[262,0,.11],[330,.1,.11],[392,.2,.11],[523,.3,.16],[392,.48,.09],[523,.57,.09],[659,.66,.2]].forEach(function(n,i){tone(n[0],n[1],n[2],i===6?.055:.035,'square')});
    tone(131,0,.42,.025,'triangle');tone(196,.43,.38,.025,'triangle');
  }
  function clickSound(){
    if(muted)return;tone(520,0,.045,.025,'square');tone(780,.045,.055,.02,'square');
  }

  var soundStyle=document.createElement('style');
  soundStyle.textContent='.sound-toggle{position:fixed;z-index:10001;right:18px;bottom:18px;border:2px solid #68f6ff;background:#02030a;color:#68f6ff;padding:9px 11px;font:700 11px "Courier New",monospace;box-shadow:4px 4px 0 #1762ff}.sound-gate{position:fixed;inset:0;z-index:10002;display:flex;align-items:center;justify-content:center;background:#02030af2;padding:24px}.sound-gate button{border:2px solid #68f6ff;background:#1762ff;color:#fff;min-width:150px;padding:18px 26px;text-align:center;font:900 14px "Courier New","Microsoft YaHei",monospace;letter-spacing:.08em;box-shadow:8px 8px 0 #68f6ff}.sound-gate small{display:block;margin-top:9px;font-size:10px;color:#dffcff}@media(max-width:760px){.sound-toggle{right:12px;bottom:12px}}';
  document.head.appendChild(soundStyle);
  var toggle=document.createElement('button');
  toggle.className='sound-toggle';toggle.type='button';
  function updateToggle(){toggle.textContent=muted?'音效：关':'音效：开';toggle.setAttribute('aria-pressed',String(!muted))}
  updateToggle();document.body.appendChild(toggle);
  toggle.addEventListener('click',function(e){e.stopPropagation();muted=!muted;localStorage.setItem('pixelSoundMuted',muted?'1':'0');updateToggle();if(!muted){ensureAudio();clickSound()}});

  if(!muted&&!sessionStorage.getItem('pixelSoundStarted')){
    var gate=document.createElement('div');gate.className='sound-gate';
    gate.innerHTML='<button type="button">点击进入</button>';
    document.body.appendChild(gate);
    gate.querySelector('button').addEventListener('click',function(e){e.stopPropagation();sessionStorage.setItem('pixelSoundStarted','1');introSound();gate.style.opacity='0';gate.style.transition='opacity .22s';setTimeout(function(){gate.remove()},230)});
  }

  document.addEventListener('pointerdown',function(e){
    if(e.target.closest('.sound-toggle,.sound-gate'))return;
    if(e.target.closest('a,button,.card'))clickSound();
  },{passive:true});

  if(!window.matchMedia||!matchMedia('(pointer:fine)').matches)return;
  document.body.classList.add('pixel-mode');
  var canvas=document.createElement('canvas');
  canvas.setAttribute('aria-hidden','true');
  canvas.style.cssText='position:fixed;inset:0;z-index:9998;pointer-events:none;width:100%;height:100%';
  document.body.appendChild(canvas);
  var ctx=canvas.getContext('2d',{alpha:true});
  var dpr=1,particles=[],running=false,lastSpawn=0;
  function resize(){dpr=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.round(innerWidth*dpr);canvas.height=Math.round(innerHeight*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
  resize();addEventListener('resize',resize,{passive:true});
  function frame(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    for(var i=particles.length-1;i>=0;i--){var p=particles[i];p.life-=.075;p.x-=.18;p.y+=.08;if(p.life<=0){particles.splice(i,1);continue}ctx.globalAlpha=p.life;ctx.fillStyle=i%2?'#68f6ff':'#1762ff';var size=p.size*(.55+.45*p.life);ctx.fillRect(Math.round(p.x),Math.round(p.y),Math.ceil(size),Math.ceil(size))}
    ctx.globalAlpha=1;if(particles.length){requestAnimationFrame(frame)}else{running=false}
  }
  addEventListener('pointermove',function(e){var now=performance.now();if(now-lastSpawn<42)return;lastSpawn=now;particles.push({x:e.clientX-4,y:e.clientY+8,size:4+Math.random()*3,life:1});if(particles.length>12)particles.shift();if(!running){running=true;requestAnimationFrame(frame)}},{passive:true});
})();

