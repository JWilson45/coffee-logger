# Coffee Logger ☕

A personal coffee brewing log built with [Next.js](https://nextjs.org), [Turbopack](https://turbo.build/pack), [Tailwind CSS](https://tailwindcss.com), and [Prisma](https://www.prisma.io) using a local SQLite database.

This app helps you track, analyze, and improve your coffee brewing by recording detailed entries including coffee name, roaster, process, brew time, water temp, and tasting notes.

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Set Up the Database

Generate the Prisma client:

```bash
npx prisma generate
```

Then apply the database schema and create your SQLite database:

```bash
npx prisma migrate dev --name init
```

### 3. Run the Dev Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start logging your brews.

---

## 🔧 Tech Stack

- **Next.js 15** with App Router
- **Turbopack** for fast bundling
- **Tailwind CSS** for styling
- **Prisma** ORM with **SQLite**
- **Bun** runtime

---

## 📂 Project Structure

- `src/app/brews/` – All pages related to brew viewing and logging
- `src/app/api/brews/` – API routes for data persistence
- `prisma/schema.prisma` – Your data model
- `dev.db` – Your local SQLite database (ignored from Git)

---

## 📦 Deployment

To deploy this app, you'll need to swap out SQLite for a server-based database like PostgreSQL or MySQL.

Read the [Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying) and [Prisma Production Guide](https://www.prisma.io/docs/guides/deployment) for more info.

---

## 💡 Future Ideas

- Add user auth
- Brew analytics and scoring charts
- Export to CSV
- Mobile-friendly PWA

---

Happy Brewing! ☕
