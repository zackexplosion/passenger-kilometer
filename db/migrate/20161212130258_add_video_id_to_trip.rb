class AddVideoIdToTrip < ActiveRecord::Migration
  def change
  	add_column :trips, :video_id, :string
  end
end
