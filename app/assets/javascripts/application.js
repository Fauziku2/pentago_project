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
    newEntry = '<li>' + data.gameboard + '</li>'
    $('.listlist').append(newEntry)
  }
})

$(document).ready(function () {
  $('form').submit(function () {
    var valuesToSubmit = $(this).serializeArray()
    $.ajax({
      type: 'PUT',
      url: $(this).attr('action'),
      data: valuesToSubmit
    }).done(function (msg) {
      $('li:nth-child(2)').text(valuesToSubmit[2].value)
      $('li:nth-child(3)').text(valuesToSubmit[3].value)
      $('li:nth-child(4)').text(valuesToSubmit[4].value)
    })
    return false
  })
})

var gameBoard = [
                ['X', 'X', 'O', 'X', '0', '0'],
                ['0', 'O', 'X', 'O', 'X', 'O'],
                ['O', '0', 'X', '0', 'X', 'O'],
                ['X', '0', 'O', 'X', '0', 'O'],
                ['X', '0', 'O', '0', 'X', 'O'],
                ['X', '0', 'O', '0', 'X', 'X']
]

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
