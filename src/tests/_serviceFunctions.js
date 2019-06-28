const dispatchMove = (divThumb, coordX, coordY, moveDistance)=>{
    const evtDown = new MouseEvent('mousedown', {
        'view': window,
        'bubbles': true,
        'screenX': coordX,
        'screenY': coordY,
        'cancelable': true
    });

    const evtMove = new MouseEvent('mousemove', {
        'view': window,
        'screenX': coordX + moveDistance,
        'screenY': coordY,
        'bubbles': true,
        'cancelable': true
    });

    divThumb.dispatchEvent(evtDown);
    divThumb.dispatchEvent(evtMove);
};

export {dispatchMove}