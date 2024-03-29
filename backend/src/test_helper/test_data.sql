/* password is test */
INSERT INTO
	public.users (
		id,
		email,
		"password",
		salt,
		"name",
		active,
		verified_email,
		deactivated_at,
		internal_notes,
		created_at,
		updated_at
	)
VALUES
	(
		'2ea805d0-19d1-46fe-8dd6-70285f02a23a' :: uuid,
		'test@test.com',
		'NpEJtoTL6JC71aKzPbwc+4JoF0t7VzyHq+XENYl5eQ4=',
		'ac355173-f5c6-46f9-9060-61e9d5cdf373',
		'testuser',
		false,
		false,
		NULL,
		NULL,
		'2021-10-07 21:55:48.483282+02',
		NULL
	);

INSERT INTO
	public.agencies (
		agency_id,
		agency_name,
		agency_url,
		agency_timezone,
		agency_lang,
		agency_phone,
		agency_fare_url,
		agency_email,
		created_at,
		updated_at
	)
VALUES
	(
		'8457aec4-c852-4f84-9dc0-e81e79555683' :: uuid,
		'MetroCar',
		'http://metrocar.org',
		'Europe/Berlin',
		NULL,
		NULL,
		NULL,
		NULL,
		'2021-10-09 07:52:23.719154+02',
		NULL
	) ON CONFLICT (agency_id) DO NOTHING;

INSERT INTO
	public.stops (
		stop_id,
		stop_code,
		stop_name,
		tts_stop_name,
		stop_desc,
		stop_lat,
		stop_lon,
		zone_id,
		stop_url,
		"location_type",
		parent_stop_id,
		stop_timezone,
		wheelchair_boarding,
		level_id,
		platform_code,
		active,
		created_at,
		updated_at
	)
