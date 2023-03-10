'use strict';
function addEventListener() {
  let input = document.getElementById("popinput")
  input.addEventListener('keypress', (event) => {
    if(event.keyCode == 13) {
      let txt = input.value.trim()
      if (txt == '') {
        window.open("./pages/search.html")
      } else {
        window.open("./pages/search.html?value="+ txt +"&type=0")
      }
    }
  })

  let search = document.getElementById("popsearch")
  search.addEventListener('click', (event) => {
    let txt = input.value.trim()
    if (txt == '') {
      window.open("./pages/search.html")
    } else {
      window.open("./pages/search.html?value="+ txt +"&type=0")
    }
  })

  let home = document.getElementById("pophome")
  home.addEventListener('click', (event) => {
    window.open("./pages/search.html")
  })
}

addEventListener()



