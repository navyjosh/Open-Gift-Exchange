# 📝 Wishlist App

A full-stack Free / Libre Open Source Gift Exchange Suite built with **Next.js 15 App Router**, **Prisma ORM**, **PostgreSQL Backend**, and **Tailwind CSS**.

Users can:

- Create and organize Gift Exchanges
- Send invitation to join a Gift Exchange to an email address
- Create and manage wishlists
- Add, edit, and delete wishlist items (with name, link, price, and notes)
- Use clean keyboard-first UX, including inline entry and context menus

Future goals:
 - Add ability to claim an item on another's wishlist so that it won't be purchased by more than one individual
 - Anonymous messaging of users within a GiftExchange to reach out to them without revealing the "assigned santa"
 - Link items on multiple lists as a single item for claiming
 - Create mobile app?

---

## 🚀 Setting up Dev Environment
These setup instructions are still evolving. These steps will help you set up a development environment for contributing or hacking your own version of this app. If you run into issues, please open an issue or PR — all feedback is welcome!

### 1. Google OAuth
This project currently supports credential authentication through NextAuth as well as Google's OAuth 2.0. Here's a [link to google support page](https://support.google.com/googleapi/answer/6158849?hl=en) on how to set this up. 

### 2. Stand up your PostgreSQL DB
You will need to stand up a database to support the backend of this application. Here's a simple `docker-compose.yml` that will stand one up for dev environment. If you already have one somewhere then you can skip this step, just make sure the database name matches what you have in your .env file.

```yml
# Example docker-compose.yml for a postgres db that will work for this app
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
Then you can launch the container with docker compose:
```bash
docker compose up -d
```

### 3. Clone the Repo
```bash
git clone https://github.com/navyjosh/wishlist.git
```
### 4. Install Required Packages
```bash
cd wishlist \
npm install
```

### 5. Create your .env file
Open `.env.example` and provide the following configuration:
1. **DATABASE_URL**: the PostgreSQL connection string
2. **GOOGLE_CLIENT_ID** & **GOOGLE_CLIENT_SECRET**: You'll get these when you set up your Google Oauth 2.0 provider
3. **NEXT_PUBLIC_GOOGLE_AUTH_ENABLED**: set this to `"true"` if you're using Google Auth
4. **NEXTAUTH_SECRET**: This should be a secure random string. You can generate one like this: `openssl rand -base64 32`
5. Copy it to `.env`:
```bash
cp example.env .env
```

### 6. Generate Prisma schema and push to your db
```bash
npx prisma generate && npx prisma db push
```
### 7. (Optional) Seed the database
Seeding the database will put dummy records great for testing or showcasing bugs or features.
```bash
npx prisma db seed
```
### 8. Start the dev server
```bash
npm run dev 
```

## 📝 License
MIT — [see LICENSE](./LICENSE)
