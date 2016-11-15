module ApplicationCable
  class Connection < ActionCable::Connection::Base
    # identified_by :uuid # ID of a connection, currently is random, but should make it from the user ID. Can access in channels
    #
    # def connect
    #   self.uuid = SecureRandom.uuid
    # end
  end
end
