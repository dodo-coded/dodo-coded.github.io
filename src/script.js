var images = document.getElementsByClassName('img-view');

var imgViewer = document.getElementById('img-viewer');
var viewedImg = document.getElementById('viewed-img');

imgViewer.addEventListener('click', (e)=>{
    if (e.target == imgViewer){
        imgViewer.style.display = 'none';
    }
})

for (let img of images){
    img.addEventListener('click', (e)=>{
        imgViewer.style.display = 'flex';
        imgViewer.style.animation = 'fade-in .2s ease';

        viewedImg.src = img.src;
        if (viewedImg.naturalWidth > viewedImg.naturalHeight){
            viewedImg.style.width = '60%';
            viewedImg.style.height = 'unset';
        }
        else{
            viewedImg.style.width = 'unset';
            viewedImg.style.height = '90%';
        }
    })
}

var lang = 'eng';

var translationSwitch = document.getElementById('translation-switch');
var translationSwitchBg = document.getElementById('translation-switch-bg');

translationSwitch.addEventListener('click', (e)=>{
    if (lang == 'eng'){
        translationSwitchBg.style.left =  '0'
        translationSwitchBg.style.backgroundImage = 'url("https://flagcdn.com/h40/pl.png")'
        translationSwitchBg.style.animation = 'switch-left .2s ease'
        lang = 'pl'
        translate()
    } else {
        translationSwitchBg.style.left =  '50%'
        translationSwitchBg.style.backgroundImage = 'url("https://flagcdn.com/h40/gb.png")'
        translationSwitchBg.style.animation = 'switch-right .2s ease'
        lang = 'eng'
        translate()
    }
})

var elsToTranslate = document.getElementsByClassName('translate');
function translate(){
    fetch('/lang.json')
    .then(res=>res.json())
    .then(langData => {
        for (el of elsToTranslate){
            var key = el.classList[1];
            if (key.includes('t-')){
                var translatedText = langData[lang][key];
                if (translatedText){
                    el.innerText = translatedText;
                }
            }
        }
        
    });
}

// mobile
var menuButton = document.getElementById('menu-button');
var menu = document.getElementById('nav-links');
menuButton.addEventListener('click',(e)=>{
    if (menu.style.display == 'none'){
        menu.style.display = 'flex';
    }
    else{
        menu.style.display = 'none';
    }
})