Rails.application.routes.draw do
  get 'chat_rooms/index'
  get 'chat_rooms/new'
  get 'chat_rooms/create'

  devise_for :users, path: '', path_names: {
  sign_in: 'login',
  sign_out: 'logout',
  sign_up: 'register'
}

  resources :chat_rooms, only: [:new, :create, :show, :index]
  resources :users
  root "users#home"

  mount ActionCable.server => '/cable'


  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html



end
