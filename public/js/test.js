let addr = "Portland, OR";
const update = document.getElementById("get_location");

update.addEventListener("click", () => {
    addr = document.getElementById("address").value;
    console.log("addr", addr);
    myMove();
});

function myMove() {
  const getCoords = firebase.functions().httpsCallable("getCoords");
  getCoords({ address: addr }).then((result) => {
    let savedAddr = addr;
    let data = result.data;
    var elem = document.getElementById("inner");
    var pos = 0;
    var id = setInterval(frame, 20);
    console.log("addr", addr);
    function frame() {
          if (addr != savedAddr){
              console.log("change",addr)
              return;
          }
      if (pos >= window.screen.width) {
        pos = 0;
      } else {
        pos += data["weather"][0]["tempCel"]/4;
        elem.style.top = pos + "px";
        elem.style.left = pos + "px";
      }
    }
  });
}

