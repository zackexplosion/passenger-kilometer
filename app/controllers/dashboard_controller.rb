class DashboardController < ApplicationController
	def index
		@passenger_kilometer = 0
		Trip.all.each do |t|
			@passenger_kilometer += t.passenger_kilometer
		end
	end
end
