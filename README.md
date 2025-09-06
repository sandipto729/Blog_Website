# Blog Website

A modern full-stack blog platform built with Next.js, GraphQL, Neo4j, MongoDB, NextAuth.js, and Azure Blob Storage. Features include authentication, profile management, post creation, category/tag filtering, and legal compliance pages.

## Features
- Next.js frontend with attractive styling (SCSS modules)
- GraphQL API (Apollo Server)
- Authentication via NextAuth.js (GitHub, Google)
- Profile management with Azure Blob Storage for image uploads
- Blog post creation and storage in Neo4j (Cypher queries)
- Category and tag filtering
- Legal pages: Privacy Policy, Terms & Conditions, Cookies
- Dashboard for profile updates and session refresh

## Tech Stack
- **Frontend:** Next.js, React, SCSS Modules
- **Backend:** Apollo Server, Next.js API routes
- **Database:** Neo4j (posts), MongoDB (users)
- **Auth:** NextAuth.js
- **Storage:** Azure Blob Storage

## Setup
1. Clone the repo:
	```sh
	git clone https://github.com/sandipto729/Blog_Website.git
	cd Blog_Website/blog
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Configure environment variables in `.env`:
	- MongoDB, Neo4j, NextAuth, Azure credentials
4. Start Neo4j Desktop and ensure your database is running on the correct port (default: 7687).
5. Run the development server:
	```sh
	npm run dev
	```

## Usage
- Sign up or log in with GitHub/Google
- Edit your profile and upload a profile image
- Create, view, and filter blog posts by category or tag
- Access legal pages from the footer

## Folder Structure
- `app/` - Next.js app routes and pages
- `component/` - Reusable React components
- `lib/` - Database and utility libraries
- `model/` - Mongoose models
- `public/` - Static assets
- `blog/` - Main backend and API logic

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
MIT