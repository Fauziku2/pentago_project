class Match < ApplicationRecord
  validates :gameboard, length: { is: 36 }

  def self.start(uuid1, uuid2)
    white, black = [uuid1, uuid2].shuffle

    ActionCable.server.broadcast "player_#{white}", {action: "game_start", msg: "white"}
    ActionCable.server.broadcast "player_#{black}", {action: "game_start", msg: "black"}

    REDIS.set("opponent_for:#{white}", black)
    REDIS.set("opponent_for:#{black}", white)
  end
end
