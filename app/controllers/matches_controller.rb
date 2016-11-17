class MatchesController < ApplicationController
  def index
    @availablematches = Match.where(playero_id:nil).first(10)

    @livematches = Match.where(outcome:'N').where.not(playero_id:nil).last(10)

    @match = Match.new
    @match.playerx_id = current_user.id
  end

  def show
    @match = Match.find(params[:id])
    @chat_room = @match.chat_room
    @user = current_user.id

    @message = Message.new

    respond_to do |format|
      format.html
      format.json  { render json: {
          match: @match,
          user: @user
        }}
    end
  end

  def create
    @match = Match.new(match_params)

    if @match.save
      # Find match cos build needs database datatype
      match = Match.find(@match.id)
      @chat_room = match.build_chat_room()
      @chat_room.save
      redirect_to @match
    else
      render 'index'
    end
  end

  def challenge
    @match = Match.find(params[:id])

    if (@match.playero_id.blank? == true && @match.playerx_id != current_user.id)

      if @match.update_attributes(playero_id: current_user.id)
        ActionCable.server.broadcast "gameroom_channel_#{@match.id}",
          id: @match.id,
          gameboard:  @match.gameboard,
          moveindex: @match.moveindex,
          currentplayer: @match.currentplayer,
          playerx:  @match.playerx_id,
          playero: @match.playero_id,
          outcome: @match.outcome,
          winner: @match.winner,
          xtimebank: @match.xtimebank,
          otimebank: @match.otimebank,
          playeroname: @match.playero.name
      end
      redirect_to match_path
    end
  end

  def update
    @match = Match.find(params[:id])

    if @match.update(match_params)
      ActionCable.server.broadcast "gameroom_channel_#{@match.id}",
                                   id: @match.id,
                                   gameboard:  @match.gameboard,
                                   moveindex: @match.moveindex,
                                   currentplayer: @match.currentplayer,
                                   playerx:  @match.playerx_id,
                                   playero: @match.playero_id,
                                   outcome: @match.outcome,
                                   winner: @match.winner,
                                   playerid: current_user.id,
                                   xtimebank: @match.xtimebank,
                                   otimebank: @match.otimebank
      head :ok
    end
  end

  private
  def match_params
    params.require(:match).permit(:gameboard, :moveindex, :currentplayer, :playerx_id, :playero_id, :outcome, :winner, :xtimebank, :otimebank)
  end

  def chat_room_params
    params.require(:chat_room).permit(:title)
  end
end
