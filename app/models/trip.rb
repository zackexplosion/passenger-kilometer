class Trip < ActiveRecord::Base

	def passenger_kilometer
		self.distance * self.numbers_of_people
	end
end
