# 📝 Wishlist App

A full-stack wishlist manager built with **Next.js 14 App Router**, **Prisma**, **PostgreSQL**, and **Tailwind CSS**.

Users can:

- Create and manage wishlists
- Add, edit, and delete wishlist items (with name, link, price, and notes)
- Use clean keyboard-first UX, including inline entry and context menus

Future goals:
 - Publishing your wishlist for use externally via API
 - Setting up a gift exchange secret santa type of thing
 - Email notifications
 - More auth options

---



## 🚀 Getting Started
⚠️ These setup instructions are still evolving. If you run into issues, please open an issue or PR — all feedback is welcome!
### Postgres DB


### Google OAuth
⚠️ Authentication is still in early stages. This project currently is using Google's OAuth 2.0 as its only auth provider. You will need to set this up if you want to use this app as it stands. Feel free to contribute other authentication methods such as e-mail and password. Here's a [link to google support page](https://support.google.com/googleapi/answer/6158849?hl=en) on how to set this up. It only takes a few minutes.

### Environment Variables


### 1. Stand up your PostgreSQL DB
You will need a postgres db up and running to support the backend of this application. Here's a simple `docker-compose.yml` that will stand one up for dev environment.
```yml
services:
  db:
    image: postgres:latest
    container_name: wishlist-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: wishlist_user
      POSTGRES_PASSWORD: wishlist_pass
      POSTGRES_DB: wishlist
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```
Once you've created this file (I recommend creating this outside of the project directory) run the following command:
`docker-compose up -d`

### 2. Clone the Repo
```bash
git clone https://github.com/navyjosh/wishlist.git
```
### 3. Install Required Packages
```bash
cd wishlist \
npm install
```

### 4. Create your .env file
Open `.env.example` and provide the following configuration:
1. **DATABASE_URL**: the PostgreSQL connection string
2. **GOOGLE_CLIENT_ID** & **GOOGLE_CLIENT_SECRET**: You'll get these when you set up your Google Oauth 2.0 provider
3. **NEXTAUTH_SECRET**: This should be a secure random string. You can generate one like this: `openssl rand -base64 32`
4. Copy it to `.env`:
```bash
cp .env.example .env
```

### 5. Migrate schema to your db
```bash
npx prisma migrate dev --name init
```
### 6. (Optional) Seed the database
```bash
npx prisma db seed
```
### 7. Start the dev server
```bash
npm run dev 
```

## 📝 License
MIT — [see LICENSE](./LICENSE)