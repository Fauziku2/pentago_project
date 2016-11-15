# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.create(
    email: 'Terence@gmail.com',
    password: '1234567',
    name: 'Terence'
    )

User.create(
    email: 'Terencejr1@gmail.com',
    password: '1234567',
    name: 'Terence Jr 1'
    )

User.create(
    email: 'Terencejr2@gmail.com',
    password: '1234567',
    name: 'Terence Jr 2'
    )

User.create(
    email: 'Terencejr3@gmail.com',
    password: '1234567',
    name: 'Terence Jr 3'
    )

User.create(
    email: 'gitmaster@gmail.com',
    password: '1234567',
    name: 'Git Master'
    )

chatroom_list = [
  "Ironman",
  "Wonderwoman",
  "Batman",
  "Superman"
]

chatroom_list.each do |title|
  ChatRoom.create( title: title )
end
