Rails.application.routes.draw do
  # get 'static_pages/login'
  #
  # get 'static_pages/signup'

  get 'static_pages/about'

  get 'static_pages/instructions'

  devise_for :users, path: '', path_names: {
  sign_in: 'login',
  sign_out: 'logout',
  sign_up: 'register'
}

  resources :users, :static_pages
  root "users#home"
  # root "static_pages#about"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
