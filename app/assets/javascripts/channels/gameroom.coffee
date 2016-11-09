App.gameroom = App.cable.subscriptions.create "GameroomChannel",
  connected: ->
    # Called when the subscription is ready for use on the server

  disconnected: ->
    # Called when the subscription has been terminated by the server

  received: (data) ->
    printData = () ->
      console.log data.gameboard
