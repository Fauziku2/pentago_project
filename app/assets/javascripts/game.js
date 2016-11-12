$(document).on('turbolinks:load', function () {
  var gameBoard = [
    ['0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0']
  ]

  var gameRound = {
    'currentPlayer': 'X',
    'X': {
      'fiveInARow': false
    },
    'O': {
      'fiveInARow': false
    },
    'outcome': 'N'
  }

  var $gameBoardContainer = $('.game-board-container')

  App.gameroom = App.cable.subscriptions.create({
    channel: 'GameroomChannel',
    game_room_id: $gameBoardContainer.data('game-room-id')
  }, {
    received: function (data) {
      // Updating game data using updated data
      // Gameboard
      strToGameBoardArray(data.gameboard)
      populateGameBoard()
        // Currentplayer
      gameRound.currentPlayer = data.currentplayer
      gameRound.outcome = data.outcome

        // Updating form
      $('#match_gameboard').val(data.gameboard)
      $('#match_currentplayer').val(data.currentplayer)
      $('#match_outcome').val(data.outcome)
    }
  })

  strToGameBoardArray($('#match_gameboard').val())

  populateGameBoard()

  $('.resetboard').on('click', function () {
    strToGameBoardArray($('#match_gameboard').val('000000000000000000000000000000000000'))
    $('#match_gameboard').val('000000000000000000000000000000000000')
    $('#match_currentplayer').val('X')
    addGameSquareListener()
  })

  var $allGameSquare = $('.game-square')

  function addGameSquareListener () {
    $allGameSquare.off()
    for (var i = 0; i < $allGameSquare.length; i++) {
      var $gameSquare = $('.game-square').eq(i)
      if (!$gameSquare.hasClass('X') && !$gameSquare.hasClass('O')) {
        $gameSquare.on('click', placeToken)
      }
    }
  }

  addGameSquareListener()

  function addRotateButtonListener () {
    // Assigns rotate tile function to each button using closure
    for (var i = 0; i < 4; i++) {
      var $rotateRightBtn = $('#rotate-right-' + i)
      var $rotateLeftBtn = $('#rotate-left-' + i)

      var rotateBoardRight = rotateButtonFunction('board' + i, 'right')
      var rotateBoardLeft = rotateButtonFunction('board' + i, 'left')

      $rotateRightBtn.on('click', rotateBoardRight)
      $rotateLeftBtn.on('click', rotateBoardLeft)
    }
  }

  addRotateButtonListener()

  function placeToken () {
    // If cell is populated
    if (!$(this).hasClass('X') && !$(this).hasClass('O')) {
      // Gets rows and col index from HTML divs
      var xCoord = Number($(this).data('row'))
      var yCoord = Number($(this).data('col'))

      // Assigns player value to gameBoard array and HTML
      gameBoard[xCoord][yCoord] = gameRound.currentPlayer
      $(this).addClass(gameRound.currentPlayer)

      checkWinCondition(xCoord, yCoord)
      updateFormInputAndSubmit()
    }

  }

  function rotateButtonFunction (boardIndex, rotateDirection) {
    var x = 0
    var y = 0
    var gameTileID

    switch (boardIndex) {
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

    var $gameSquareTile = $(gameTileID + ' .game-square')

    function rotateBoard () {
      var newValsAfterRotate = {}

      if (rotateDirection === 'right') {
        newValsAfterRotate = {
          '0': gameBoard[x + 2][y],
          '1': gameBoard[x + 1][y],
          '2': gameBoard[x][y],
          '3': gameBoard[x + 2][y + 1],
          '4': gameBoard[x + 1][y + 1],
          '5': gameBoard[x][y + 1],
          '6': gameBoard[x + 2][y + 2],
          '7': gameBoard[x + 1][y + 2],
          '8': gameBoard[x][y + 2]
        }
      } else if (rotateDirection === 'left') {
        newValsAfterRotate = {
          '0': gameBoard[x][y + 2],
          '1': gameBoard[x + 1][y + 2],
          '2': gameBoard[x + 2][y + 2],
          '3': gameBoard[x][y + 1],
          '4': gameBoard[x + 1][y + 1],
          '5': gameBoard[x + 2][y + 1],
          '6': gameBoard[x][y],
          '7': gameBoard[x + 1][y],
          '8': gameBoard[x + 2][y]
        }
      }

      $gameSquareTile.removeClass('X')
      $gameSquareTile.removeClass('O')

      var counter = 0
      // For each item on a game-tile, get new rotated value and assign new classes accordingly
      for (var i = x; i < x + 3; i++) {
        for (var j = y; j < y + 3; j++) {
          // Assigning the values to new positions on gameBoard
          gameBoard[i][j] = newValsAfterRotate[counter]

          // Changing class to reflect gameBoard changes
          if (gameBoard[i][j] === 'X') {
            $gameSquareTile.eq(counter).addClass('X')
          } else if (gameBoard[i][j] === 'O') {
            $gameSquareTile.eq(counter).addClass('O')
          }
          // counter to loop through the gameSquareTile array
          counter += 1
          checkWinCondition(i, j)
        }
      }
      togglePlayer()
      updateFormInputAndSubmit()
      addGameSquareListener()
    }
    return rotateBoard
  }

  function togglePlayer () {
    if (gameRound.currentPlayer === 'X') {
      gameRound.currentPlayer = 'O'
    } else {
      gameRound.currentPlayer = 'X'
    }
  }

  function countMatchesOneDirection (xCoord, yCoord, direction) {
    var xAdjust = 0
    var yAdjust = 0

    switch (direction) {
      case 'vertical':
        xAdjust = 1
        yAdjust = 0
        break
      case 'horizontal':
        xAdjust = 0
        yAdjust = 1
        break
      case 'upDiagonal':
        xAdjust = -1
        yAdjust = 1
        break
      case 'downDiagonal':
        xAdjust = -1
        yAdjust = -1
        break
      default:
        xAdjust = 0
        yAdjust = 0
    }

    var totalMatches = 0

    function countMatchesHalfDirection (xCoord, yCoord, xAdjust, yAdjust, direction) {
      if (direction === 'backward') {
        xAdjust *= -1
        yAdjust *= -1
      }

      var playerMove = gameBoard[xCoord][yCoord]
      var nextX = xCoord + xAdjust
      var nextY = yCoord + yAdjust

      if (nextX >= 0 && nextX <= 5 && nextY >= 0 && nextY <= 5) {
        if (playerMove === gameBoard[nextX][nextY] && (playerMove === 'X' || playerMove === 'O')) {
          totalMatches += 1
          countMatchesHalfDirection(nextX, nextY, xAdjust, yAdjust)
        } else {
          return
        }
      }
    }

    countMatchesHalfDirection(xCoord, yCoord, xAdjust, yAdjust, 'forward')
    countMatchesHalfDirection(xCoord, yCoord, xAdjust, yAdjust, 'backward')

    if (totalMatches >= 4) {
      gameRound[gameRound.currentPlayer].fiveInARow = true
    }
  }

  function checkWinCondition (thisRow, thisCol) {
    countMatchesOneDirection(thisRow, thisCol, 'vertical')
    countMatchesOneDirection(thisRow, thisCol, 'horizontal')
    countMatchesOneDirection(thisRow, thisCol, 'upDiagonal')
    countMatchesOneDirection(thisRow, thisCol, 'downDiagonal')

    var filledGameSquares = 0
    for (var i = 0; i < $allGameSquare.length; i++) {
      if ($('.game-square').eq(i).hasClass('X') || $('.game-square').eq(i).hasClass('O')) {
        filledGameSquares += 1
      }
    }

    if (gameRound.X.fiveInARow && gameRound.O.fiveInARow) {
      gameRound.outcome = 'T'
    } else if (gameRound.X.fiveInARow) {
      gameRound.outcome = 'X'
    } else if (gameRound.O.fiveInARow) {
      gameRound.outcome = 'O'
    } else if (filledGameSquares === 36) {
      gameRound.outcome = 'T'
    }
  }

  function updateFormInputAndSubmit () {
    var str = ''
    for (var i = 0; i < 6; i++) {
      str += gameBoard[i].join('')
    }

    $('#match_gameboard').val(str)
    $('#match_currentplayer').val(gameRound.currentPlayer)
    $('#match_outcome').val(gameRound.outcome)
    $('.game-board-form').submit()
  }

  function populateGameTile (gametile) {
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

  function populateGameBoard () {
    populateGameTile('board0')
    populateGameTile('board1')
    populateGameTile('board2')
    populateGameTile('board3')
  }

  function strToGameBoardArray (str) {
    var counter = 0
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 6; j++) {
        gameBoard[i][j] = str[counter]
        counter += 1
      }
    }
  }
})
