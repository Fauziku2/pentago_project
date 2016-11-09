class CreateMatches < ActiveRecord::Migration[5.0]
  def change
    create_table :matches do |t|
      t.string :gameboard
      t.string :gamestatus
      t.string :currentplayer

      t.timestamps
    end
  end
end