VALUES
	(
		'32af8a7d-c168-4436-bae2-4b3382704879' :: uuid,
		NULL,
		'Danziger Strasse / Greifswalder strasse',
		NULL,
		NULL,
		52.53658,
		13.43245,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'0f57ded1-eb6d-45d4-a966-6d6da57d0d9e' :: uuid,
		NULL,
		'Danziger Strasse / Greifswalder strasse',
		NULL,
		NULL,
		52.53559,
		13.4338,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'68a346df-b68b-4949-8158-becb3384f07e' :: uuid,
		NULL,
		'Danziiger Strasse / Kniprodestrasse',
		NULL,
		NULL,
		52.53236,
		13.44057,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'16b98842-b279-4f7d-82bf-97a6dbe941c2' :: uuid,
		NULL,
		'Vienna House',
		NULL,
		NULL,
		52.52849,
		13.45691,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'b5cb7197-ab79-4257-960f-cc5797b9fb65' :: uuid,
		NULL,
		'Le Prom',
		NULL,
		NULL,
		52.5422,
		13.54172,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'220ac85e-25fd-4caa-a464-f645b4d70804' :: uuid,
		NULL,
		'Lidl',
		NULL,
		NULL,
		52.55684,
		13.55427,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'97991102-d281-4f31-8c48-6315a15002af' :: uuid,
		NULL,
		'Parkplatz',
		NULL,
		NULL,
		52.67747,
		13.39005,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'66fe7d7e-baf7-47a1-b897-3869abde022f' :: uuid,
		NULL,
		'Parkplatz',
		NULL,
		NULL,
		52.67669,
		13.39455,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'2a021402-b36f-4249-b624-a00b03f9e60a' :: uuid,
		NULL,
		'Autogas Blumberg',
		NULL,
		NULL,
		52.60337,
		13.60977,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'e4edb865-c4dc-40cb-8cf8-bfad17105862' :: uuid,
		NULL,
		'Norma Blumberg',
		NULL,
		NULL,
		52.59627,
		13.59973,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'97494ca2-32a2-4760-8937-24dbd30619ba' :: uuid,
		NULL,
		'Apfelsteig',
		NULL,
		NULL,
		52.58053,
		13.58057,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'f119025f-5d55-48ee-a6c7-812bafc8d13b' :: uuid,
		NULL,
		'Ahrensfelder Dreieck',
		NULL,
		NULL,
		52.57885,
		13.58244,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'8dc50edc-df60-432f-a9df-0c5ae961c36e' :: uuid,
		NULL,
		'Dorfstrasse/Merow Str.',
		NULL,
		NULL,
		52.57685,
		13.58267,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'c3794997-1768-4fd6-a5a8-cf6a57ee9ab9' :: uuid,
		NULL,
		'Rathaus Ahrensfelde',
		NULL,
		NULL,
		52.5758,
		13.57568,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'93bebb1a-941f-4921-9a7d-52ff24ca70e3' :: uuid,
		NULL,
		'Ahrensfelder Strasse',
		NULL,
		NULL,
		52.60292,
		13.5305,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'8104a4ab-62af-4b56-925f-4f0c57cff32b' :: uuid,
		NULL,
		'Karl Marx Str.',
		NULL,
		NULL,
		52.60261,
		13.52812,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'1b868f6e-bcff-4491-87b6-1cf788f3c03d' :: uuid,
		NULL,
		'Shell Tankstelle',
		NULL,
		NULL,
		52.60121,
		13.5147,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'3b78a161-1b08-41e9-ad71-fa7e17e35358' :: uuid,
		NULL,
		'Lindenzwerge',
		NULL,
		NULL,
		52.60225,
		13.53053,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'eaaf40b5-be40-4576-b560-f267ee79b4b3' :: uuid,
		NULL,
		'Ahrensfelde Liindenberger Str.',
		NULL,
		NULL,
		52.58324,
		13.56724,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'ca75e329-6063-426a-8555-1f2d42b1db8d' :: uuid,
		NULL,
		'Ahrensfelde Bahnhof',
		NULL,
		NULL,
		52.58135,
		13.57418,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'1d68e39a-3618-4fc9-a588-4b0af4b66b5b' :: uuid,
		NULL,
		'Ahrensfelde Bahnhof',
		NULL,
		NULL,
		52.58019,
		13.5731,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'9216e821-03d2-4ed5-a49d-02211d2b2983' :: uuid,
		NULL,
		'Total Tankstelle',
		NULL,
		NULL,
		52.53558,
		13.52253,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'0b131d1c-6da5-4eb1-be85-88a96287651e' :: uuid,
		NULL,
		'Netto Landsberger allee',
		NULL,
		NULL,
		52.53106,
		13.46881,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'6c7a3c6c-69f4-4808-99cd-90db43cd9f11' :: uuid,
		NULL,
		'Friedenstrasse',
		NULL,
		NULL,
		52.52356,
		13.4331,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'36bc1964-c0f1-44ea-9bc4-3a44be7f6796' :: uuid,
		NULL,
		'Netto Mollstrasse',
		NULL,
		NULL,
		52.52343,
		13.42606,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'0cf55eaf-62d6-403b-8a5d-8f81542fcb0f' :: uuid,
		NULL,
		'Mollstrasse',
		NULL,
		NULL,
		52.52433,
		13.42141,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'0298db74-42f6-44e2-9bf3-29914e99a3bd' :: uuid,
		NULL,
		'Mollstrasse',
		NULL,
		NULL,
		52.52488,
		13.42139,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'0dfd4584-9fb0-41bd-a66b-043c3aa35ae3' :: uuid,
		NULL,
		'Otto braun strasse',
		NULL,
		NULL,
		52.52367,
		13.41881,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'aa5ff2d0-da2d-4c27-9a3e-cac620d9c3ea' :: uuid,
		NULL,
		'Memhardstrasse',
		NULL,
		NULL,
		52.52384,
		13.41105,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'5d734ed6-03dc-4c3c-886d-6fa4d379f55f' :: uuid,
		NULL,
		'Memhardstrasse',
		NULL,
		NULL,
		52.52405,
		13.411,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'872ee76e-b2cf-4cb1-98a2-2db59c630612' :: uuid,
		NULL,
		'Spandauert Strasse',
		NULL,
		NULL,
		52.51892,
		13.40618,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'81371c85-b1d9-40fa-97ff-378964ffee38' :: uuid,
		NULL,
		'Am Lustgarten',
		NULL,
		NULL,
		52.51869,
		13.4007,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'3217ad8e-6c74-47a7-a35c-1c439528238b' :: uuid,
		NULL,
		'Brandenburger Tor',
		NULL,
		NULL,
		52.51664,
		13.38026,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'7796c194-4527-428e-a0be-60b3681ecac6' :: uuid,
		NULL,
		'Hotel Adlon',
		NULL,
		NULL,
		52.51626,
		13.38031,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'4d28f5a5-61e0-4978-b623-c2635e4aea77' :: uuid,
		NULL,
		'Platz vor dem neuen Tor',
		NULL,
		NULL,
		52.5286,
		13.37842,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'3fef10f7-9c1d-4724-beda-a571064eedaa' :: uuid,
		NULL,
		'Sozialgericht',
		NULL,
		NULL,
		52.52755,
		13.37184,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'f92ebae7-a890-45db-9069-81031ccf2bb6' :: uuid,
		NULL,
		'Invalidenstrasse',
		NULL,
		NULL,
		52.52723,
		13.3727,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'f58f4701-2c19-4398-ba1f-56622e70a5e3' :: uuid,
		NULL,
		'Karl Liebknecht Strasse',
		NULL,
		NULL,
		52.52637,
		13.4145,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'47d895e8-41d2-4346-8504-055b72998f87' :: uuid,
		NULL,
		'Park  Inn Hoitel',
		NULL,
		NULL,
		52.52299,
		13.41348,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'8d0f7a72-c8c7-4002-badd-bf4b2bccd333' :: uuid,
		NULL,
		'Alte Schoenhauser strasse',
		NULL,
		NULL,
		52.52512,
		13.40649,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'5f446401-3efc-46a5-a2cf-ebd2525fd60b' :: uuid,
		NULL,
		'Alte Schoenhauser strasse',
		NULL,
		NULL,
		52.52511,
		13.40656,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'02ca1202-4f8c-45ac-ae4a-9607a7385bc5' :: uuid,
		NULL,
		'Torstrasse',
		NULL,
		NULL,
		52.52744,
		13.41534,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'75efc0b9-2a8c-4704-bdaf-7bea0acc5054' :: uuid,
		NULL,
		'SEZ',
		NULL,
		NULL,
		52.52655,
		13.44936,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'cd3ea1ac-1e8c-4e60-b948-e7ab3f6b9ce0' :: uuid,
		NULL,
		'SEZ',
		NULL,
		NULL,
		52.52624,
		13.44634,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'75dda211-e938-4a9e-b228-f796ff042f19' :: uuid,
		NULL,
		'Burgerking Landsberger Allee',
		NULL,
		NULL,
		52.5289,
		13.45658,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'a085b7a1-a366-4e85-ae87-f8c2c43c7e16' :: uuid,
		NULL,
		'Landsberger Allee',
		NULL,
		NULL,
		52.53028,
		13.46249,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'1a19d4ba-3802-4f20-9ad9-a808de518645' :: uuid,
		NULL,
		'City Hotel Landsberger Allee',
		NULL,
		NULL,
		52.5334,
		13.47778,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'caa3cf04-73a1-4ea0-935a-6b17142a2ee3' :: uuid,
		NULL,
		'IKEA Lichtenberg',
		NULL,
		NULL,
		52.53453,
		13.51267,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'480158dc-cf20-44d7-bb2f-2583701eb039' :: uuid,
		NULL,
		'JET Tankstelle',
		NULL,
		NULL,
		52.55173,
		13.54973,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'65e41ebc-5fdb-4b5a-bdcb-a36d3585cf8e' :: uuid,
		NULL,
		'SBahn Marzahn',
		NULL,
		NULL,
		52.54391,
		13.54198,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'732301c6-d345-4260-b562-b32cdf5154ea' :: uuid,
		NULL,
		'Sbahn Roul-Wallenberg-Str.',
		NULL,
		NULL,
		52.55081,
		13.54804,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'56fa7594-f5dc-4ec8-8b04-915f86e13acf' :: uuid,
		NULL,
		'SBahn Mehrower Allee',
		NULL,
		NULL,
		52.55798,
		13.55423,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'6c3a80c7-1ae9-41b2-96bf-0fb4e39db61a' :: uuid,
		NULL,
		'Amt',
		NULL,
		NULL,
		52.57282,
		13.56794,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'70921547-1ee2-4e5b-a1a9-16de5d6af2a0' :: uuid,
		NULL,
		'Ahrensfelde Sbahn',
		NULL,
		NULL,
		52.57159,
		13.56618,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	),
	(
		'7e5848ed-3e58-4a7b-9f53-cd661618c473' :: uuid,
		NULL,
		'Edeka ahrensfelde',
		NULL,
		NULL,
		52.57492,
		13.57284,
		'',
		NULL,
		NULL,
		NULL,
		NULL,
		'1' :: wheelchair_boarding_type,
		NULL,
		NULL,
		NULL,
		'2021-10-03 22:20:30.83969+02',
		NULL
	);

