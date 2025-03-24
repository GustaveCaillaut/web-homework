const XKCD = "https://xkcd.now.sh/?comic="
let imgChargees = {};

// j'ai rajouté un "dictionnaire" pour ne pas avoir à fetch l'url à chaque fois pcq l'API m'a l'air très lente.
async function fetchURL(num){
    if (!(num.toString() in imgChargees)){
    let rep = await (fetch(XKCD + num).then( (response) => response.json()))
    imgChargees[rep.num] = rep.img
    return [rep.img, rep.num]
    }
    else{
        return [imgChargees[num], num]
    }
    
}

function setImg(url){
    document.getElementById("imgCentrale").src = url;

}

async function fetchFromJSON(url){
    let rep = await fetch(url)
}

async function affiche(num){
    let image = await fetchURL(num);
    setImg(image[0]);
    document.getElementById("num").textContent = image[1];
    return image
}

document.addEventListener("DOMContentLoaded", async () => {
    let numImg = 0
    let numLatest = 0
    
    repLatest = await affiche("latest");
    numLatest = repLatest[1]
    numImg = numLatest;

    let repTemp = await fetchURL(numLatest-1);


    document.getElementById("random").addEventListener("click", async () => {
        numImg = 1+Math.round(Math.random()*(numLatest-1));
        affiche(numImg);
        

    })

    document.getElementById("reset").addEventListener("click", async () => {
        affiche("latest");
        numImg = numLatest

    })

    document.getElementById("next").addEventListener("click", async () => {
        if(numImg<numLatest){
        numImg++;
        affiche(numImg);
    }

    })

    document.getElementById("previous").addEventListener("click", async () => {
        if (numImg >1){
            numImg-=1;
            affiche(numImg);
        }
        

    })

    document.getElementById("searchButton").addEventListener("click", (event) => {
        let searchString = document.getElementById("searchbox").value
        if (isNaN(searchString)){
            document.getElementById("searchMessage").innerHTML = "Recherchez un numéro VALIDE"
        }
        else if (searchString > numLatest){
            document.getElementById("searchMessage").innerHTML = `Le numéro maximal est ${numLatest}.` + '<br>' + "Veuillez rechercher un numéro valide"
        }
        else {
            document.getElementById("searchMessage").innerHTML = "Rechercher un numéro"
            affiche(searchString)
            
        }
        
    })

    document.getElementById("searchbox").addEventListener("keyup", ({key}) => {
        if (key === "Enter") {
            document.getElementById("searchButton").click()
        }
    })



})


