# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
class GameroomChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "gameroom_channel"
    p "gameroom_channel_#{params['game_room_id']}"
    stream_from "gameroom_channel_#{params['game_room_id']}"
  end

  def unsubscribed
  end
end
