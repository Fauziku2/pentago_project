class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable

  has_many :messages, dependent: :destroy

  has_many :playerx_matches, :class_name => "Match", :foreign_key => "playerx_id"
  has_many :playero_matches, :class_name => "Match", :foreign_key => "playero_id"

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # def name
  #   email.split('@')[0]
  # end

  def TotalWin(userid)
   Match.where(["winner = #{userid}"]).count
  end

  def AllLost(userid)
    lost = 0
    lost = Match.where(["playerx_id = #{userid} and outcome = 'O'"]).count + (Match.where(["playero_id = #{userid} and outcome = 'X'"]).count)
    return lost
  end

  def AllDraw(userid)
    draw=0
    draw = Match.where(["playerx_id = #{userid} and outcome = 'T'"]).count + (Match.where(["playero_id = #{userid} and outcome = 'T'"]).count)
    return draw
  end

  def TotalGames(userid)
    # x= Match.where(["playerx_id = #{userid}"]).count
    # o= Match.where(["playero_id = #{userid}"]).count
    return (TotalWin(userid) + AllLost(userid) + AllDraw(userid))
  end

  def WinningPercentage(userid)
    return (TotalWin(userid)/TotalGames(userid)*100)
  end

  def PlayerLevel(userid)
    totalgames = TotalGames(userid)

    case  totalgames

    when 0
      @player_level = 0

    when 1..9
      if (TotalWin(userid)/totalgames).to_f >= 0.5
        @player_level = 2
      else
        @player_level = 1
      end

    when 10..50
      if (TotalWin(userid)/totalgames).to_f >= 0.5
        @player_level = 3
      else
        @player_level = 1
      end

    when 50..100
      if (TotalWin(userid)/totalgames).to_f >= 0.70
        @player_level = 4
      else
        @player_level = 1
      end

    else
      if (TotalWin(userid)/totalgames).to_f >= 0.70
        @player_level = 5
      else
        @player_level = 1
      end

    end

    if AllLost(userid)==TotalGames(userid)
      @player_level = -1
    end

    LevelDescription(@player_level)

  end

  def LevelDescription(playerlevel)
    case playerlevel

    when -1
      return "damn LOSER"

    when 0
      return "never Play??"

    when 1
      return "Beginner"

    when 2
      return "Beginner++"

    when 3
      return "PROMISING"

    when 4
      return "MASTER"

    when 5
      return "GRAND master"
    end
  end


end
