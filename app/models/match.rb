class Match < ApplicationRecord
  validates :gameboard, length: { is: 36 }

  has_one :chat_room

  belongs_to :playerx, :class_name => "User"
  belongs_to :playero, :class_name => "User", optional: true
end
