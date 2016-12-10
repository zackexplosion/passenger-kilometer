class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :find_total_passenger_kilometer

  def find_total_passenger_kilometer
  	@total_passenger_kilometer = 10
  end
end
