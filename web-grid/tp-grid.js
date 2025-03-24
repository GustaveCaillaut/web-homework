document.addEventListener("DOMContentLoaded", () => {
  // Initial clean up. DO NOT REMOVE.
  initialCleanup();
  document.getElementById("btn-add-line").addEventListener("click", () => 
  {
    for (let i=0; i<10; i++) {
      let nouveauDIv = document.getElementById("grid").appendChild(document.createElement("div"))
      nouveauDIv.addEventListener("click", function() 
      {
        this.classList.remove ("boutonHover")
        this.style.backgroundColor = `rgb( ${255*Math.random()},  ${255*Math.random()}, ${255*Math.random()})`
      })
      nouveauDIv.addEventListener("mouseover", function() {
        this.classList.add("boutonHover")
        // this.style.backgroundColor = ""
  
      })
  }
    
  })

  document.getElementById("btn-rm-line").addEventListener("click", () => 
    {
      let grille = document.getElementById("grid")
      let l = grille.childNodes.length
      for(let i = 0; i<10; i++) {
        grille.removeChild(grille.childNodes[l-i-1])
      }
    })

  Array.from(document.getElementById("grid").getElementsByTagName('div')).forEach(function(carre) {
    carre.addEventListener("click", function() 
  {
    this.classList.remove ("boutonHover")
    this.style.backgroundColor = `rgb( ${255*Math.random()},  ${255*Math.random()}, ${255*Math.random()})`
  }) 

    carre.addEventListener("mouseover", function() {
      this.classList.add("boutonHover")
      // this.style.backgroundColor = ""

    })

}) 
});

/**
 * Cleans up the document so that the exercise is easier.
 *
 * There are some text and comment nodes that are in the initial DOM, it's nice
 * to clean them up beforehand.
 */
function initialCleanup() {
  const nodesToRemove = [];
  document.getElementById("grid").childNodes.forEach((node, key) => {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      nodesToRemove.push(node);
    }
  });
  for (const node of nodesToRemove) {
    node.remove();
  }
}

