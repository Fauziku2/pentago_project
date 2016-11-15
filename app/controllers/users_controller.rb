class UsersController < ApplicationController

  def home
    # total_matches = 0
    # m1 = Match.where(playerx_id: current_user.id)
    # total_matches += m1.count
    # m2 = Match.where(playero_id: current_user.id)
    # total_matches += m2.count
    #
    # @total_matches = total_matches

    total_win = 0
    m3 = Match.where(winner: current_user.id)
    total_win += m3.count

    @total_win = total_win


      total_lost = 0
      # m4 = Match.where.not(winner: current_user.id, playerx_id: current_user.id)
      # total_lost += m4.count
      # m5 = Match.where.not(winner: current_user.id, playero_id: current_user.id)
      # total_lost += m5.count


      @total_lost = total_lost


    total_tie = 0
    m7 = Match.where(winner: 0, playero_id: current_user.id)
    total_tie += m7.count
    m8 = Match.where(winner: 0, playerx_id: current_user.id)
    total_tie += m8.count

    @total_tie = total_tie

    total_matches = 0
    total_matches = total_win + total_lost + total_tie
    @total_matches = total_matches

  end

  def create
  end
end