INSERT INTO
	public.routes (
		route_id,
		agency_id,
		route_short_name,
		route_long_name,
		route_desc,
		"route_type",
		route_url,
		route_color,
		route_text_color,
		continuous_pickup,
		continuous_drop_off,
		created_at,
		updated_at
	)
VALUES
	(
		'87215dff60e31493d1b37504f6c86a5f80c2d24e',
		'8457aec4-c852-4f84-9dc0-e81e79555683',
		'L1',
		'From Ahrensfelde Bahnhof to Sozialgericht',
		'From Ahrensfelde Bahnhof to Sozialgericht with 16 stops.',
		'3' :: route_type,
		NULL,
		NULL,
		NULL,
		'3' :: continuous_type,
		'3' :: continuous_type,
		'2021-10-09 07:47:19.450074+02',
		NULL
	),
	(
		'4942bed018bb4e9d284b9a09005fb8dec4ac919c',
		'8457aec4-c852-4f84-9dc0-e81e79555683',
		'L3',
		'From Invalidenstrasse to Dorfstrasse/Merow Str.',
		'From Invalidenstrasse to Dorfstrasse/Merow Str. with 15 stops.',
		'3' :: route_type,
		NULL,
		NULL,
		NULL,
		'3' :: continuous_type,
		'3' :: continuous_type,
		'2021-10-09 07:50:03.363292+02',
		NULL
	);

