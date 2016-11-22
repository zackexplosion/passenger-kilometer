class CreateTrips < ActiveRecord::Migration
  def change
    create_table :trips do |t|
      t.string :video_link
      t.string :google_map_path_link
      t.string :start_point
      t.string :end_poinrt
      t.float :distance
      t.string :road_type
      t.integer :numbers_of_people
      t.boolean :accident

      t.timestamps null: false
    end
  end
end
