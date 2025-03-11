let width = 20
let height = 15
let nbBombes = 30;
let matrice = Array.from({
    length: height
}, () => Array(width).fill(0));
let cases_revelees = 0
let fini = false
let toolBomb = false

function grDiv(i, j) {
    console.log(i + " " + j)
    return document.getElementById(i + " " + j)
}

class Carre {
    constructor(i, j) {
        this.i = i
        this.j = j
        this.bomb = false
        this.nb = 0
        this.revele = false
        this.flag = false
    }
}

function mat(ca) {
    i = ca.id
    return matrice[parseInt(i.slice(0, 2))][parseInt(i.slice(2))]
}

function parcours(ca) {
    // let i0 = ca.i;
    // let j0 = ca.j;
    let listeAparcourir = [ca]
    let caNow = ca
    let i = 0
    let j = 0
    while (listeAparcourir.length > 0) {
        caNow = listeAparcourir.pop();
        if (caNow.revele || caNow.flag) {
            continue
        }
        i = caNow.i;
        j = caNow.j;
        cases_revelees++;
        caNow.revele = true;
        grDiv(i, j).textContent = caNow.nb;
        if (matrice[i][j].nb != 0) {
            continue
        }
        if (i + 1 < height && !(matrice[i + 1][j].revele)) {
            listeAparcourir.push(matrice[i + 1][j])
        }
        if (i > 0 && !(matrice[i - 1][j].revele)) {
            listeAparcourir.push(matrice[i - 1][j])
        }
        if (j + 1 < width && !(matrice[i][j + 1].revele)) {
            listeAparcourir.push(matrice[i][j + 1])
        }
        if (j > 0 && !(matrice[i][j - 1].revele)) {
            listeAparcourir.push(matrice[i][j - 1])
        }


    }

}

function reset() {
    cases_revelees = 0
    document.getElementById("grille").style.backgroundColor = "rgb(214, 198, 173);"
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            grDiv(i, j).style.backgroundColor = ""
            grDiv(i, j).textContent = ""
            matrice[i][j].revele = false;
            matrice[i][j].nb = 0;
            matrice[i][j].bomb = false;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {

    console.log("charge")
    grille = document.getElementById("grille")
    for (let i = 0; i < height; i++) {
        d = document.createElement("div")
        d.setAttribute("id", "l" + i)
        d.classList.add("ligne")
        grille.appendChild(d)
        for (let j = 0; j < width; j++) {
            s = document.createElement("div")
            s.classList.add("case")
            s.setAttribute("id", i + " " + j)
            matrice[i][j] = new Carre(i, j)
            d.appendChild(s)
        }

    }

    document.getElementsByTagName("body")[0].addEventListener("keydown", (e) => {
        if (e.key == " "){
            if(toolBomb){
                toolBomb = false;
                grille.style.cursor = "url(textures/shovelv232.png) 0 32, auto" 
            }
            else {
                toolBomb = true;
                grille.style.cursor = "url(textures/flag32.png) 16 16, auto";
            }
        }
    })

    document.getElementById("imageFlag").addEventListener("click", () => {
        toolBomb = true;
        grille.style.cursor = "url(textures/flag32.png) 16 16, auto";
    })

    document.getElementById("imageShovel").addEventListener("click", () => {
        toolBomb = false;
        grille.style.cursor = "url(textures/shovelv232.png) 0 32, auto"
    })

    document.getElementById("boutonReset").addEventListener("click", reset);

    grille.addEventListener("click", (event) => {
        if (fini) {
            return true
        }
        let caDiv = event.target;
        let ca = mat(caDiv)
        if (!(caDiv.classList.contains("case")) || ca.revele) {
            return true
        }

        if (!toolBomb) {
            if (ca.flag) {
                return true
            }
            // creation des bombes au premier click :
            if (cases_revelees == 0) {
                for (let k = 0; k < nbBombes; k++) {
                    let j = Math.floor(Math.random() * 20)
                    j -= (j == 20)
                    let i = Math.floor(Math.random() * 15)
                    i -= (i == 15)
                    while (matrice[i][j].bomb == true || ([ca.i - 1, ca.i, ca.i + 1].includes(i) && [ca.j - 1, ca.j, ca.j + 1].includes(j))) {
                        j = Math.floor(Math.random() * 20)
                        j -= (j == 20)
                        i = Math.floor(Math.random() * 15)
                        i -= (i == 15)
                    }
                    matrice[i][j].bomb = true
                    for (let r = -1; r < 2; r++) {
                        for (let s = -1; s < 2; s++) {
                            if (i + r < height && i + r >= 0 && j + s >= 0 && j + s < width) {
                                matrice[i + r][j + s].nb += 1
                            }
                        }
                    }

                }
            }

            if (ca.bomb) {
                fini = true
                document.getElementById("message").textContent = "Perdu !"
                caDiv.style.backgroundColor = "red";
            } else {

                if (ca.nb == 0) {
                    console.log("aaaa")
                    parcours(ca)
                } else {
                    caDiv.textContent = ca.nb;
                    ca.revele = true
                    cases_revelees++
                }
            }

        } else {
            if (!ca.flag) {
                caDiv.style.fontWeight = "bold"
                caDiv.style.color = "rgb(75, 190, 100)"
                caDiv.textContent = "X";
                ca.flag = true

            } else {
                caDiv.style.fontWeight = ""

                caDiv.style.color = ""
                caDiv.textContent = ""
                ca.flag = false
            }
        }
        // console.log(caDiv.id)
        if (cases_revelees == width * height - nbBombes) {
            document.getElementById("message").textContent = "Gagné !"
            grille.style.backgroundColor = "rgb(117, 158, 91)"
            fini = true
        }
    })
})