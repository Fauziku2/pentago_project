Rails.application.routes.draw do

  get '/about', to: 'static_pages#about'
  get '/instructions', to: 'static_pages#instructions'
  get '/profile', to: 'users#home'

  devise_for :users, path: '', path_names: {
  sign_in: 'login',
  sign_out: 'logout',
  sign_up: 'register'
}

  resources :matches, except: [:edit, :new, :delete] do
    member do
      patch 'challenge', to: 'matches#challenge'
    end
  end

  resources :users
  root "matches#index"

  resources :chat_rooms, only: [:show]

  mount ActionCable.server => '/cable'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
