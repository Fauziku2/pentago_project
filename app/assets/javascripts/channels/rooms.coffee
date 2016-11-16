jQuery(document).on 'turbolinks:load', ->
  messages = $('#messages')
  if $('#messages').length > 0
    messages_to_bottom = -> messages.scrollTop(messages.prop("scrollHeight"))

    messages_to_bottom()


    App.global_chat = App.cable.subscriptions.create {
      channel: "ChatRoomsChannel"
      chat_room_id: messages.data('chat-room-id')
    },
      connected: ->
        # Called when the subscription is ready for use on the server

      disconnected: ->
        # Called when the subscription has been terminated by the server

      received: (data) ->
        messages.append data['message']
        messages_to_bottom()

      send_message: (message, chat_room_id) ->
        @perform 'send_message', message: message, chat_room_id: chat_room_id


    # $('#new_message').submit (e) ->
    #   $this = $(this)
    #   textarea = $this.find('#message_body')
    #   if $.trim(textarea.val()).length > 1
    #     App.global_chat.send_message textarea.val(),
    #     messages.data('chat-room-id')
    #     textarea.val('')
    #   e.preventDefault()
    #   return false


    $('#new_message').submit (e) ->
      $this = $(this)
      textarea = $this.find('#message_body')
      if $.trim(textarea.val()).length > 1
        App.global_chat.send_message textarea.val(), messages.data('chat-room-id')
        textarea.val('')
      e.preventDefault()
      return false

    $('#message_body').on 'keypress', (event) ->
      if event.keyCode == 13
        textarea = $('#message_body')
        if $.trim(textarea.val()).length > 1
          App.global_chat.send_message textarea.val(), messages.data('chat-room-id')
          textarea.val('')
        event.preventDefault()

    # $('#new_message').submit (e) ->
    #
    #   return false
    #
    # $('#message_body').on 'keydown', (e) ->
    #   textarea = $('#message_body')
    #   if event.keyCode is 13
    #     if $.trim(textarea.val()).length > 1
    #       App.global_chat.send_message textarea.val(),
    #       messages.data('chat-room-id')
    #       textarea.val('')
    #     e.preventDefault()






  # submit_message = () ->
  #   $('#message_body').on 'keydown', (event) ->
  #     if event.keyCode is 13
  #       $('input').click()
  #       event.target.value = ""
  #       event.preventDefault()



    # $('#new_message').on 'keydown', (e) ->
    #
    #   if e.keyCode is 13
    #     $('input').click()
    #
    #     $this = $(this)
    #     textarea = $this.find('#message_body')
    #     if $.trim(textarea.val()).length > 1
    #       App.global_chat.send_message textarea.val(),
    #       messages.data('chat-room-id')
    #       textarea.val('')
    #     e.preventDefault()
    #     return false

      # $('#new_message').submit (e) ->
      #
      #   return false


      # $('#message_body').on 'keydown', (e) ->
      #   if e.keyCode is 13
      #     $('input').click()
      #     $this = $(this)
      #     textarea = $this.find('#message_body')
      #     if $.trim(textarea.val()).length > 1
      #       App.global_chat.send_message textarea.val(),
      #       messages.data('chat-room-id')
      #       textarea.val('')
      #     e.preventDefault()
      #   return false
