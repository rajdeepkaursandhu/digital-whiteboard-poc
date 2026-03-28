# 🎨 Digital Whiteboard Sandbox

A fully containerized, interactive digital whiteboard application built with **Next.js**, **Prisma**, **PostgreSQL**, and **Docker**.

## ✨ Features

- **Endless Canvas Sandbox**: Create dynamic widgets anywhere on the screen!
- **Interactive Widgets**: Freeform drag-and-drop mechanics.
  - 📝 **Notes**: Create resizable, stick-style text widgets with built-in color picking.
  - 🖼️ **Images**: Drop in any image from the web instantly via our custom URL input!
  - 💬 **Dynamic Quotes**: AI-like integration! Click the Quote button to fetch today's top phrase from BrainyQuote, automatically bundled with an author photo!
- **SVG Pen Mode** 🖊️: Free-draw paths on a native SVG layer stretching the entire board. Everything connects intelligently underneath your core app!
- **Glassmorphism Interface**: Powered by native vanilla CSS using modern tokens, rendering an immersive frosted-glass HUD experience (including a dynamic built-in clock!).
- **Completely Containerized**: Runs exclusively in Docker without needing any local Node or Postgres installs!

## 📸 Preview

![Dashboard Screenshot](/assets/screenshot.png)

## 🚀 Quick Start
Because this project strictly enforces containerization for maximum portability, all you have to do is initialize Docker!

### Requirements
- Docker & Docker Compose

### Running locally
1. Clone this repository down to your machine.
2. Spin up the application stack:
```bash
docker-compose up -d --build
```
3. Initialize your PostgreSQL schemas! (This command streams straight into the running Docker container!)
```bash
docker-compose exec web npx prisma db push
```
4. Travel over to `http://localhost:3000` and start customizing your interface!

---

*Built dynamically as a sandbox proof of concept exploring Next.js App router edge-cases alongside Prisma persistence mechanics!*
