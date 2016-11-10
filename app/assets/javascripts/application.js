// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
// = require jquery
// = require jquery_ujs
// = require turbolinks
// = require_tree .

App.gameroom = App.cable.subscriptions.create('GameroomChannel', {
  received: function (data) {
    populateGameBoard(data.gameboard)
    fillUpTiles('board0')
    fillUpTiles('board1')
    fillUpTiles('board2')
    fillUpTiles('board3')
    $('.gameboardfield:nth-child(2)').text(data.gameboard)
    $('.gameboardfield:nth-child(3)').text(data.gamestatus)
    $('.gameboardfield:nth-child(4)').text(data.currentplayer)
  }
})

$(document).ready(function () {
  $('update-game-board').submit(function () {
    var valuesToSubmit = $(this).serializeArray()
    $.ajax({
      type: 'PUT',
      url: $(this).attr('action'),
      data: valuesToSubmit
    }).done(function () {

    })
    return false
  })
})

var gameBoard = [
                  ['', '', '', '', '', ''],
                  ['', '', '', '', '', ''],
                  ['', '', '', '', '', ''],
                  ['', '', '', '', '', ''],
                  ['', '', '', '', '', ''],
                  ['', '', '', '', '', '']
]

function fillUpTiles (gametile) {
  var x = 0
  var y = 0
  var gameTileID

  switch (gametile) {
    case 'board0':
      x = 0
      y = 0
      gameTileID = '#game-tile-0'
      break
    case 'board1':
      x = 0
      y = 3
      gameTileID = '#game-tile-1'
      break
    case 'board2':
      x = 3
      y = 0
      gameTileID = '#game-tile-2'
      break
    case 'board3':
      x = 3
      y = 3
      gameTileID = '#game-tile-3'
      break
    default:
  }

  var $gameSquare = $(gameTileID + ' .game-square')
  $gameSquare.removeClass('X')
  $gameSquare.removeClass('O')

  counter = 0
  for (var i = x; i < x + 3; i++) {
    for (var j = y; j < y + 3; j++) {
      if (gameBoard[i][j] === 'X') {
        $gameSquare.eq(counter).addClass('X')
      } else if (gameBoard[i][j] === 'O') {
        $gameSquare.eq(counter).addClass('O')
      }
      counter += 1
    }
  }
}

function populateGameBoard (str) {
  var counter = 0
  for (var i = 0; i < 6; i++) {
    for (var j = 0; j < 6; j++) {
      gameBoard[i][j] = str[counter]
      counter += 1
    }
  }
}

function stringifyGameBoard () {
  var str = ''
  for (var i = 0; i < 6; i++) {
    str += gameBoard[i].join('')
  }
}
