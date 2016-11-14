Rails.application.routes.draw do
  devise_for :users, path: '', path_names: {
  sign_in: 'login',
  sign_out: 'logout',
  sign_up: 'register'
}

  resources :users

  resources :matches, except: [:edit] do
    member do
      patch 'challenge', to: 'matches#challenge'
    end
  end

  root "users#home"

  mount ActionCable.server, at: '/cable'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
