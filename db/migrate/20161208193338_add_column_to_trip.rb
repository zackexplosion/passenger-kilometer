class AddColumnToTrip < ActiveRecord::Migration
  def change
  	add_column :trips, :vehicle_name, :string
  end
end
