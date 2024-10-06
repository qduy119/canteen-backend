#!/bin/sh

# Run migrations
npm run migrate:all

# Generate swagger docs
npm run swagger:gen

# Start the application
npm start
