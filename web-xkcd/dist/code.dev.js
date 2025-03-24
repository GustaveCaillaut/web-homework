"use strict";

var XKCD = "https://xkcd.now.sh/?comic=";
var imgChargees = {}; // j'ai rajouté un "dictionnaire" pour ne pas avoir à fetch l'url à chaque fois pcq l'API m'a l'air très lente.

function fetchURL(num) {
  var rep;
  return regeneratorRuntime.async(function fetchURL$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (num.toString() in imgChargees) {
            _context.next = 8;
            break;
          }

          _context.next = 3;
          return regeneratorRuntime.awrap(fetch(XKCD + num).then(function (response) {
            return response.json();
          }));

        case 3:
          rep = _context.sent;
          imgChargees[rep.num] = rep.img;
          return _context.abrupt("return", [rep.img, rep.num]);

        case 8:
          return _context.abrupt("return", [imgChargees[num], num]);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}

function setImg(url) {
  document.getElementById("imgCentrale").src = url;
}

function fetchFromJSON(url) {
  var rep;
  return regeneratorRuntime.async(function fetchFromJSON$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(fetch(url));

        case 2:
          rep = _context2.sent;

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function affiche(num) {
  var image;
  return regeneratorRuntime.async(function affiche$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(fetchURL(num));

        case 2:
          image = _context3.sent;
          setImg(image[0]);
          document.getElementById("num").textContent = image[1];
          return _context3.abrupt("return", image);

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function _callee5() {
  var numImg, numLatest, repTemp;
  return regeneratorRuntime.async(function _callee5$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          numImg = 0;
          numLatest = 0;
          _context8.next = 4;
          return regeneratorRuntime.awrap(affiche("latest"));

        case 4:
          repLatest = _context8.sent;
          numLatest = repLatest[1];
          numImg = numLatest;
          _context8.next = 9;
          return regeneratorRuntime.awrap(fetchURL(numLatest - 1));

        case 9:
          repTemp = _context8.sent;
          document.getElementById("random").addEventListener("click", function _callee() {
            return regeneratorRuntime.async(function _callee$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    numImg = 1 + Math.round(Math.random() * (numLatest - 1));
                    affiche(numImg);

                  case 2:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          });
          document.getElementById("reset").addEventListener("click", function _callee2() {
            return regeneratorRuntime.async(function _callee2$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    affiche("latest");
                    numImg = numLatest;

                  case 2:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          });
          document.getElementById("next").addEventListener("click", function _callee3() {
            return regeneratorRuntime.async(function _callee3$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    if (numImg < numLatest) {
                      numImg++;
                      affiche(numImg);
                    }

                  case 1:
                  case "end":
                    return _context6.stop();
                }
              }
            });
          });
          document.getElementById("previous").addEventListener("click", function _callee4() {
            return regeneratorRuntime.async(function _callee4$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    if (numImg > 1) {
                      numImg -= 1;
                      affiche(numImg);
                    }

                  case 1:
                  case "end":
                    return _context7.stop();
                }
              }
            });
          });
          document.getElementById("searchButton").addEventListener("click", function (event) {
            var searchString = document.getElementById("searchbox").value;

            if (isNaN(searchString)) {
              document.getElementById("searchMessage").innerHTML = "Recherchez un numéro VALIDE";
            } else if (searchString > numLatest) {
              document.getElementById("searchMessage").innerHTML = "Le num\xE9ro maximal est ".concat(numLatest, ".") + '<br>' + "Veuillez rechercher un numéro valide";
            } else {
              document.getElementById("searchMessage").innerHTML = "Rechercher un numéro";
              affiche(searchString);
            }
          });
          document.getElementById("searchbox").addEventListener("keyup", function (_ref) {
            var key = _ref.key;

            if (key === "Enter") {
              document.getElementById("searchButton").click();
            }
          });

        case 16:
        case "end":
          return _context8.stop();
      }
    }
  });
});