class CreateMatches < ActiveRecord::Migration[5.0]
  def change
    create_table :matches do |t|
      t.string :gameboard, default: '000000000000000000000000000000000000'
      t.string :currentplayer, default: 'X'
      t.integer :playerx_id
      t.integer :playero_id
      t.string :outcome, default: 'N'
      t.integer :winner

      t.timestamps
    end
  end
end
