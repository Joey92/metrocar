# MetroCar

## Introduction

Welcome to the code behind metrocar.org, now open-sourced! This project, once a private, has been made public to welcome contributions and foster collaboration. In transitioning to open source, we've reset the git history for a fresh start. As such, documentation may lag behind due to its prior private status. Our journey has seen many learning curves, especially around Next.js, and design choices that reflect a period of rapid development. Yet, MetroCar stands as a testament to perseverance, marking the furthest point I've reached in a project, and I'm eager to see it grow beyond its current state.

## Vision

MetroCar aims to revolutionize private trips by offering a GTFS (General Transit Feed Specification) file for public access, making private trips searchable and exchangeable at conveniently located stops. This concept bridges the gap between private and public transport, enhancing accessibility and efficiency.

## Getting Started

To set up MetroCar on a new machine, follow these initial steps:

1. **Hosts File Entry**: Add the following to your `/etc/hosts` file to enable local domain resolution:
   ```
   127.0.0.1 metrocar.localhost api.metrocar.localhost backend.metrocar.localhost
   ```

2. **Installation and Setup**: Execute the below commands to prepare your environment. This includes installing dependencies, setting up Docker containers, and configuring the database. Detailed steps are provided to guide you through initial setup, database migrations, and service initialization for local development.

   ```sh
   yarn
   cd backend
   npm install
   cd ..

   # This will download OTP and map data for berlin and brandenburg for local development
   # You can change your desired map of course!
   ./setup.sh
   docker-compose build # this will take some time

   docker-compose up -d postgres ingress

   # Apply our database snapshot, like migrations
   # If this does not work it might be that the database did not start up in time
   # run this again:
   # docker-compose restart directus
   docker-compose run --rm directus npx directus schema apply /uploads/snapshot.yaml
   docker-compose up -d directus

   # You might need to create a user on directus
   ROLE=$(docker-compose run --rm directus npx directus roles create --role admin --admin true)
   docker-compose run --rm directus npx directus users create --email admin@example.com --password test --role $ROLE

   # if you want to use the search and create-trip features are metrocar you need
   # to also start otp and graphhopper:
   # docker-compose up -d otp graphhopper
   # But most of the time it's not necessary to start otp and graphhopper because they really eat ram

   # Now lets set up our address autocomplete / reverse geocoding

   # wait until nominatim finishes with the download and bootstrapping and then just exit with ctrl+c
   # this can take a very long time, 1 hour on a macbook pro 2020
   docker-compose up nominatim
   # It's done when you see this after some time:
   # LOG:  database system is ready to accept connections

   # After thats's done, start nominatim again in the background.
   # No worries, it does not need to initialise anymore
   docker-compose up -d nominatim

   # This starts photon, our reverse geocoder. For it to get data, it needs to connect to
   # nominatim to fill its elastic search index
   # This is a one-time command to sync with nominatim
   # This takes 15 mins on 2020 macbook pro
   docker-compose run --rm -e "EXTRA_FLAG=-nominatim-import" photon

   # In the meantime you can log in to the admin panel at http://api.metrocar.localhost/admin
   # Log in with the "admin@example.com" / "test" account and have a look around
   # Go to your user profile and add an auth token to the admin account
   # Save that token and add it to backend.env
   # DIRECTUS_USER_TOKEN: <Your token here>
   # and frontend.env
   # INTERNAL_BACKEND_USER_TOKEN: <Your token here>


   # Now you can start everything without any initialisation
   docker-compose up -d
   ```

   Complete instructions are available within the setup script to ensure a smooth initial configuration and to start all necessary services.

## Services Overview

MetroCar is built on a microservices architecture, comprising several key components:

- **Directus**: Manages database schema, provides an admin panel, handles CRUD API calls, user accounts, and permissions.
- **Backend**: Adds business logic, manages GTFS data, and enhances search results with user information.
- **Frontend**: Developed with Next.js, React, Redux, and Bootstrap, this service delivers the user interface.
- **Mapping and Geocoding Services**: Includes Graphhopper, OTP2, and Nominatim for routing, search engine functionality, and reverse geocoding.

Development guides for each component are provided to facilitate contributions and feature enhancements.

## Future Directions

As we look to the future, several enhancements are planned to elevate MetroCar to its next version:

- Revamped UI for an improved user experience.
- A dedicated driver app for real-time trip updates.
- Integration of Next.js app router for streamlined navigation.
- Consolidation of services under the Next.js application to simplify architecture.
- Refined data model to shift away from traditional public transit paradigms.
- Transition from Directus to PostgREST for database interactions.

Your contributions and feedback are invaluable as we strive to make MetroCar more robust, user-friendly, and innovative. Join us in driving MetroCar forward!

## Contributing

We welcome contributions of all forms. Please see our contributing guide for more details on how to get involved, propose changes, or report issues.

## License

MetroCar is released under the [GPLv3](/LICENSE), supporting open and collaborative development. 
