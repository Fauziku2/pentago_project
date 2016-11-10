class MatchesController < ApplicationController
  def index
    @matches = Match.all
  end

  def show
    @match = Match.find(params[:id])
  end

  def new
    @match = Match.new
  end

  def edit
    @match = Match.find(params[:id])
  end

  def create
    @match = Match.new(match_params)

    if @match.save
      redirect_to @match
    else
      render 'new'
    end
  end

  def update
    @match = Match.find(params[:id])

    if @match.update(match_params)
      ActionCable.server.broadcast 'gameroom_channel',
                                   gameboard:  @match.gameboard,
                                   gamestatus: @match.gamestatus,
                                   currentplayer: @match.currentplayer,
                                   playerx:  @match.playerx,
                                   playero: @match.playero,
                                   outcome: @match.outcome
      head :ok
    end
  end

  def destroy
    @match = Match.find(params[:id])
    @match.destroy

    redirect_to matches_path
  end

  private
  def match_params
    params.require(:match).permit(:gameboard, :gamestatus, :currentplayer, :playerx, :playero, :outcome)
  end

end
