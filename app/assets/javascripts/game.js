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
    'gamestr': '',
    'currentplayer': '',
    'playerid': 0,
    'moveindex': '',
    'X': {
      'id': 0,
      'fiveInARow': false
    },
    'O': {
      'id': 0,
      'fiveInARow': false
    },
    'outcome': '',
    'winner': ''
  }

  var $gameBoardContainer = $('.game-board-container')
  var $allGameSquare = $('.game-square')
  var $allRotateButtons = $('.rotate-btn')

  // Checking if you're on the gameboard page. Wraps entire JS
  if ($gameBoardContainer.length !== 0) {
    $.ajax({
      url: window.location.pathname,
      async: false,
      dataType: 'json',
      success: function (obj) {
        gameRound.gamestr = obj.match.gameboard
        gameRound.moveindex = obj.match.moveindex
        gameRound.currentplayer = obj.match.currentplayer
        gameRound.playerid = obj.user
        gameRound.X.id = obj.match.playerx_id
        gameRound.O.id = obj.match.playero_id
        gameRound.outcome = obj.match.outcome
        gameRound.winner = obj.match.winner

        strToGameBoardArray(gameRound.gamestr)
        populateGameBoard()
        getOutcomeMessage()
        if (gameRound.moveindex === 'A') {
          addGameSquareListener()
        } else if (gameRound.moveindex === 'B') {
          addRotateButtonListener()
        }
      }
    })

    App.gameroom = App.cable.subscriptions.create({
      channel: 'GameroomChannel',
      game_room_id: $gameBoardContainer.data('game-room-id')
    }, {
      received: function (data) {
        // Gameround values from backend
        gameRound.currentplayer = data.currentplayer
        gameRound.moveindex = data.moveindex
        gameRound.outcome = data.outcome
        gameRound.X.id = data.playerx
        gameRound.O.id = data.playero
        gameRound.winner = data.winner

        strToGameBoardArray(data.gameboard)
        populateGameBoard()
        getOutcomeMessage()
        if (gameRound.moveindex === 'A') {
          addGameSquareListener()
        } else if (gameRound.moveindex === 'B') {
          addRotateButtonListener()
        }

        // Data for validation
        $('.gameround-p').text(data.gameround)
        $('.moveindex-p').text(data.moveindex)
        $('.currentplayer-p').text(data.currentplayer)
        $('.player-me-p').text(data.playerid)
        $('.player-x-p').text(data.playerx)
        $('.player-o-p').text(data.playero)
        $('.outcome-p').text(data.outcome)
        $('.winner-p').text(data.winner)

        // Updating form
        $('#match_gameboard').val(data.gameboard)
        $('#match_moveindex').val(data.moveindex)
        $('#match_currentplayer').val(data.currentplayer)
        $('#match_playerx_id').val(data.playerx)
        $('#match_playero_id').val(data.playero)
        $('#match_outcome').val(data.outcome)
        $('#match_winner').val(data.winner)
      }
    })
  }

  function updateFormInputAndSubmit () {
    var str = ''
    for (var i = 0; i < 6; i++) {
      str += gameBoard[i].join('')
    }

    $('#match_gameboard').val(str)
    $('#match_currentplayer').val(gameRound.currentplayer)
    $('#match_moveindex').val(gameRound.moveindex)
    $('#match_outcome').val(gameRound.outcome)
    $('#match_winner').val(gameRound.winner)
    $('.game-board-form').submit()
  }

  function addGameSquareListener () {
    $allGameSquare.off()
    for (var i = 0; i < $allGameSquare.length; i++) {
      var $gameSquare = $('.game-square').eq(i)
      if (!$gameSquare.hasClass('X') && !$gameSquare.hasClass('O')) {
        $gameSquare.on('click', placeToken)
      }
    }
  }

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

  function placeToken () {
    if (gameRound.playerid === gameRound[gameRound.currentplayer].id && gameRound.outcome === 'N') {
      // If cell is populated
      if (!$(this).hasClass('X') && !$(this).hasClass('O')) {
        // Gets rows and col index from HTML divs
        var xCoord = Number($(this).data('row'))
        var yCoord = Number($(this).data('col'))

        // Assigns player value to gameBoard array and HTML
        gameBoard[xCoord][yCoord] = gameRound.currentplayer
        $(this).addClass(gameRound.currentplayer)

        $allGameSquare.off()
        addRotateButtonListener()

        toggleMoveIndex()
        checkWinCondition(xCoord, yCoord)
        updateFormInputAndSubmit()
      }
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
      if (gameRound.playerid === gameRound[gameRound.currentplayer].id && gameRound.outcome === 'N') {
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
        $allRotateButtons.off()
        addGameSquareListener()

        togglePlayer()
        toggleMoveIndex()
        updateFormInputAndSubmit()
      }
    }
    return rotateBoard
  }

  function togglePlayer () {
    if (gameRound.currentplayer === 'X') {
      gameRound.currentplayer = 'O'
    } else {
      gameRound.currentplayer = 'X'
    }
  }

  function toggleMoveIndex () {
    if (gameRound.moveindex === 'A') {
      gameRound.moveindex = 'B'
    } else {
      gameRound.moveindex = 'A'
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
    var playerMove = gameBoard[xCoord][yCoord]

    function countMatchesHalfDirection (xCoord, yCoord, xAdjust, yAdjust, direction) {
      if (direction === 'backward') {
        xAdjust *= -1
        yAdjust *= -1
      }

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

    if (totalMatches >= 4 && playerMove === 'X') {
      gameRound.X.fiveInARow = true
    }
    if (totalMatches >= 4 && playerMove === 'O') {
      gameRound.O.fiveInARow = true
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
      gameRound.winner = 'Tie'
    } else if (gameRound.X.fiveInARow) {
      gameRound.outcome = 'X'
      gameRound.winner = gameRound.X.id
    } else if (gameRound.O.fiveInARow) {
      gameRound.outcome = 'O'
      gameRound.winner = gameRound.O.id
    } else if (filledGameSquares === 36) {
      gameRound.outcome = 'T'
      gameRound.winner = 'Tie'
    }
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

    var counter = 0
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

  function getOutcomeMessage () {
    var outcomeMessage = ''
    switch (gameRound.outcome) {
      case 'T':
        outcomeMessage = "It's a tie!"
        break
      case 'X':
        outcomeMessage = 'White wins!'
        break
      case 'O':
        outcomeMessage = 'Black wins!!'
        break
      case 'N':
        if (gameRound.currentplayer === 'X') {
          outcomeMessage = "White's turn"
        } else if (gameRound.currentplayer === 'O') {
          outcomeMessage = "Black's turn"
        }
        break
    }
    $('.outcome-message').text(outcomeMessage)
  }
})
