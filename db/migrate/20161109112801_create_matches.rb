class CreateMatches < ActiveRecord::Migration[5.0]
  def change
    create_table :matches do |t|
      t.string :gameboard, default: '000000000000000000000000000000000000'
      t.string :gamestatus, default: 'playing'
      t.string :currentplayer, default: 'X'

      t.timestamps
    end
  end
end
