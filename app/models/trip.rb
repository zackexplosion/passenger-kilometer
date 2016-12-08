class Trip < ActiveRecord::Base

	def self.RoadTypes
		['平面禁行機車', '市區高架', '快速公路', '高速公路']
	end

	def passenger_kilometer
		self.distance * self.numbers_of_people
	end
end
