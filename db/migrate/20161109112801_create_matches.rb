class CreateMatches < ActiveRecord::Migration[5.0]
  def change
    create_table :matches do |t|
      t.string :gameboard, default: '000000000000000000000000000000000000'
      t.string :currentplayer, default: 'X'
      t.string :moveindex, default: 'A'
      t.integer :playerx_id
      t.integer :playero_id, default: nil
      t.string :outcome, default: 'N'
      t.integer :winner
      t.integer :xtimebank, default: 300
      t.integer :otimebank, default: 300
      t.datetime :move_start_time

      t.timestamps
    end
  end
end
