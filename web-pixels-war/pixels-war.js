// pour l'instant on ne peut pas y toucher depuis l'interface
// il faut recharger la page pour changer de carte
const PIXEL_URL = "https://pixels-war.oie-lab.net"

// c'est sans doute habile de commencer avec la carte de test
// const MAP_ID = "0000"
const MAP_ID = "0000"

let matrice = [];



function xy(ca) {
    i = ca.id
    return [parseInt(i.slice(0, 2)), parseInt(i.slice(2))]
}

function grDiv(i, j) {
    return document.getElementById(i + " " + j)
}

function couleurCss(triplet){
    return `rgb(${triplet[0]}, ${triplet[1]}, ${triplet[2]})`
}

document.addEventListener("DOMContentLoaded", async () => {

    const PREFIX = `${PIXEL_URL}/api/v1/${MAP_ID}`

    // pour savoir à quel serveur / carte on s'adresse
    // on les affiche en dur
    // pour l'instant on ne peut pas y toucher depuis l'interface
    // il faut recharger la page pour changer de carte
    document.getElementById("baseurl").value = PIXEL_URL
    document.getElementById("mapid").value = MAP_ID
    document.getElementById("baseurl").readOnly = true
    document.getElementById("mapid").readOnly  = true
    fetch(`${PREFIX}/preinit`, {credentials: "include"})
        .then((response) => response.json())
        .then( async (json) => {
            console.log(json)
            const key = json.key;
            console.log(PREFIX + `/init?key=${key}`)
            const initResponse = await (await fetch(PREFIX + `/init?key=${key}`, {credentials: "include"})).json();
            console.log(initResponse)
            const user_id = initResponse.id;
            // console.log("aaa", user_id);
            const nx = initResponse.nx;
            const ny = initResponse.ny;
            matrice = initResponse.data;
            let selectCol = getPickedColorInRGB();
            console.log(selectCol)
            let gridHTML = document.getElementById("grid");
            console.log(gridHTML)
            console.log(nx, ny)
            for(let y = 0; y<ny; y++){

                d = document.createElement("div")
                d.setAttribute("id", "l" + y)
                d.classList.add("ligne")
                gridHTML.appendChild(d)
                for(let x = 0; x<nx; x++){
                    s = document.createElement("div")
                    s.classList.add("case")
                    s.setAttribute("id", x + " " + y)
                    s.style.backgroundColor = couleurCss(matrice[y][x])
                    d.appendChild(s)
                }
            }

            console.log(user_id)
            document.getElementById("refresh").addEventListener("click", async () => refresh(user_id))

            document.getElementById("colorpicker").addEventListener("change", () => {
                selectCol = getPickedColorInRGB();
            })

                
            

            gridHTML.addEventListener("click", async (event) => {
                
                console.log(event.target)
                coords = xy(event.target)
                x = coords[0]
                y = coords[1]
                console.log(PREFIX + `/set/${user_id}/${y}/${x}/${selectCol[0]}/${selectCol[1]}/${selectCol[2]}`)

                let succes = await(await fetch(PREFIX + `/set/${user_id}/${y}/${x}/${selectCol[0]}/${selectCol[1]}/${selectCol[2]}`, {credentials: "include"})).json()
                if(succes === 0){
                    event.target.style.backgroundColor = couleurCss(selectCol)
                    let temps = 9500;
                    let intervalle = setInterval(() => {
                        
                    document.getElementById("compteur").textContent = temps/1000
                    if (temps <= 0){
                        clearInterval(intervalle)
                    }
                    temps-=500;
                    console.log("oui");}, 500)

                }
            })
            //TODO: maintenant que j'ai l'id, attacher la fonction refresh(id), à compléter, au clic du bouton refresh

            //TODO: attacher au clic de chaque pixel une fonction qui demande au serveur de colorer le pixel sous là forme :
            // http://pixels-war.oie-lab.net/api/v1/0000/set/id/x/y/r/g/b
            // la fonction getPickedColorInRGB ci-dessous peut aider

            //TODO: pourquoi pas rafraichir la grille toutes les 3 sec ?
            // voire même rafraichir la grille après avoir cliqué sur un pixel ?

            // cosmétique / commodité / bonus:

            // TODO: pour être efficace, il serait utile d'afficher quelque part
            // les coordonnées du pixel survolé par la souris

            //TODO: pour les rapides: afficher quelque part combien de temps
            // il faut attendre avant de pouvoir poster à nouveau

            //TODO: pour les avancés: ça pourrait être utile de pouvoir
            // choisir la couleur à partir d'un pixel ?

        })

    //TODO: pour les élèves avancés, comment transformer les "then" ci-dessus en "async / await" ?
    //TODO: pour les élèves avancés, faire en sorte qu'on puisse changer de carte
    //      voir le bouton Connect dans le HTML

    // À compléter puis à attacher au bouton refresh en passant mon id une fois récupéré
    async function refresh(user_id) {
        fetch(`${PREFIX}/deltas?id=${user_id}`, {credentials: "include"})
            .then((response) => response.json())
            .then((json) => {
                let deltas = json.deltas;
                console.log(deltas)
                for(const elt of deltas){
                    grDiv(elt[1], elt[0]).style.backgroundColor = couleurCss(elt.slice(2, 5))
                    // matrice[]
                }
            })
    }

    // Petite fonction facilitatrice pour récupérer la couleur cliquée en RGB
    function getPickedColorInRGB() {
        const colorHexa = document.getElementById("colorpicker").value

        const r = parseInt(colorHexa.substring(1, 3), 16)
        const g = parseInt(colorHexa.substring(3, 5), 16)
        const b = parseInt(colorHexa.substring(5, 7), 16)

        return [r, g, b]
    }

    // dans l'autre sens, pour mettre la couleur d'un pixel dans le color picker
    // (le color picker insiste pour avoir une couleur en hexadécimal...)
    function pickColorFrom(div) {
        // plutôt que de prendre div.style.backgroundColor
        // dont on ne connait pas forcément le format
        // on utilise ceci qui retourne un 'rbg(r, g, b)'
        const bg = window.getComputedStyle(div).backgroundColor
        // on garde les 3 nombres dans un tableau de chaines
        const [r, g, b] = bg.match(/\d+/g)
        // on les convertit en hexadécimal
        const rh = parseInt(r).toString(16).padStart(2, '0')
        const gh = parseInt(g).toString(16).padStart(2, '0')
        const bh = parseInt(b).toString(16).padStart(2, '0')
        const hex = `#${rh}${gh}${bh}`
        // on met la couleur dans le color picker
        document.getElementById("colorpicker").value = hex
    }

})
