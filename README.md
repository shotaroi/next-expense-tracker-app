# 💰 Next Expense Tracker App

A full-stack **Expense Tracker** built with **Next.js 14 (App Router)**, **Prisma**, and **NextAuth** for authentication.
It lets users **sign up, log in, add, edit, delete, and analyze expenses** with secure, persistent storage powered by **PostgreSQL (Neon)**.

https://next-expense-tracker-app.vercel.app/

![Next.js + Prisma + NextAuth](https://skillicons.dev/icons?i=nextjs,ts,prisma,postgres,vercel)

---

## 🚀 Features

✅ **Authentication**
- Secure sign-up and login with hashed passwords via NextAuth + Prisma Adapter
- Session management using JWTs
- Middleware to protect private routes

✅ **Expense Management**
- Create, read, update, and delete (CRUD) expenses
- Linked to the authenticated user
- Real-time updates on the client side

✅ **Analytics Dashbord**
- Visualized spending breakdown by category (using Recharts)
- Total monthly expenses summary

✅ **Clean UI**
- Built wiht Tailwind CSS for a clean, responsive layout
- Simple and intuitive form handling with React hooks

✅ **Deployed & Scalable**
- Fully serverless on **Vercel**
- Database hosted on **Neon (PostgreSQL)**

---

##🧩 Tech Stack

| Layer | Tools |
|-------|-------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Next.js API Routes, Prisma ORM |
| Auth | NextAuth.js with Credentials Provider |
| Database | PostgreSQL (Neon) |
| Deployment | Vercel |
| Charts | Recharts |

---

## 🗂️ Project Structure 

```plaintext
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts           # NextAuth configuration
│   │   ├── expenses/
│   │   │   ├── route.ts               # GET/POST expense APIs
│   │   │   └── [id]/route.ts          # DELETE/PATCH expense APIs
│   │   └── signup/
│   │       └── route.ts               # User registration API
│   │
│   ├── analytics/
│   │   └── page.tsx                   # Charts & insights dashboard
│   │
│   ├── login/
│   │   └── page.tsx                   # Login page
│   │
│   ├── signup/
│   │   └── page.tsx                   # Signup page
│   │
│   ├── page.tsx                       # Main Expense Tracker UI
│   └── layout.tsx                     # Root layout with session provider
│
├── components/
│   └── ExpenseForm.tsx                # Expense creation/edit form
│
├── lib/
│   ├── prisma.ts                      # Prisma client instance
│   └── auth/
│       └── options.ts                 # NextAuth options
│
├── types/
│   └── expense.ts                     # Shared Expense type definition
│
├── middleware.ts                      # Auth route protection middleware
└── prisma/
    └── schema.prisma                  # Prisma schema for models