INSERT INTO
	public.trips (
		trip_id,
		route_id,
		service_id,
		trip_headsign,
		trip_short_name,
		direction_id,
		shape_id,
		block_id,
		wheelchair_accessible,
		bikes_allowed,
		start_date,
		"owner",
		created_at,
		updated_at
	)
VALUES
	(
		'404f687c-1bf2-4eab-a91b-28feac8b8abf' :: uuid,
		'87215dff60e31493d1b37504f6c86a5f80c2d24e',
		'404f687c-1bf2-4eab-a91b-28feac8b8abf' :: uuid,
		'Sozialgericht',
		'BAR IZ 36E',
		NULL,
		'87215dff60e31493d1b37504f6c86a5f80c2d24e',
		NULL,
		NULL,
		NULL,
		'2021-10-11',
		'2ea805d0-19d1-46fe-8dd6-70285f02a23a' :: uuid,
		'2021-10-09 07:47:19.450074+02',
		NULL
	),
	(
		'2c8c01d5-6d9d-47b8-bd9d-8eff870aeff5' :: uuid,
		'87215dff60e31493d1b37504f6c86a5f80c2d24e',
		'2c8c01d5-6d9d-47b8-bd9d-8eff870aeff5' :: uuid,
		'Sozialgericht',
		'BAR IZ 36E',
		NULL,
		'87215dff60e31493d1b37504f6c86a5f80c2d24e',
		NULL,
		NULL,
		NULL,
		NULL,
		'2ea805d0-19d1-46fe-8dd6-70285f02a23a' :: uuid,
		'2021-10-09 07:48:05.175553+02',
		NULL
	),
	(
		'04efdcd7-3bfc-4ab4-aee0-dbeb0f326bae' :: uuid,
		'4942bed018bb4e9d284b9a09005fb8dec4ac919c',
		'04efdcd7-3bfc-4ab4-aee0-dbeb0f326bae' :: uuid,
		'Dorfstrasse/Merow Str.',
		'BAR IZ 36E',
		NULL,
		'4942bed018bb4e9d284b9a09005fb8dec4ac919c',
		NULL,
		NULL,
		NULL,
		NULL,
		'2ea805d0-19d1-46fe-8dd6-70285f02a23a' :: uuid,
		'2021-10-09 07:50:03.363292+02',
		NULL
	);

