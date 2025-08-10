# 🚀 UpCoder — Modern AI-Powered Coding Platform

> **By:** Riyaz Ahmad  
> **Date:** June 4, 2025  
> **Version:** 1.0  

UpCoder is a **comprehensive coding platform** that blends **competitive programming**, **interview preparation**, **AI assistance**, and **community-driven learning** into one unified experience.  
Built with a **modern tech stack**, it offers **real-time contests**, **AI-powered help**, **payment integration**, and a powerful **admin panel**.

---

## 📸 Screenshots

> _Add your platform screenshots here for homepage, contest page, problem-solving view, AI assistant, and admin panel._

---

## 📋 Table of Contents
1. [Overview](#-overview)
2. [Core Technology Stack](#-core-technology-stack)
3. [Features](#-features)
4. [Technical Architecture](#-technical-architecture)
5. [Deployment & Infrastructure](#-deployment--infrastructure)
6. [Key Metrics & Performance](#-key-metrics--performance)
7. [Development Workflow](#-development-workflow)
8. [Contribution Areas](#-contribution-areas)
9. [Conclusion](#-conclusion)
10. [License](#-license)

---

## 🌟 Overview

**Purpose:**  
Help developers **master DSA**, **crack interviews**, and **compete globally** in coding challenges.

**Highlights:**
- Competitive programming with **real-time contests**
- AI-powered coding help and **mock interviews**
- Gamification, leaderboards, and streak tracking
- Premium subscription model with **Razorpay integration**
- Rich admin panel for **content & user management**

---

## 🔧 Core Technology Stack

### **Backend**
- ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) **Node.js**
- ![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white) **Express.js**
- ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white) **MongoDB + Mongoose**
- ![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white) **Redis** (Caching & Session)
- ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white) **JWT Authentication**
- ![Cloudinary](https://img.shields.io/badge/Cloudinary-4285F4?logo=cloudinary&logoColor=white) **Cloudinary** (Media Storage)
- ![Razorpay](https://img.shields.io/badge/Razorpay-0C72B8?logo=razorpay&logoColor=white) **Razorpay** (Payments)
- AI: **Google Gemini API**
- Code Execution: **Judge0 API**
- Scheduling: **node-cron**
- File Upload: **Multer**
- Email: **Nodemailer**

### **Frontend**
- ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black) **React.js (Vite)**
- ![Redux](https://img.shields.io/badge/Redux-764ABC?logo=redux&logoColor=white) **Redux Toolkit**
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white) **Tailwind CSS** + **DaisyUI**
- Code Editor: **Monaco Editor**
- Animations: **GSAP**, **Framer Motion**
- Charts: **Recharts**, **React Calendar Heatmap**
- Forms & Validation: **React Hook Form** + **Zod**
- Syntax Highlighting: **Prism.js**, **React Syntax Highlighter**
- Routing: **React Router DOM**
- Notifications: **React Toastify**, **Sonner**

---

## 🎯 Features

### 👤 **User Management**
- Email/Password auth with **JWT**
- Google OAuth login
- Profile customization with Cloudinary uploads
- Role-based access: **User/Admin**
- Problem-solving statistics & streak tracking
- Payment history & premium status display

---

### 💻 **Problem Solving Engine**
- Rich-text problem statements
- **40+ problem tags** (DSA, algorithms, advanced data structures)
- **Multi-language** execution (Python, Java, C++)
- Hidden/visible test cases
- Real-time execution with Judge0 API
- Submission history, runtime, memory usage tracking
- Monaco Editor with syntax highlighting, autocomplete, and themes

---

### 🏆 **Contest System**
- Public & private contests
- Real-time participation tracking
- Automatic scoring based on correctness & speed
- Live leaderboards with Socket.IO
- Cron jobs for contest finalization

---

### 🤖 **AI-Powered Features**
- AI coding assistant for problem-solving help
- AI-generated code explanations
- Voice/text platform navigation
- AI-based mock interviews with real-time feedback
- Resume-based personalized interview questions
- Streaming AI responses with **Google Gemini API**

---

### 📊 **Analytics & Dashboard**
- Problem-solving progress tracking
- GitHub-style activity heatmap
- Streak tracking
- Global ranking system
- Submission history with status breakdown
- Admin analytics for platform statistics

---

### 💬 **Community Features**
- Problem-specific & general discussion forums
- Real-time chat with Socket.IO
- Typing indicators, message threading
- Room-based discussion management

---

### 💳 **Premium Features**
- Subscription tiers: Starter (₹199), Pro (₹499), Ultimate (₹799)
- Unlimited AI usage, exclusive problems, advanced analytics
- Secure payments with Razorpay
- Webhooks for payment status updates

---

### ⚙️ **Admin Panel**
- CRUD for problems & contests
- User role & account management
- Video uploads (Cloudinary)
- Platform analytics & monitoring

---

## 🛠 Technical Architecture

### Database Schemas
- **User Schema:** Auth, profile, progress, premium, payments
- **Problem Schema:** Title, description, tags, difficulty, test cases
- **Submission Schema:** Code, results, scoring
- **Contest Schema:** Info, problems, participants, access
- **Discussion Schema:** Threads, comments, votes

### API Routes
- `/api/user` — Authentication & profile
- `/api/problem` — Problems CRUD
- `/api/submission` — Code submission
- `/api/contest` — Contest management
- `/api/ai` — AI assistant & interviews

### Real-time Events (Socket.IO)
- Chat messages, typing indicators
- Contest updates, leaderboard changes
- Submission results

---

## 🚀 Deployment & Infrastructure
- **Database:** MongoDB Atlas
- **Media:** Cloudinary CDN
- **Cache:** Redis
- **Security:** bcrypt password hashing, CORS, rate limiting, input validation

---

## 📈 Key Metrics & Performance
- Daily Active Users, streaks, contest participation rates
- Redis caching for frequent queries
- MongoDB indexing for speed
- Lazy loading & React.memo optimizations

---

## 🔄 Development Workflow
**Backend:**
```bash
npm start
npm install
