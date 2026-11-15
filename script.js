// Cole aqui o endereço real do streaming da sua rádio.
const STREAM_URL = ""; // Ex.: https://seu-servidor/stream
const video=document.getElementById("scrollVideo");
const filmSection=document.querySelector(".film-section");
const progress=document.getElementById("filmProgress");
const progressLabel=document.getElementById("progressLabel");
const counter=document.getElementById("counter");
const captions=[...document.querySelectorAll(".caption-item")];
let duration=0,rafPending=false;
video.addEventListener("loadedmetadata",()=>{duration=video.duration||0;video.pause();syncVideo();});
video.addEventListener("error",()=>document.querySelector(".film-sticky").classList.add("video-unavailable"));
function syncVideo(){
 if(!duration||!filmSection)return;
 const rect=filmSection.getBoundingClientRect(),scrollable=filmSection.offsetHeight-window.innerHeight;
 const travelled=Math.min(Math.max(-rect.top,0),scrollable),ratio=scrollable>0?travelled/scrollable:0;
 const target=ratio*Math.max(0,duration-.08);
 if(Math.abs(video.currentTime-target)>.035){try{video.currentTime=target;}catch(e){}}
 progress.style.width=(ratio*100)+"%";
 progressLabel.textContent=String(Math.round(ratio*100)).padStart(2,"0")+"%";
 const index=Math.min(3,Math.floor(ratio*4));
 captions.forEach((el,i)=>el.classList.toggle("active",i===index));
 counter.textContent=String(index+1).padStart(2,"0")+" / 04";
}
function requestSync(){if(rafPending)return;rafPending=true;requestAnimationFrame(()=>{syncVideo();rafPending=false;});}
window.addEventListener("scroll",requestSync,{passive:true});window.addEventListener("resize",requestSync);
const audio=document.getElementById("radioAudio"),playButton=document.getElementById("playRadio");
const status=document.getElementById("playerStatus"),equalizer=document.querySelector(".equalizer");
const volume=document.getElementById("volume");
if(STREAM_URL)audio.src=STREAM_URL;
audio.volume=Number(volume.value);
volume.addEventListener("input",()=>audio.volume=Number(volume.value));
playButton.addEventListener("click",async()=>{
 if(!STREAM_URL){status.textContent="ADICIONE O LINK DO STREAM EM script.js";return;}
 if(audio.paused){try{await audio.play();playButton.textContent="Ⅱ";playButton.setAttribute("aria-label","Pausar rádio");status.textContent="AO VIVO";equalizer.classList.add("playing");}catch(e){status.textContent="NÃO FOI POSSÍVEL CONECTAR";}}
 else{audio.pause();playButton.textContent="▶";playButton.setAttribute("aria-label","Tocar rádio");status.textContent="PAUSADO";equalizer.classList.remove("playing");}
});
audio.addEventListener("playing",()=>status.textContent="AO VIVO");
audio.addEventListener("waiting",()=>status.textContent="CONECTANDO...");
audio.addEventListener("error",()=>status.textContent="ERRO NO STREAM");
const menuButton=document.querySelector(".menu-toggle");
menuButton.addEventListener("click",()=>{
 const open=menuButton.getAttribute("aria-expanded")==="true";
 menuButton.setAttribute("aria-expanded",String(!open));
 let panel=document.querySelector(".mobile-nav");
 if(!panel){panel=document.createElement("nav");panel.className="mobile-nav";panel.innerHTML='<a href="#experiencia">Experiência</a><a href="#programacao">Programação</a><a href="#sobre">Sobre</a>';document.querySelector(".topbar").appendChild(panel);}
 panel.classList.toggle("show",!open);
});
requestSync();