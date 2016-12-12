class AddColumnsToTrip < ActiveRecord::Migration
  def change
  	add_column :trips, :formatted_start_point, :string
  	add_column :trips, :formatted_end_point, :string
  	add_column :trips, :video_title, :string
  end
end
