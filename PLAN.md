# 🎯 Frontend Development Guide — Screens & Playlists System

## 🧠 Context

You are building the **frontend** for **Assignment 1 – Screens & Playlists System**.

The backend is an **Express + MongoDB API** that provides authentication, screens, and playlists management endpoints.  
Your goal is to implement the frontend using a modern, type-safe stack.

---

## 🛠 Tech Stack

- **TanStack Start** (React framework)
- **TanStack Query** — for fetching & caching
- **TanStack Table** — for data display
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** — for accessible, consistent UI components

---

## 🗂 App Structure Overview

You will implement the following primary routes:

- `/login` — user authentication
- `/screens` — manage and view screens
- `/playlists` — manage and view playlists

---

## 🔗 API Shapes and Expected Responses

### 1. Authentication

**POST /auth/login**

**Request**
{
"email": "admin@example.com",
"password": "password123"
}

**200 Response**
{
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"\_id": "6651f6e1c0e7a2b3dcdcf8a1",
"name": "Admin User",
"email": "admin@example.com",
"role": "ADMIN"
}
}

**401 Response**
{
"error": "Invalid credentials"
}

---

### 2. Screens

**GET /screens?search=&page=&limit=**

**Query Parameters**

- `search` — optional, case-insensitive
- `page` — integer (default: 1)
- `limit` — integer (default: 10)

**200 Response**
{
"data": [
{ "_id": "6651f7f2e2e9a3c4dcdc3211", "name": "Lobby Screen", "isActive": true },
{ "_id": "6651f80ae2e9a3c4dcdc3212", "name": "Conference Display", "isActive": false }
],
"pagination": {
"page": 1,
"limit": 10,
"total": 2
}
}

**401 Response**
{
"error": "Unauthorized or invalid token"
}

---

**PUT /screens/:id**

**Request**
{
"isActive": false
}

**200 Response**
{
"message": "Screen status updated successfully",
"screen": {
"\_id": "6651f7f2e2e9a3c4dcdc3211",
"name": "Lobby Screen",
"isActive": false
}
}

**401 Response**
{
"error": "Not authorized or missing token"
}

---

### 3. Playlists

**GET /playlists?search=&page=&limit=**

**200 Response**
{
"data": [
{ "_id": "6651f9d9e2e9a3c4dcdc3411", "name": "Morning Playlist", "itemCount": 5 },
{ "_id": "6651fa21e2e9a3c4dcdc3412", "name": "Evening Playlist", "itemCount": 8 }
],
"pagination": {
"page": 1,
"limit": 10,
"total": 2
}
}

**401 Response**
{
"error": "Unauthorized or invalid token"
}

---

**POST /playlists**

**Request**
{
"name": "Holiday Specials",
"itemUrls": [
"https://example.com/video1.mp4",
"https://example.com/video2.mp4"
]
}

**200 Response**
{
"message": "Playlist created successfully",
"playlist": {
"\_id": "6651fae5e2e9a3c4dcdc3413",
"name": "Holiday Specials",
"itemCount": 2
}
}

**401 Response**
{
"error": "Unauthorized or invalid token"
}

---

## 🧩 Functional Requirements

### 1. Login Page

- Form with email and password fields.
- On submit:
  - Call `POST /auth/login`.
  - Store JWT in localStorage or an encrypted cookie.
  - Redirect to `/screens` on success.
- Show inline validation and error messages for invalid credentials.

---

### 2. Screens Page

- Fetch screens list using TanStack Query from `/screens`.
- Display in a TanStack Table with:
  - Pagination
  - Search bar (case-insensitive)
- Include toggle for `isActive`:
  - Use optimistic update and rollback on failure.
- Show loading spinners and error messages.
- Ensure 401 triggers logout and redirect to `/login`.

---

### 3. Playlists Page

- Form for new playlist creation:
  - Input: `name` (required)
  - Textarea: one URL per line (optional, max 10)
- On submit, call `POST /playlists`.
- Show success toast or inline message on creation.
- Fetch playlists from `/playlists` and display list:
  - Columns: name, itemCount.
- Handle validation errors, loading, and pagination.

---

## 💅 UI & UX Guidelines

- Use **shadcn/ui** components (Button, Input, Table, Dialog, Toast, Alert, etc.).
- Style and layout with **Tailwind CSS**.
- Provide:
  - Loading skeletons for async views.
  - Toasts for success/error feedback.
  - Inline validation errors for forms.
- Maintain **keyboard accessibility** and ARIA-compliant labels.

---

## 🧠 State Management & Architecture

- Use **TanStack Router** for navigation (`/login`, `/screens`, `/playlists`).
- Manage API data using **TanStack Query** hooks.
- Implement an **auth context** to store and expose JWT + user info.
- Add a query middleware or Axios interceptor to attach `Authorization` headers.
- Global error handling:
  - On 401, clear session and redirect to `/login`.

---

## 🔐 Security Practices

- Store JWT securely (HttpOnly cookie or encrypted localStorage).
- Attach token via `Authorization: Bearer <token>` header on every API call.
- Sanitize all form inputs.
- Protect against XSS via React defaults and CSP if applicable.

---

## 🧪 Developer Experience

- Store backend URL in `.env` (`VITE_API_BASE_URL` or equivalent).
- Use MSW (Mock Service Worker) or mock JSON data for local dev.
- Include TypeScript interfaces for:
  - `User`
  - `Screen`
  - `Playlist`
  - `PaginatedResponse`
- Optionally add Jest or Vitest for unit testing hooks and API utils.

---

## 🚀 Expected Output When Generating Code

When generating code, the assistant should produce:

1. Suggested folder structure for `/src` (routes, components, hooks, utils).
2. Example React components for each page (`Login`, `Screens`, `Playlists`).
3. Example shared UI components using shadcn/ui.
4. React Query hooks (`useAuth`, `useScreens`, `usePlaylists`).
5. API client wrapper (`api.ts`) with token injection and 401 handling.
6. Example optimistic update implementation for toggling screen status.
7. Routing setup with TanStack Router.

---

## 💬 Coding Style Guidelines

- Remove any demo / boilerplate code if neccessary.
- Idiomatic React + TypeScript.
- Functional components with hooks.
- Favor composition over monolithic components.
- Clean, readable code with meaningful names.
- Inline comments explaining reasoning where non-trivial.
- Strict TypeScript types — no `any`.
- Consistent Tailwind utility usage and shadcn/ui styling.

---

## 🟢 Progress Summary

- .env setup
- TypeScript interfaces
- API client (auth/screens/playlists)
- Auth context
- shadcn/ui components via CLI
- Login page
- Screens page (table, toggle, search, pagination)
- Playlists page (form, list, pagination)
- Routing (TanStack Router)
- Demo code removed
- Mock API routes (in-memory, JWT for login)
- End-to-end working frontend

---
