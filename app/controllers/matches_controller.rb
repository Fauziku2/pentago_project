class MatchesController < ApplicationController
  def index
    @availablematches = Match.where(playero_id:nil)
    @livematches = Match.where(outcome:'N').where.not(playero_id:nil)
  end

  def show
    @match = Match.find(params[:id])
    @chat_room = @match.chat_room
    @user = current_user.id

    # @chat_room = ChatRoom.includes(:messages).find_by(id: params[:id])
    @message = Message.new

    respond_to do |format|
      format.html
      format.json  { render json: {
          match: @match,
          user: @user
        }}
    end
  end

  def new
    @match = Match.new
    @match.playerx_id = current_user.id
  end

  def create
    @match = Match.new(match_params)
    @chat_room = current_user.chat_rooms.build(chat_room_params)

    if @match.save
      match = Match.find(@match.id)
      @chat_room = match.build_chat_room(title: "title")
      @chat_room.save
      redirect_to @match
    else
      render 'new'
    end
  end

  def challenge
    @match = Match.find(params[:id])
    # Add this validation to a model
    if @match.playero_id.blank?
      if @match.update_attribute(:playero_id, current_user.id)

        ActionCable.server.broadcast "gameroom_channel_#{@match.id}",
          gameboard:  @match.gameboard,
          moveindex: @match.moveindex,
          currentplayer: @match.currentplayer,
          playerx:  @match.playerx_id,
          playero: @match.playero_id,
          outcome: @match.outcome,
          winner: @match.winner
      end
      redirect_to match_path
    end
  end

  def update
    @match = Match.find(params[:id])

    if @match.update(match_params)
      ActionCable.server.broadcast "gameroom_channel_#{@match.id}",
                                   gameboard:  @match.gameboard,
                                   moveindex: @match.moveindex,
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
    params.require(:match).permit(:gameboard, :moveindex, :currentplayer, :playerx_id, :playero_id, :outcome, :winner)
  end

  def chat_room_params
    params.require(:chat_room).permit(:title)
  end
end
