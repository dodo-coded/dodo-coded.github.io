const windows = document.getElementsByClassName('windowBox');
const main = document.getElementsByTagName('main')[0]
let target, oldTarget;
const minWindowWidth = windows[0].getBoundingClientRect().width;
const minWindowHeight = windows[0].getBoundingClientRect().height;
let leftDist, topDist, rightDist, bottomDist, resizeDirX, resizeDirY;
let currentRect;
const resizeThreshold = 10, moveThreshold = 30;

for (let i = 0; i < windows.length; i++) {
    windows[i].addEventListener('mousedown',grabWindow);
}
document.addEventListener('mouseup', relaseWindow);

function grabWindow(e){
    // check if mouse was clicked on title or window, and set target
    if (e.target.classList.contains('windowBox')){
        target = e.target;
    } else if (e.target.classList.contains('windowTitle')){
        target = e.target.parentElement;
    } else {
        // if mouse was clicked on 'x', dont grab window
        return;
    }
    
    // get mouse position inside the window
    let rect = target.getBoundingClientRect();
    leftDist = event.x-rect.left;
    topDist = event.y-rect.top;
    rightDist = rect.width-leftDist;
    bottomDist = rect.height-topDist;

    // if the mouse is in the blue area at the top, enable movement
    if (topDist<moveThreshold && topDist>resizeThreshold && leftDist>resizeThreshold && rightDist>resizeThreshold){
        main.style.cursor = 'move';
        target.style.position = 'absolute';
        target.style.left = rect.left+'px';
        target.style.top = rect.top+'px';
        if (oldTarget) {
            oldTarget.style.zIndex = 0;
        }
        target.style.zIndex = 1;
        document.addEventListener('mousemove', moveWindow);
    }

    // if the mouse is on the window border, check which border its on
    let cursorDir = ''
    if (topDist<resizeThreshold){ 
        resizeDirY = -1;
        cursorDir += 'n';
    } 
    else if (bottomDist<resizeThreshold){ 
        resizeDirY = 1;
        cursorDir += 's';
    }
    else { resizeDirY = 0 }
    if (leftDist<resizeThreshold){ 
        resizeDirX = -1;
        cursorDir += 'w';
    } 
    else if (rightDist<resizeThreshold){ 
        resizeDirX = 1;
        cursorDir += 'e';
    }
    else { resizeDirX = 0 }

    // if its on any border, enable resizing
    if (resizeDirX != 0 || resizeDirY != 0){
        currentRect = rect;
        main.style.cursor = cursorDir+'-resize';
        document.addEventListener('mousemove', resizeWindow);
    }
}

function relaseWindow(){
    if (target){
        main.style.cursor = 'default';
        document.removeEventListener('mousemove', moveWindow);
        document.removeEventListener('mousemove', resizeWindow);
        oldTarget = target;
    }
}

function moveWindow(event){
    // move window with offset (leftDist and topDist)
    target.style.left = (event.x-leftDist)+'px';
    target.style.top = (event.y-topDist)+'px';
}

function resizeWindow(event){
    // resize to the right
    if (resizeDirX == 1){
        let width = event.x-currentRect.right+currentRect.width;
        if (width < minWindowWidth) {
            target.style.width = minWindowWidth+'px';
        } else {
            target.style.width = width+'px';
        }
    }
    // resize to the left
    else if (resizeDirX == -1){
        let width = (event.x-currentRect.left)*-1+currentRect.width;
        if (width < minWindowWidth) {
            target.style.width = minWindowWidth+'px';
            target.style.left = (currentRect.right-minWindowWidth)+'px';
        } else {
            target.style.width = width+'px';
            target.style.left = currentRect.left+(event.x-currentRect.left)+'px';
        }
    }

    // resize to the bottom
    if (resizeDirY == 1){
        let height = event.y-currentRect.bottom+currentRect.height;
        if (height < minWindowHeight) {
            target.style.height = minWindowHeight+'px';
        } else {
            target.style.height = height+'px';
        }
    }
    // resize to the top
    else if (resizeDirY == -1){
        let height = (event.y-currentRect.top)*-1+currentRect.height;
        if (height < minWindowHeight) {
            target.style.height = minWindowHeight+'px';
            target.style.top = currentRect.bottom-minWindowHeight+'px';
        } else {
            target.style.height = height+'px';
            target.style.top = currentRect.top+(event.y-currentRect.top)+'px';
        }
    }
}

function addWindow(){
    const windowBox = document.createElement('div');
    windowBox.classList.add('windowBox');

    const windowTitle = document.createElement('p');
    windowTitle.classList.add('windowTitle')
    windowTitle.innerText = 'Title';
    windowBox.addEventListener('mousedown',grabWindow);

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