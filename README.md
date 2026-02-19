# SafeDesk - Women Safety & POSH Compliance Platform

SafeDesk is a comprehensive web application designed to ensure women's safety and enforce POSH (Prevention of Sexual Harassment) compliance in workplaces. It provides a secure, anonymous, and efficient channel for reporting incidents, tracking complaints, and managing cases for ```Internal Complaints Committees``` (ICC).

##  Features

### Public / User Features
-   **Anonymous Reporting:** Submit complaints without revealing identity (optional).
-   **Secure Verification:** Users receive a Case ID and a 6-digit PIN to securely access their complaint status later.
-   **Complaint Tracking:** Track the real-time status of complaints using Case ID and PIN.
-   **Communication:** Secure messaging with the ICC/Admin regarding the complaint.
-   **AI Assistance:**
    -   **POSH Guidance Chatbot:** AI chatbot to answer questions related to the POSH Act and ICC procedures.

### ICC / Admin Features
-   **Dashboard:** specialized dashboards for ICC members and Admins to view compliance statistics.
-   **Complaint Management:** View details, evidence, and update status of complaints (Submitted -> Under Review -> Inquiry -> Resolved -> Closed).
-   **Evidence Management:** Securely view and manage evidence files uploaded by complainants.
-   **Member Management:** Admins can add or remove ICC members.
-   **Audit Logs:** Track all actions and status changes for accountability.

##  Tech Stack & Tools

### Frontend
-   **Framework:** [React](https://react.dev/) (Vite)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **State/Form Management:** React Hook Form, Zod
-   **HTTP Client:** Axios
-   **Icons/UI:** React Icons, Framer Motion


### Backend
-   **Runtime:** [Node.js](https://nodejs.org/)
-   **Framework:** [Express.js](https://expressjs.com/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
-   **Authentication:** JWT (JSON Web Tokens), BCrypt.js
-   **File Storage:** Multer 
-   **AI Integration:** Google Generative AI (Gemini)
-   **ML model:** trained ML model for Morph detection
-   **Twillio:** : for emergency SMS notifications with location
-   **Langchain:** for ai chat-bot assistant

## 📡 API Routes

### Authentication (`/api/auth`)
-   `POST /login` - Login for ICC members and Admins.
-   `GET /me` - Get current logged-in user details.

### Complaints (`/api/complaints`)
-   `POST /` - Submit a new complaint (Public).
-   `POST /verify` - Verify Case ID and PIN to access a specific complaint (Public).
-   `GET /:id/messages` - Get secure messages for a complaint (Requires PIN).
-   `POST /:id/messages` - Send a message to ICC/Admin (Requires PIN).
-   `GET /` - List all complaints (ICC/Admin, supports filtering by status/severity).
-   `GET /:id` - Get full details of a specific complaint (ICC/Admin).
-   `PATCH /:id/status` - Update complaint status and internal notes (ICC/Admin).

### Evidence (`/api/evidence`)
-   `POST /:complaintId` - Upload evidence files (Images, Videos, Docs).
-   `GET /:complaintId` - List uploaded evidence for a complaint (ICC/Admin).


### Administration (`/api/admin`)
-   `GET /stats` - Get compliance statistics (Total complaints, status breakdown, severity breakdown).
-   `GET /members` - List all ICC members.
-   `POST /members` - Add a new ICC member/Admin.
-   `DELETE /members/:id` - Remove an ICC member.

---

##  Project Setup from Scratch

### Prerequisites
-   Node.js (v18+ recommended)
-   MongoDB (Local or Atlas URL)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SafeDesk
```

### 2. Backend Setup
Navigate to the server directory and install dependencies.

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<your-db-url>
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10
GEMINI_API_KEY=your_google_gemini_api_key
TWILIO_SID=HJHDJEVCJVYEVCY
TWILIO_AUTH=UETT7T3764RI7B7T7R73TR7
TWILIO_PHONE=TWILIO-PHONE-NUMBER
```

Start the backend server:

```bash
npm run dev
```
*Server will start on `http://localhost:5000`*

### 3. Frontend Setup
Open a new terminal, navigate to the client directory and install dependencies.

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```JS
npm run dev
```
*Client will start on `http://localhost:5173`*

---

##  Deployment Steps (Example)

### 1. Database (MongoDB Atlas)
-   Create a cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
-   Get the connection string and update `MONGODB_URI` in your backend environment variables.

### 2. Backend (Render / Railway / Heroku)
-   Push the `server` folder code to a Git repository.
-   Connect the repository to a hosting service like Render.
-   Set the Build Command: `npm install && npm run build`.
-   Set the Start Command: `npm start`.
-   Add all environment variables from your `.env` file to the hosting platform's environment configuration.

### 3. Frontend (Vercel / Netlify)
-   Push the `client` folder code to a Git repository.
-   Connect the repository to Vercel or Netlify.
-   Set the Build Command: `npm run build`.
-   Set the Output Directory: `dist`.
-   Add the Environment Variable: `VITE_API_URL` pointing to your deployed backend URL.

---

##  License
This project is licensed under the Team ` CodeHeist `
