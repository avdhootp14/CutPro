<div align="center">
  <img src="./client/public/images/premium_salon_hero.png" alt="CutPro Logo" width="100%" />
  
  # CutPro ✂️

  **The Elite Grooming Network & Salon SaaS Platform**

  [![React](https://img.shields.io/badge/React-19.x-blue.svg?style=flat&logo=react)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-Backend-green.svg?style=flat&logo=node.js)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Database-success.svg?style=flat&logo=mongodb)](https://www.mongodb.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
</div>

<br />

## 🌟 Introduction

**CutPro** is a modern, premium SaaS platform built to empower barbershops, salons, and grooming studios. It provides an all-in-one digital booking platform for businesses and an elite directory for customers to discover top-tier stylists in their area.

Whether you're a salon owner looking to streamline your operations or a customer wanting a seamless booking experience, CutPro bridges the gap with a state-of-the-art interface and powerful backend.

## ✨ Key Features

### For Salons & Barbers (Partners)
- **Digital Storefront**: Automatically generate a dedicated booking page for your salon (e.g., `cutpro.com/your-salon`).
- **Admin Dashboard**: Manage appointments, track revenue, and monitor shop analytics.
- **Service & Offer Management**: Dynamically add services, update pricing, and launch promotional discounts.
- **Team Management**: Add barbers to your team, assign services, and manage their availability.
- **Payment Integration**: Secure online payment collection via **Razorpay** or cash-at-salon options.

### For Customers
- **Global Directory**: Search and filter salons by country, state, city, or direct search query.
- **Seamless Booking**: Easy 3-step booking process (Select Services -> Choose Barber & Time -> Confirm & Pay).
- **Personalized Experience**: Track upcoming appointments and manage booking history.

---

## 🛠 Tech Stack

**Frontend (Client)**
- React 19 (TypeScript)
- Vite (Build Tool)
- Tailwind CSS (Styling & Animations)
- React Router v7 (Navigation)
- Axios (HTTP Client)
- Lucide React (Icons)
- Razorpay Web SDK (Payments)

**Backend (Server)**
- Node.js & Express.js
- MongoDB & Mongoose (Database & ODM)
- JSON Web Tokens (JWT) & bcrypt (Authentication)
- Razorpay Node SDK (Payment Verification)
- Nodemailer (Email Notifications)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v20+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/avdhootp14/CutPro.git
   cd CutPro
   ```

2. **Setup the Backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and configure the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cutpro
   JWT_SECRET=your_jwt_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   # Email configuration for Nodemailer
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

3. **Setup the Frontend**
   Open a new terminal window:
   ```bash
   cd client
   npm install
   ```

4. **Run the Application**
   - **Start Backend server** (from `server` directory):
     ```bash
     npm run dev
     ```
   - **Start Frontend app** (from `client` directory):
     ```bash
     npm run dev
     ```
   
   The application will be running at `http://localhost:5173`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check [issues page](https://github.com/avdhootp14/CutPro/issues) if you want to contribute.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

<div align="center">
  <i>Built with passion to elevate the grooming industry.</i>
</div>
