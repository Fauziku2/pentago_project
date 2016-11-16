class ChatRoomsController < ApplicationController
  def show
    @chat_room = ChatRoom.includes(:messages).find_by(id: params[:id])
    @message = Message.new
  end
end
