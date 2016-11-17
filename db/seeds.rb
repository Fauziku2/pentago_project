# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

10.times do |i|
  User.create(email:"test#{i+1}@gmail.com", name:"test#{i+1}", password:"1234567")
end

# TH: OUTCOME = O FOR OVER, D FOR DRAW

15.times do |i|
    a=rand(1..5)
    b=rand(6..10)
   Match.create(playerx_id:a, playero_id:b, outcome:"X", winner:a)
end


15.times do |i|
    a=rand(6..10)
    b=rand(1..5)
   Match.create(playerx_id:a, playero_id:b, outcome:"O", winner:b)
end

# 3.times do |i|
#   Match.create(playerx_id:"#{i}", playero_id:"#{i+1}", outcome:"O", winner:"#{i}")
# end

Match.create(playerx_id:5, playero_id:8, outcome:"T", winner:"")
Match.create(playerx_id:5, playero_id:9, outcome:"T", winner:"")
Match.create(playerx_id:6, playero_id:9, outcome:"T", winner:"")
Match.create(playerx_id:7, playero_id:9, outcome:"T", winner:"")
