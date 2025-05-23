"use strict";

var grille = Array.from({
  length: 3
}, function () {
  return Array(3).fill(0);
});
var joueur = 1;
var victoire = false;

function testVictoire() {
  var valeurx = 0;
  var valeury = 0;

  for (var i = 0; i < 3; i++) {
    valeurx = grille[i][0];

    if (valeurx != 0 && grille[i][1] == valeurx && grille[i][2] == valeurx) {
      return valeurx;
    }

    valeury = grille[0][i];

    if (valeury != 0 && grille[1][i] == valeury && grille[2][i] == valeury) {
      return valeury;
    }
  }

  if (grille[1][1] != 0 && grille[0][0] == grille[1][1] && grille[1][1] == grille[2][2]) {
    return grille[1][1];
  }

  if (grille[1][1] != 0 && grille[2][0] == grille[1][1] && grille[1][1] == grille[0][2]) {
    return grille[1][1];
  }

  return 0;
}

function drawGrid() {
  var ctx = document.getElementById("grilleCanvas").getContext("2d");
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(140, 0);
  ctx.lineTo(140, 420);
  ctx.moveTo(280, 0);
  ctx.lineTo(280, 420);
  ctx.moveTo(0, 140);
  ctx.lineTo(420, 140);
  ctx.moveTo(0, 280);
  ctx.lineTo(420, 280);
  ctx.stroke();
}

function reset() {
  grille = Array.from({
    length: 3
  }, function () {
    return Array(3).fill(0);
  });
  joueur = 1;
  victoire = false;
  var canvas = document.getElementById("grilleCanvas");
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 420, 420);
  drawGrid();
  ctx.fillStyle = "rgb(".concat(180 * (joueur - 1) + 50, ", ").concat(180 * (joueur % 2) + 50, ", 50)");
}

document.addEventListener("DOMContentLoaded", function () {
  reset();
  var canvas = document.getElementById("grilleCanvas");
  var ctx = canvas.getContext("2d");
  document.getElementById("grilleCanvas").addEventListener("click", function (event) {
    console.log("cliqué");

    if (victoire) {
      return true;
    }

    var rect = canvas.getBoundingClientRect();
    var x = Math.floor((event.clientX - rect.left) / 140);
    var y = Math.floor((event.clientY - rect.top) / 140);

    if (grille[x][y] != 0) {
      console.log("aaa");
      var message = document.getElementById("message");
      message.textContent = "Case Non Valide !";
      message.style.marginTop = "0px";
      message.style.fontSize = "60px";
      setTimeout(function () {
        message.style.margin = "";
        message.style.fontSize = "20px", message.textContent = "Joueur ".concat(joueur, ", choisis une case valide");
      }, 300);
    } else {
      console.log("bbb");

      var _message = document.getElementById("message");

      grille[x][y] = joueur;
      ctx.fillRect(x * 140, y * 140, 140, 140);
      drawGrid();
      var resultat = testVictoire();

      if (resultat == 0) {
        joueur = 1 + joueur % 2;
        _message.textContent = "Au tour du joueur ".concat(joueur, ".");
        ctx.fillStyle = "rgb(".concat(180 * (joueur - 1) + 50, ", ").concat(180 * (joueur % 2) + 50, ", 50)");
      } else {
        _message.textContent = "Victoire du joueur ".concat(joueur, ".");
        victoire = true;
      }
    }
  });
  document.getElementById("boutonReset").addEventListener("click", reset);
});