class MatchesController < ApplicationController
  def index
    @matches = Match.all
  end

  def show
    @match = Match.find(params[:id])
    @match.playero_id = current_user.id
  end

  def new
    @match = Match.new
    @match.playerx_id = current_user.id
  end

  def edit
    @match = Match.find(params[:id])
    @user = current_user.id
  end

  def create
    @match = Match.new(match_params)

    if @match.save
      redirect_to @match
    else
      render 'new'
    end
  end

  def challenge
    @match = Match.find(params[:id])
    if @match.update_attribute(:playero_id, current_user.id)

      ActionCable.server.broadcast "gameroom_channel_#{@match.id}",
        gameboard:  @match.gameboard,
        currentplayer: @match.currentplayer,
        playerx:  @match.playerx_id,
        playero: @match.playero_id,
        outcome: @match.outcome,
        winner: @match.winner
    end
    redirect_to edit_match_path
  end

  def update
    @match = Match.find(params[:id])

    if @match.update(match_params)
      ActionCable.server.broadcast "gameroom_channel_#{@match.id}",
                                   gameboard:  @match.gameboard,
                                   currentplayer: @match.currentplayer,
                                   playerx:  @match.playerx_id,
                                   playero: @match.playero_id,
                                   outcome: @match.outcome,
                                   winner: @match.winner,
                                   playerid: current_user.id
      # head :ok
    end
  end

  def destroy
    @match = Match.find(params[:id])
    @match.destroy

    redirect_to matches_path
  end

  private
  def match_params
    params.require(:match).permit(:gameboard, :currentplayer, :playerx_id, :playero_id, :outcome, :winner)
  end

end
