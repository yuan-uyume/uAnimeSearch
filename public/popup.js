'use strict';
function addEventListener() {
  let input = document.getElementById("popinput")
  input.addEventListener('keypress', (event) => {
    if(event.keyCode == 13) {
      let txt = input.value.trim()
      if (txt == '') {
        window.open("./index.html")
      } else {
        window.open("./index.html?value="+ txt +"&type=0")
      }
    }
  })

  let search = document.getElementById("popsearch")
  search.addEventListener('click', (event) => {
    let txt = input.value.trim()
    if (txt == '') {
      window.open("./index.html")
    } else {
      window.open("./index.html?value="+ txt +"&type=0")
    }
  })

  let home = document.getElementById("pophome")
  let image = document.getElementById("popimage")
  home.addEventListener('click', (event) => {
    window.open("./index.html")
  })
  image.addEventListener('click', (event) => {
    window.open("./index.html")
  })
}

addEventListener()



