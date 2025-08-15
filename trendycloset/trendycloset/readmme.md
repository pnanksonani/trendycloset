bash
cat > README.md << 'EOF'
# TrendyCloset

A simple commercial web app where **partners** list clothing products and **users** can browse, add to **cart**, and place **orders**. Partners confirm orders; users receive **in-app notifications** and an **email receipt**.

##  Features

- Email **OTP** verification at signup  
- **Captcha** on login (tiny math challenge)  
- **JWT access token** in an httpOnly cookie  
- Roles: **USER** and **PARTNER** (role-based routing & API guards)  
- Products: partners create/edit; public listing for users  
- Cart: add/update/remove; server builds orders from cart  
- Orders: per-partner orders; partner confirms; stock decrements  
- Notifications: in-app (read/read-all) + email receipt  
- Clean React UI with protected routes

##  Tech Stack

- **Frontend:** React (Vite), React Router, Context API  
- **Backend:** Node.js, Express, Mongoose  
- **DB:** MongoDB (Atlas or local)  
- **Email:** Nodemailer (Gmail App Password)  
- **Auth:** jsonwebtoken (JWT), bcryptjs  
- **Validation:** Zod  
- **Dev tools:** Nodemon, dotenv

---

## 🗂 Project Layout



trendycloset/
├─ backend/
│  ├─ server.js
│  └─ src/
│     ├─ app.js
│     ├─ routes/\*      # auth, products, user, partner, notifications
│     ├─ controllers/\* # auth, product, cart, order, notification
│     ├─ models/\*      # User, Product, Cart, Order, Notification
│     ├─ middlewares/\* # requireAuth, requireRole, rateLimit, errorHandler
│     └─ utils/\*       # jwt, captchaToken, password, otp, mailer
└─ frontend/
├─ index.html
└─ src/
├─ main.jsx
├─ App.jsx
├─ api/client.js
├─ context/AuthContext.jsx
├─ routes/ProtectedRoute.jsx
├─ components/\*  # Navbar, ProductCard, QuantityInput, inputs, Captcha
└─ pages/\*       # Landing, Login, Signup\*, VerifyOtp, Products, Cart, OrdersUser, PartnerProducts, PartnerOrders, Dashboards

`

---

##  Quick Start

### Prerequisites
- Node.js 18+  
- MongoDB connection string  
- Gmail account + App Password

### 1) Backend

bash
cd backend
npm install
`

Create `.env`:

env
PORT=5050
MONGO_URI=<your_mongo_uri>
CLIENT_ORIGIN=http://localhost:3000

JWT_ACCESS_SECRET=<random>
ACCESS_TOKEN_TTL=45m

JWT_CAPTCHA_SECRET=<random>
OTP_TTL_MINUTES=10

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=you@gmail.com
SMTP_PASS=<16-char-app-password>
MAIL_FROM="TrendyCloset <you@gmail.com>"


Run:

bash
npm run dev


### 2) Frontend

bash
cd ../frontend
npm install


Create `.env`:

env
VITE_API_BASE=http://localhost:5173/api


Run:

bash
npm run dev


Open [http://localhost:3000](http://localhost:3000).

---

##  Auth Flow

1. **Register**: POST `/auth/register` → OTP emailed
2. **Verify OTP**: POST `/auth/verify-otp` → emailVerified
3. **Login**: GET `/auth/captcha` → solve and POST `/auth/login` → httpOnly cookie
4. **Hydrate**: GET `/auth/me` → `{ username, role }`
5. **Protected**: use middleware and frontend guards

---

##  API Summary

All routes under `/api`:

* **Auth** (`/auth`): captcha, register, verify-otp, resend-otp, login, logout, me
* **Products** (`/products`): public list
* **User** (`/user` — USER role): cart CRUD, place orders, list orders
* **Partner** (`/partner` — PARTNER role): manage products, view/confirm orders
* **Notifications** (`/notifications`): list, mark read, mark all read

---

## 🗄 Data Models

* **User**: { name, email, dob, passwordHash, role, emailVerified, otpHash, otpExpiresAt }
* **Product**: { partner, title, description, price, stock, imageUrl, active }
* **Cart**: { user, items:\[{ product, qty }] }
* **Order**: { user, partner, items:\[{ product, title, priceAtPurchase, qty, subtotal }], total, status, confirmedAt }
* **Notification**: { user, type, message, read, createdAt }

---

## 🛡 Security

* JWT in **httpOnly cookie**
* Short token TTL
* Captcha + rate limiting
* Hashed passwords & OTPs
* Enable HTTPS in production