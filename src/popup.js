'use strict';
(function() {
  let input = document.getElementById("input")
  input.addEventListener('pressKey', (event) => {
    console.log(event);
  })

  function search() {
    let txt = document.getElementById("input").value
    txt = txt.trim()
    console.log("popup search ", txt);
  }

  function home() {
    window.open("./pages/search.html")
  }
})();
