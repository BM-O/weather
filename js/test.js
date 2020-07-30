function myMove() {
    var elem = document.getElementById("inner");
    var pos = 0;
    var id = setInterval(frame, 1);
    function frame() {
        if (pos >= window.screen.width) {
            // clearInterval(id);
            pos = 0;
        } else {
            pos+=5;
            elem.style.top = pos + 'px';
            elem.style.left = pos + 'px';
        }
    }
}