INSERT INTO
	public.calendar (
		service_id,
		monday,
		tuesday,
		wednesday,
		thursday,
		friday,
		saturday,
		sunday,
		start_date,
		end_date
	)
VALUES
	(
		'2c8c01d5-6d9d-47b8-bd9d-8eff870aeff5' :: uuid,
		true,
		true,
		true,
		true,
		true,
		false,
		false,
		'2021-10-11',
		'2021-10-29'
	),
	(
		'04efdcd7-3bfc-4ab4-aee0-dbeb0f326bae' :: uuid,
		true,
		true,
		true,
		true,
		true,
		false,
		false,
		'2021-10-11',
		'2021-10-29'
	);

INSERT INTO
	public.stop_times (
		trip_id,
		stop_id,
		arrival_time,
		departure_time,
		stop_sequence,
		stop_headsign,
		shape_dist_traveled,
		"pickup_type",
		drop_off_type,
		continuous_pickup,
		continuous_drop_off,
		timepoint
	)
VALUES
	(
		'404f687c-1bf2-4eab-a91b-28feac8b8abf' :: uuid,
		'ca75e329-6063-426a-8555-1f2d42b1db8d' :: uuid,
		'07:46:00' :: interval,
		'07:47:00' :: interval,
		1,
		NULL,
		0,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'404f687c-1bf2-4eab-a91b-28feac8b8abf' :: uuid,
		'c3794997-1768-4fd6-a5a8-cf6a57ee9ab9' :: uuid,
		'07:48:00' :: interval,
		'07:49:00' :: interval,
		2,
		NULL,
		1,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'404f687c-1bf2-4eab-a91b-28feac8b8abf' :: uuid,
		'7e5848ed-3e58-4a7b-9f53-cd661618c473' :: uuid,
		'07:50:00' :: interval,
		'07:51:00' :: interval,
		3,
		NULL,
		1,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'404f687c-1bf2-4eab-a91b-28feac8b8abf' :: uuid,
		'70921547-1ee2-4e5b-a1a9-16de5d6af2a0' :: uuid,
		'07:52:00' :: interval,
		'07:53:00' :: interval,
		4,
		NULL,
		2,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'404f687c-1bf2-4eab-a91b-28feac8b8abf' :: uuid,
		'56fa7594-f5dc-4ec8-8b04-915f86e13acf' :: uuid,
		'07:56:00' :: interval,
		'07:57:00' :: interval,
		5,
		NULL,
		4,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'404f687c-1bf2-4eab-a91b-28feac8b8abf' :: uuid,
		'732301c6-d345-4260-b562-b32cdf5154ea' :: uuid,
		'07:58:00' :: interval,
		'07:59:00' :: interval,
		6,
		NULL,
		5,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'404f687c-1bf2-4eab-a91b-28feac8b8abf' :: uuid,
		'65e41ebc-5fdb-4b5a-bdcb-a36d3585cf8e' :: uuid,
		'08:01:00' :: interval,
		'08:02:00' :: interval,
		7,
		NULL,
		6,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'404f687c-1bf2-4eab-a91b-28feac8b8abf' :: uuid,
		'1a19d4ba-3802-4f20-9ad9-a808de518645' :: uuid,
		'08:08:00' :: interval,
		'08:09:00' :: interval,
		8,
		NULL,
		11,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'404f687c-1bf2-4eab-a91b-28feac8b8abf' :: uuid,
		'a085b7a1-a366-4e85-ae87-f8c2c43c7e16' :: uuid,
		'08:11:00' :: interval,
		'08:12:00' :: interval,
		9,
		NULL,
		12,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'404f687c-1bf2-4eab-a91b-28feac8b8abf' :: uuid,
		'75dda211-e938-4a9e-b228-f796ff042f19' :: uuid,
		'08:12:00' :: interval,
		'08:13:00' :: interval,
		10,
		NULL,
		12,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'404f687c-1bf2-4eab-a91b-28feac8b8abf' :: uuid,
		'cd3ea1ac-1e8c-4e60-b948-e7ab3f6b9ce0' :: uuid,
		'08:14:00' :: interval,
		'08:15:00' :: interval,
		11,
		NULL,
		13,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'404f687c-1bf2-4eab-a91b-28feac8b8abf' :: uuid,
		'6c7a3c6c-69f4-4808-99cd-90db43cd9f11' :: uuid,
		'08:17:00' :: interval,
		'08:18:00' :: interval,
		12,
		NULL,
		14,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'404f687c-1bf2-4eab-a91b-28feac8b8abf' :: uuid,
		'36bc1964-c0f1-44ea-9bc4-3a44be7f6796' :: uuid,
		'08:19:00' :: interval,
		'08:20:00' :: interval,
		13,
		NULL,
		15,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'404f687c-1bf2-4eab-a91b-28feac8b8abf' :: uuid,
		'0298db74-42f6-44e2-9bf3-29914e99a3bd' :: uuid,
		'08:20:00' :: interval,
		'08:21:00' :: interval,
		14,
		NULL,
		15,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'404f687c-1bf2-4eab-a91b-28feac8b8abf' :: uuid,
		'02ca1202-4f8c-45ac-ae4a-9607a7385bc5' :: uuid,
		'08:22:00' :: interval,
		'08:23:00' :: interval,
		15,
		NULL,
		16,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'404f687c-1bf2-4eab-a91b-28feac8b8abf' :: uuid,
		'3fef10f7-9c1d-4724-beda-a571064eedaa' :: uuid,
		'08:30:00' :: interval,
		'08:31:00' :: interval,
		16,
		NULL,
		19,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'2c8c01d5-6d9d-47b8-bd9d-8eff870aeff5' :: uuid,
		'ca75e329-6063-426a-8555-1f2d42b1db8d' :: uuid,
		'07:48:00' :: interval,
		'07:49:00' :: interval,
		1,
		NULL,
		0,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'2c8c01d5-6d9d-47b8-bd9d-8eff870aeff5' :: uuid,
		'c3794997-1768-4fd6-a5a8-cf6a57ee9ab9' :: uuid,
		'07:50:00' :: interval,
		'07:51:00' :: interval,
		2,
		NULL,
		1,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'2c8c01d5-6d9d-47b8-bd9d-8eff870aeff5' :: uuid,
		'7e5848ed-3e58-4a7b-9f53-cd661618c473' :: uuid,
		'07:52:00' :: interval,
		'07:53:00' :: interval,
		3,
		NULL,
		1,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'2c8c01d5-6d9d-47b8-bd9d-8eff870aeff5' :: uuid,
		'70921547-1ee2-4e5b-a1a9-16de5d6af2a0' :: uuid,
		'07:54:00' :: interval,
		'07:55:00' :: interval,
		4,
		NULL,
		2,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'2c8c01d5-6d9d-47b8-bd9d-8eff870aeff5' :: uuid,
		'56fa7594-f5dc-4ec8-8b04-915f86e13acf' :: uuid,
		'07:58:00' :: interval,
		'07:59:00' :: interval,
		5,
		NULL,
		4,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'2c8c01d5-6d9d-47b8-bd9d-8eff870aeff5' :: uuid,
		'732301c6-d345-4260-b562-b32cdf5154ea' :: uuid,
		'08:00:00' :: interval,
		'08:01:00' :: interval,
		6,
		NULL,
		5,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'2c8c01d5-6d9d-47b8-bd9d-8eff870aeff5' :: uuid,
		'65e41ebc-5fdb-4b5a-bdcb-a36d3585cf8e' :: uuid,
		'08:03:00' :: interval,
		'08:04:00' :: interval,
		7,
		NULL,
		6,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'2c8c01d5-6d9d-47b8-bd9d-8eff870aeff5' :: uuid,
		'1a19d4ba-3802-4f20-9ad9-a808de518645' :: uuid,
		'08:10:00' :: interval,
		'08:11:00' :: interval,
		8,
		NULL,
		11,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'2c8c01d5-6d9d-47b8-bd9d-8eff870aeff5' :: uuid,
		'a085b7a1-a366-4e85-ae87-f8c2c43c7e16' :: uuid,
		'08:13:00' :: interval,
		'08:14:00' :: interval,
		9,
		NULL,
		12,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'2c8c01d5-6d9d-47b8-bd9d-8eff870aeff5' :: uuid,
		'75dda211-e938-4a9e-b228-f796ff042f19' :: uuid,
		'08:14:00' :: interval,
		'08:15:00' :: interval,
		10,
		NULL,
		12,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'2c8c01d5-6d9d-47b8-bd9d-8eff870aeff5' :: uuid,
		'cd3ea1ac-1e8c-4e60-b948-e7ab3f6b9ce0' :: uuid,
		'08:16:00' :: interval,
		'08:17:00' :: interval,
		11,
		NULL,
		13,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'2c8c01d5-6d9d-47b8-bd9d-8eff870aeff5' :: uuid,
		'6c7a3c6c-69f4-4808-99cd-90db43cd9f11' :: uuid,
		'08:19:00' :: interval,
		'08:20:00' :: interval,
		12,
		NULL,
		14,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'2c8c01d5-6d9d-47b8-bd9d-8eff870aeff5' :: uuid,
		'36bc1964-c0f1-44ea-9bc4-3a44be7f6796' :: uuid,
		'08:21:00' :: interval,
		'08:22:00' :: interval,
		13,
		NULL,
		15,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'2c8c01d5-6d9d-47b8-bd9d-8eff870aeff5' :: uuid,
		'0298db74-42f6-44e2-9bf3-29914e99a3bd' :: uuid,
		'08:22:00' :: interval,
		'08:23:00' :: interval,
		14,
		NULL,
		15,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'2c8c01d5-6d9d-47b8-bd9d-8eff870aeff5' :: uuid,
		'02ca1202-4f8c-45ac-ae4a-9607a7385bc5' :: uuid,
		'08:24:00' :: interval,
		'08:25:00' :: interval,
		15,
		NULL,
		16,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'2c8c01d5-6d9d-47b8-bd9d-8eff870aeff5' :: uuid,
		'3fef10f7-9c1d-4724-beda-a571064eedaa' :: uuid,
		'08:32:00' :: interval,
		'08:33:00' :: interval,
		16,
		NULL,
		19,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'04efdcd7-3bfc-4ab4-aee0-dbeb0f326bae' :: uuid,
		'f92ebae7-a890-45db-9069-81031ccf2bb6' :: uuid,
		'23:48:00' :: interval,
		'23:49:00' :: interval,
		1,
		NULL,
		0,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'04efdcd7-3bfc-4ab4-aee0-dbeb0f326bae' :: uuid,
		'4d28f5a5-61e0-4978-b623-c2635e4aea77' :: uuid,
		'23:50:00' :: interval,
		'23:51:00' :: interval,
		2,
		NULL,
		1,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'04efdcd7-3bfc-4ab4-aee0-dbeb0f326bae' :: uuid,
		'0f57ded1-eb6d-45d4-a966-6d6da57d0d9e' :: uuid,
		'23:58:00' :: interval,
		'23:59:00' :: interval,
		3,
		NULL,
		5,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'04efdcd7-3bfc-4ab4-aee0-dbeb0f326bae' :: uuid,
		'68a346df-b68b-4949-8158-becb3384f07e' :: uuid,
		'24:00:00' :: interval,
		'24:01:00' :: interval,
		4,
		NULL,
		6,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'04efdcd7-3bfc-4ab4-aee0-dbeb0f326bae' :: uuid,
		'cd3ea1ac-1e8c-4e60-b948-e7ab3f6b9ce0' :: uuid,
		'24:02:00' :: interval,
		'24:03:00' :: interval,
		5,
		NULL,
		7,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'04efdcd7-3bfc-4ab4-aee0-dbeb0f326bae' :: uuid,
		'75efc0b9-2a8c-4704-bdaf-7bea0acc5054' :: uuid,
		'24:04:00' :: interval,
		'24:05:00' :: interval,
		6,
		NULL,
		7,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'04efdcd7-3bfc-4ab4-aee0-dbeb0f326bae' :: uuid,
		'16b98842-b279-4f7d-82bf-97a6dbe941c2' :: uuid,
		'24:06:00' :: interval,
		'24:07:00' :: interval,
		7,
		NULL,
		8,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'04efdcd7-3bfc-4ab4-aee0-dbeb0f326bae' :: uuid,
		'0b131d1c-6da5-4eb1-be85-88a96287651e' :: uuid,
		'24:08:00' :: interval,
		'24:09:00' :: interval,
		8,
		NULL,
		9,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'04efdcd7-3bfc-4ab4-aee0-dbeb0f326bae' :: uuid,
		'caa3cf04-73a1-4ea0-935a-6b17142a2ee3' :: uuid,
		'24:13:00' :: interval,
		'24:14:00' :: interval,
		9,
		NULL,
		12,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'04efdcd7-3bfc-4ab4-aee0-dbeb0f326bae' :: uuid,
		'9216e821-03d2-4ed5-a49d-02211d2b2983' :: uuid,
		'24:16:00' :: interval,
		'24:17:00' :: interval,
		10,
		NULL,
		13,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'04efdcd7-3bfc-4ab4-aee0-dbeb0f326bae' :: uuid,
		'b5cb7197-ab79-4257-960f-cc5797b9fb65' :: uuid,
		'24:19:00' :: interval,
		'24:20:00' :: interval,
		11,
		NULL,
		15,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'04efdcd7-3bfc-4ab4-aee0-dbeb0f326bae' :: uuid,
		'480158dc-cf20-44d7-bb2f-2583701eb039' :: uuid,
		'24:22:00' :: interval,
		'24:23:00' :: interval,
		12,
		NULL,
		16,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'04efdcd7-3bfc-4ab4-aee0-dbeb0f326bae' :: uuid,
		'220ac85e-25fd-4caa-a464-f645b4d70804' :: uuid,
		'24:24:00' :: interval,
		'24:25:00' :: interval,
		13,
		NULL,
		17,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'04efdcd7-3bfc-4ab4-aee0-dbeb0f326bae' :: uuid,
		'6c3a80c7-1ae9-41b2-96bf-0fb4e39db61a' :: uuid,
		'24:29:00' :: interval,
		'24:30:00' :: interval,
		14,
		NULL,
		19,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	),
	(
		'04efdcd7-3bfc-4ab4-aee0-dbeb0f326bae' :: uuid,
		'8dc50edc-df60-432f-a9df-0c5ae961c36e' :: uuid,
		'24:33:00' :: interval,
		'24:34:00' :: interval,
		15,
		NULL,
		20,
		NULL,
		NULL,
		NULL,
		NULL,
		'0' :: timepoint_type
	);

INSERT INTO
	public.rt_alerts (
		id,
		cause,
		effect,
		severity,
		created_at,
		updated_at,
		translation
	)
VALUES
	(
		'34a12509-c622-47a2-b610-e1ca1e71ed46' :: uuid,
		'CONSTRUCTION' :: cause_type,
		'NO_SERVICE' :: effect_type,
		'SEVERE' :: severity_type,
		'2021-10-05 21:19:02.408169+02',
		NULL,
		'alerts.generated'
	);

INSERT INTO
	public.rt_alert_times (alert_id, start_time, end_time)
VALUES
	(
		'34a12509-c622-47a2-b610-e1ca1e71ed46' :: uuid,
		1633461951,
		1636053951
	);

INSERT INTO
	public.rt_alert_entities (
		alert_id,
		agency_id,
		route_id,
		"route_type",
		trip_id,
		stop_id
	)
VALUES
	(
		'34a12509-c622-47a2-b610-e1ca1e71ed46' :: uuid,
		NULL,
		NULL,
		NULL,
		NULL,
		'75efc0b9-2a8c-4704-bdaf-7bea0acc5054' :: uuid
	);