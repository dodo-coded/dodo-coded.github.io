const titles = document.getElementsByClassName('windowTitle')
let target, oldTarget, offsetX, offsetY;

for (let i = 0; i < titles.length; i++) {
    titles[i].addEventListener('mousedown',grabWindow);
    document.addEventListener('mouseup', relaseWindow);
}

function grabWindow(event){
    target = event.target.parentElement;
    let rect = target.getBoundingClientRect();
    target.style.cursor = 'move';
    offsetX = event.x-rect.left;
    offsetY = event.y-rect.top;

    target.style.position = 'absolute';
    target.style.left = rect.left+'px';
    target.style.top = rect.top+'px';
    if (oldTarget) {
        oldTarget.style.zIndex = 0
    }
    target.style.zIndex = 1
    document.addEventListener('mousemove', moveWindow);
}

function relaseWindow(){
    if (target){
        target.style.cursor = 'default';
        document.removeEventListener('mousemove', moveWindow);
        oldTarget = target
    }
    
}

function moveWindow(event){
    target.style.left = (event.x-offsetX)+'px';
    target.style.top = (event.y-offsetY)+'px';
}

function addWindow(){
    const windowBox = document.createElement('div');
    windowBox.classList.add('windowBox');

    const windowTitle = document.createElement('p');
    windowTitle.classList.add('windowTitle')
    windowTitle.innerText = 'Title';
    windowTitle.addEventListener('mousedown',grabWindow);

    const windowCloseButton = document.createElement('button')
    windowCloseButton.classList.add('windowCloseButton')
    windowCloseButton.addEventListener('click', (e) => {
        closeWindow(e.target)
    })

    windowBox.append(windowTitle, windowCloseButton,'content');
    document.getElementsByTagName('main')[0].prepend(windowBox);
}

function closeWindow(element){
    element.parentElement.remove()
}

function resetWindows(){
    location.reload()
}