class Match < ApplicationRecord
  validates :gameboard, length: { is: 36 }
end
