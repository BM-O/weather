const search = document.getElementById("get_location");

search.addEventListener("click", () => {
  const addr = document.getElementById("address").value;
  const getCoords = firebase.functions().httpsCallable("getCoords");
  getCoords({ address: addr }).then((result) => console.log(result.data));
});
