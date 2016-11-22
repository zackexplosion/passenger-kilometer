json.array!(@trips) do |trip|
  json.extract! trip, :id, :video_link, :google_map_path_link, :start_point, :end_poinrt, :distance, :road_type, :numbers_of_people, :accident
  json.url trip_url(trip, format: :json)
end
