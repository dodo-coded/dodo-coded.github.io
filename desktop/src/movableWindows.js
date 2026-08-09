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
document.removeEventListener('mousemove', moveWindow);
document.removeEventListener('mousemove', resizeWindow);
document.addEventListener('mousemove',hoverWindow);
document.addEventListener('mouseup', relaseWindow);

function hoverWindow(e){
    // check if mouse was hovered on title or window, and set target
    if (e.target.classList.contains('windowBox')){
        target = e.target;
    } else if (e.target.classList.contains('windowTitle')){
        target = e.target.parentElement;
    } else {
        // if mouse was not hovered on window, do nothing
        return;
    }
    target.addEventListener('mouseleave',exitWindow);

    // get mouse position inside the window
    let rect = target.getBoundingClientRect();
    leftDist = event.x-rect.left;
    topDist = event.y-rect.top;
    rightDist = rect.width-leftDist;
    bottomDist = rect.height-topDist;
    currentRect = rect;

    if (topDist<moveThreshold && topDist>resizeThreshold && leftDist>resizeThreshold && rightDist>resizeThreshold){
        main.style.cursor = 'move';
        return;
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
        main.style.cursor = cursorDir+'-resize';
        return;
    }
    main.style.cursor = 'default';
}

function exitWindow(e){
    // when exiting window, start scanning for windows to hover over again
    document.addEventListener('mousemove',hoverWindow);
    target.removeEventListener('mouseleave',exitWindow);
    main.style.cursor = 'default';
}

function grabWindow(e){
    // check if mouse was clicked on title or window, and set target
    if (e.target.classList.contains('windowBox')){
        target = e.target;
    } else if (e.target.classList.contains('windowTitle')){
        target = e.target.parentElement;
    } else {
        return;
    }
    // stop scanning for hovering over any window
    document.removeEventListener('mousemove',hoverWindow);
    // stop scanning for exiting the window (especially when resizing)
    target.removeEventListener('mouseleave',exitWindow);

    // get mouse position inside the window
    let rect = target.getBoundingClientRect();
    leftDist = event.x-rect.left;
    topDist = event.y-rect.top;
    rightDist = rect.width-leftDist;
    bottomDist = rect.height-topDist;
    currentRect = rect;
    
    if (oldTarget) {
        oldTarget.style.zIndex = "";
    }
    target.style.zIndex = 1;

    // if the mouse is in the blue area at the top, enable movement
    if (topDist<moveThreshold && topDist>resizeThreshold && leftDist>resizeThreshold && rightDist>resizeThreshold){
        target.style.position = 'absolute';
        target.style.left = currentRect.left+'px';
        target.style.top = currentRect.top+'px';
        document.addEventListener('mousemove', moveWindow);
        return
    }

    // if the mouse is on any border, enable resizing
    if (resizeDirX != 0 || resizeDirY != 0){
        document.addEventListener('mousemove', resizeWindow);
        return
    }
}

function relaseWindow(){
    if (target){
        main.style.cursor = 'default';
        // remove listeners for moving and resizing current window
        document.removeEventListener('mousemove', moveWindow);
        document.removeEventListener('mousemove', resizeWindow);
        // start scanning for hovering over windows again
        document.addEventListener('mousemove', hoverWindow)
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
    main.prepend(windowBox);
}

function closeWindow(element){
    element.parentElement.remove()
}

function resetWindows(){
    location.reload()
}