class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  has_many :playerx_matches, :class_name => "Match", :foreign_key => "playerx_id"
  has_many :playero_matches, :class_name => "Match", :foreign_key => "playero_id"

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
end
