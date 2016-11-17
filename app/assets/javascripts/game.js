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
    'id': 0,
    'gamestr': '',
    'currentplayer': '',
    'playerid': 0,
    'moveindex': '',
    'X': {
      'id': 0,
      'fiveInARow': false,
      'timebank': 0
    },
    'O': {
      'id': 0,
      'fiveInARow': false,
      'timebank': 0
    },
    'outcome': '',
    'winner': ''
  }

  var $gameBoardContainer = $('.game-board-container')
  var $allGameSquare = $('.game-square')
  var $allRotateButtons = $('.rotate-btn')
  var audioNotification = new Audio('/assets/pop.mp3')

  $('.rotate-btn').hide()

  // Checking if you're on the gameboard page. Wraps entire JS
  if ($gameBoardContainer.data('game-room-id')) {
    $.ajax({
      url: window.location.pathname,
      dataType: 'json',
      success: function (obj) {
        gameRound.id = obj.match.id
        gameRound.gamestr = obj.match.gameboard
        gameRound.moveindex = obj.match.moveindex
        gameRound.currentplayer = obj.match.currentplayer
        gameRound.X.id = obj.match.playerx_id
        gameRound.O.id = obj.match.playero_id
        gameRound.outcome = obj.match.outcome
        gameRound.winner = obj.match.winner
        gameRound.playerid = obj.user
        gameRound.X.timebank = obj.match.xtimebank
        gameRound.O.timebank = obj.match.otimebank

        $('.timebank-X-' + gameRound.id).text(gameRound.X.timebank)
        $('.timebank-O-' + gameRound.id).text(gameRound.O.timebank)

        strToGameBoardArray(gameRound.gamestr)
        populateGameBoard()
        getOutcomeMessage()

        //  If have opponent, is current player and move part A
        if (gameRound.O.id && gameRound.moveindex === 'A' && gameRound.playerid === gameRound[gameRound.currentplayer].id) {
          addGameSquareListener()
        } else if (gameRound.moveindex === 'B' && gameRound.playerid === gameRound[gameRound.currentplayer].id) {
          addRotateButtonListener()
        }

        // Continues to run countdown timer on refresh
        if (gameRound.O.id && gameRound.outcome === 'N') {
          countdownTimer()
        }
      }
    })

    App.gameroom = App.cable.subscriptions.create({
      channel: 'GameroomChannel',
      game_room_id: $gameBoardContainer.data('game-room-id')
    }, {
      received: function (data) {
        // Gameround values from backend
        if (gameRound.currentplayer !== data.currentplayer) {
          audioNotification.play()
        }

        gameRound.id = data.id
        gameRound.gamestr = data.gameboard
        gameRound.moveindex = data.moveindex
        gameRound.currentplayer = data.currentplayer
        gameRound.X.id = data.playerx
        gameRound.O.id = data.playero
        gameRound.outcome = data.outcome
        gameRound.winner = data.winner

        gameRound.X.timebank = data.xtimebank
        gameRound.O.timebank = data.otimebank

        // When game player O joins and gameboard is empty. Added side effect of reminding first player to make a move. One time event
        if (gameRound.O.id && gameRound.X.id === gameRound.playerid && gameRound.gamestr === '000000000000000000000000000000000000') {
          audioNotification.play()
        }

        // Displays player O name on first join
        $('.player-o-name').text(data.playeroname)

        strToGameBoardArray(data.gameboard)
        populateGameBoard()
        getOutcomeMessage()

        if (gameRound.outcome !== 'N') {
          clearInterval(timer)
        }

        if (gameRound.moveindex === 'A' && gameRound.playerid === gameRound[gameRound.currentplayer].id) {
          clearInterval(timer)
          countdownTimer()
          addGameSquareListener()
        } else if (gameRound.moveindex === 'B' && gameRound.playerid === gameRound[gameRound.currentplayer].id) {
          addRotateButtonListener()
        }

        // Updating form
        $('#match_gameboard').val(data.gameboard)
        $('#match_moveindex').val(data.moveindex)
        $('#match_currentplayer').val(data.currentplayer)
        $('#match_playerx_id').val(data.playerx)
        $('#match_playero_id').val(data.playero)
        $('#match_outcome').val(data.outcome)
        $('#match_winner').val(data.winner)
        $('#match_xtimebank').val(gameRound.X.timebank)
        $('#match_otimebank').val(gameRound.O.timebank)
      }
    })

    if (!gameRound.O.id) {
      window.onbeforeunload = function () {
        $.ajax({
          type: 'DELETE',
          url: window.location.pathname
        })
      }
    }

  }


  var timer
  function countdownTimer () {
    timer = setInterval(function () {
      if (gameRound[gameRound.currentplayer].timebank === 0) {
        $('.timebank-' + gameRound.currentplayer + '-' + gameRound.id).text('Time\'s up!')
        // Current player loses
        if (gameRound.currentplayer === 'X') {
          gameRound.outcome = 'O'
          gameRound.winner = gameRound.O.id
          gameRound.X.timebank = 0
        } else {
          gameRound.outcome = 'X'
          gameRound.winner = gameRound.X.id
          gameRound.O.timebank = 0
        }
        clearInterval(timer)
        updateFormInputAndSubmit()
      } else {
        $('.timebank-' + gameRound.currentplayer + '-' + gameRound.id).text(gameRound[gameRound.currentplayer].timebank)
        gameRound[gameRound.currentplayer].timebank -= 1

        if (gameRound[gameRound.currentplayer].timebank % 12 === 0) {
          updateFormInputAndSubmit()
        }
      }
    }, 1000)
  }

  function updateFormInputAndSubmit () {
    gameRound.gamestr = ''
    for (var i = 0; i < 6; i++) {
      gameRound.gamestr += gameBoard[i].join('')
    }

    $('#match_gameboard').val(gameRound.gamestr)
    $('#match_moveindex').val(gameRound.moveindex)
    $('#match_currentplayer').val(gameRound.currentplayer)
    $('#match_playerx_id').val(gameRound.X.id)
    $('#match_playero_id').val(gameRound.O.id)
    $('#match_outcome').val(gameRound.outcome)
    $('#match_winner').val(gameRound.winner)

    $('#match_xtimebank').val(gameRound.X.timebank)
    $('#match_otimebank').val(gameRound.O.timebank)

    $('.game-board-form').submit()
  }

  function addGameSquareListener () {
    $allGameSquare.off()
    for (var i = 0; i < $allGameSquare.length; i++) {
      var $gameSquare = $('.game-square').eq(i)
      if (!$gameSquare.hasClass('X') && !$gameSquare.hasClass('O')) {
        $gameSquare.on('click', placeToken)

        $gameSquare.hover(
          function () {
            $(this).addClass('hover' + gameRound.currentplayer)
          },
          function () {
            $(this).removeClass('hoverX hoverO')
          })
        }
    }
  }

  function addRotateButtonListener () {
    // Assigns rotate tile function to each button using closure
    $('.rotate-btn').show()
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
    // If (I'm current player) && (game is ongoing) && (there is opponent for first move)
    if (gameRound.playerid === gameRound[gameRound.currentplayer].id && gameRound.outcome === 'N' && gameRound.O.id) {
      // If cell is populated
      if (!$(this).hasClass('X') && !$(this).hasClass('O')) {
        // Gets rows and col index from HTML divs
        var xCoord = Number($(this).data('row'))
        var yCoord = Number($(this).data('col'))

        // Assigns player value to gameBoard array and HTML
        gameBoard[xCoord][yCoord] = gameRound.currentplayer
        $(this).addClass(gameRound.currentplayer)

        $allGameSquare.off()
        $allGameSquare.removeClass('hoverX hoverO')

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
        $('.rotate-btn').hide()
        // addGameSquareListener() // Handled by broadcast

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
        outcomeMessage = 'Black wins!'
        break
      case 'N':
        if (!gameRound.O.id) {
          outcomeMessage = 'Waiting for opponent...'
        } else if (gameRound.currentplayer === 'X') {
          if (gameRound.moveindex === 'A') {
            outcomeMessage = 'White: Place a token'
          } else if (gameRound.moveindex === 'B') {
            outcomeMessage = 'White: Rotate a tile'
          }
        } else if (gameRound.currentplayer === 'O') {
          if (gameRound.moveindex === 'A') {
            outcomeMessage = 'Black: Place a token'
          } else if (gameRound.moveindex === 'B') {
            outcomeMessage = 'Black: Rotate a tile'
          }
        }
        break
    }
    $('.outcome-message').text(outcomeMessage)
  }
})
