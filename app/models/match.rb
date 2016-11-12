class Match < ApplicationRecord
  validates :gameboard, length: { is: 36 }

  belongs_to :playerx, :class_name => "User"
  belongs_to :playero, :class_name => "User"
end
