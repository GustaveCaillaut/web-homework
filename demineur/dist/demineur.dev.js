"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var width = 20;
var height = 15;
var nbBombes = 30;
var matrice = Array.from({
  length: height
}, function () {
  return Array(width).fill(0);
});
var cases_revelees = 0;
var fini = false;
var toolBomb = false;

function grDiv(i, j) {
  console.log(i + " " + j);
  return document.getElementById(i + " " + j);
}

var Carre = function Carre(i, j) {
  _classCallCheck(this, Carre);

  this.i = i;
  this.j = j;
  this.bomb = false;
  this.nb = 0;
  this.revele = false;
  this.flag = false;
};

function mat(ca) {
  i = ca.id;
  return matrice[parseInt(i.slice(0, 2))][parseInt(i.slice(2))];
}

function parcours(ca) {
  // let i0 = ca.i;
  // let j0 = ca.j;
  var listeAparcourir = [ca];
  var caNow = ca;
  var i = 0;
  var j = 0;

  while (listeAparcourir.length > 0) {
    caNow = listeAparcourir.pop();

    if (caNow.revele || caNow.flag) {
      continue;
    }

    i = caNow.i;
    j = caNow.j;
    cases_revelees++;
    caNow.revele = true;
    grDiv(i, j).textContent = caNow.nb;

    if (matrice[i][j].nb != 0) {
      continue;
    }

    if (i + 1 < height && !matrice[i + 1][j].revele) {
      listeAparcourir.push(matrice[i + 1][j]);
    }

    if (i > 0 && !matrice[i - 1][j].revele) {
      listeAparcourir.push(matrice[i - 1][j]);
    }

    if (j + 1 < width && !matrice[i][j + 1].revele) {
      listeAparcourir.push(matrice[i][j + 1]);
    }

    if (j > 0 && !matrice[i][j - 1].revele) {
      listeAparcourir.push(matrice[i][j - 1]);
    }
  }
}

function reset() {
  cases_revelees = 0;
  document.getElementById("grille").style.backgroundColor = "rgb(214, 198, 173);";

  for (var _i = 0; _i < height; _i++) {
    for (var j = 0; j < width; j++) {
      grDiv(_i, j).style.backgroundColor = "";
      grDiv(_i, j).textContent = "";
      matrice[_i][j].revele = false;
      matrice[_i][j].nb = 0;
      matrice[_i][j].bomb = false;
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("charge");
  grille = document.getElementById("grille");

  for (var _i2 = 0; _i2 < height; _i2++) {
    d = document.createElement("div");
    d.setAttribute("id", "l" + _i2);
    d.classList.add("ligne");
    grille.appendChild(d);

    for (var j = 0; j < width; j++) {
      s = document.createElement("div");
      s.classList.add("case");
      s.setAttribute("id", _i2 + " " + j);
      matrice[_i2][j] = new Carre(_i2, j);
      d.appendChild(s);
    }
  }

  document.getElementsByTagName("body")[0].addEventListener("keydown", function (e) {
    if (e.key == " ") {
      if (toolBomb) {
        toolBomb = false;
        grille.style.cursor = "url(textures/shovelv232.png) 0 32, auto";
      } else {
        toolBomb = true;
        grille.style.cursor = "url(textures/flag32.png) 16 16, auto";
      }
    }
  });
  document.getElementById("imageFlag").addEventListener("click", function () {
    toolBomb = true;
    grille.style.cursor = "url(textures/flag32.png) 16 16, auto";
  });
  document.getElementById("imageShovel").addEventListener("click", function () {
    toolBomb = false;
    grille.style.cursor = "url(textures/shovelv232.png) 0 32, auto";
  });
  document.getElementById("boutonReset").addEventListener("click", reset);
  grille.addEventListener("click", function (event) {
    if (fini) {
      return true;
    }

    var caDiv = event.target;
    var ca = mat(caDiv);

    if (!caDiv.classList.contains("case") || ca.revele) {
      return true;
    }

    if (!toolBomb) {
      if (ca.flag) {
        return true;
      } // creation des bombes au premier click :


      if (cases_revelees == 0) {
        for (var k = 0; k < nbBombes; k++) {
          var _j = Math.floor(Math.random() * 20);

          _j -= _j == 20;

          var _i3 = Math.floor(Math.random() * 15);

          _i3 -= _i3 == 15;

          while (matrice[_i3][_j].bomb == true || [ca.i - 1, ca.i, ca.i + 1].includes(_i3) && [ca.j - 1, ca.j, ca.j + 1].includes(_j)) {
            _j = Math.floor(Math.random() * 20);
            _j -= _j == 20;
            _i3 = Math.floor(Math.random() * 15);
            _i3 -= _i3 == 15;
          }

          matrice[_i3][_j].bomb = true;

          for (var r = -1; r < 2; r++) {
            for (var _s = -1; _s < 2; _s++) {
              if (_i3 + r < height && _i3 + r >= 0 && _j + _s >= 0 && _j + _s < width) {
                matrice[_i3 + r][_j + _s].nb += 1;
              }
            }
          }
        }
      }

      if (ca.bomb) {
        fini = true;
        document.getElementById("message").textContent = "Perdu !";
        caDiv.style.backgroundColor = "red";
      } else {
        if (ca.nb == 0) {
          console.log("aaaa");
          parcours(ca);
        } else {
          caDiv.textContent = ca.nb;
          ca.revele = true;
          cases_revelees++;
        }
      }
    } else {
      if (!ca.flag) {
        caDiv.style.fontWeight = "bold";
        caDiv.style.color = "rgb(75, 190, 100)";
        caDiv.textContent = "X";
        ca.flag = true;
      } else {
        caDiv.style.fontWeight = "";
        caDiv.style.color = "";
        caDiv.textContent = "";
        ca.flag = false;
      }
    } // console.log(caDiv.id)


    if (cases_revelees == width * height - nbBombes) {
      document.getElementById("message").textContent = "Gagné !";
      grille.style.backgroundColor = "rgb(117, 158, 91)";
      fini = true;
    }
  });
});