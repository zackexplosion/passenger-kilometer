class Trip < ActiveRecord::Base

	def self.RoadTypes
		['平面禁行機車', '市區高架', '快速公路', '高速公路']
	end

	def passenger_kilometer
		self.distance * self.numbers_of_people
	end

	def self.all_passenger_kilometer
		@passenger_kilometer = 0

		self.all.each do |t|
			@passenger_kilometer += t.passenger_kilometer
		end

		return @passenger_kilometer.round 2
	end
end
