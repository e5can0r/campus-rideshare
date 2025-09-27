# 🚗 Campus RideShare

Campus RideShare is a MERN-based web application that helps students coordinate shared rides (auto, cab, train, etc.) when traveling back to campus after vacations.  
It includes ride posting, joining, chat, and contact sharing to make travel safer and more convenient.

---

## ✨ Features

- 🔑 **Authentication**: Secure login/signup with JWT  
- 📝 **Create Rides**: Post ride details (origin, date, mode, notes, contact number)  
- 🔍 **Browse & Filter**: Search rides by city, date, or mode of transport  
- 🤝 **Join Rides**: Request to join and notify the creator automatically  
- 💬 **In-app Chat**: Real-time messaging between participants  
- 📱 **Contact Sharing**: Optionally share phone number for easier coordination  
- 👤 **Profile Page**: Manage created rides, joined rides, and logout  
- 🎨 **Modern UI**: Built with React + Tailwind for a clean responsive design  

---

## 🛠️ Tech Stack

### **Frontend**
- React + Vite  
- React Router  
- Tailwind CSS  
- Socket.IO client  

### **Backend**
- Node.js + Express  
- MongoDB + Mongoose  
- JWT Authentication  
- Socket.IO server  

### **Deployment**
- Frontend → Vercel  
- Backend → Vercel  
- Database → MongoDB Atlas  

---

## ⚙️ Installation & Setup

### 1. Clone the repository
``` bash
git clone https://github.com/your-username/campus-rideshare.git
cd campus-rideshare
```

### 2. Setup backend
``` bash
cd server
npm install
```
create a .env file in server/:
``` env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
Run the Backend:
``` bash
npm start
```

### 3. Setup frontend
``` bash
cd ../client
npm install
```
create a .env file in server/:
``` env
VITE_API_BASE_URL=http://localhost:5000

```
Run the Backend:
``` bash
npm run dev
```
## Project Structure
## 📂 Project Structure

```plaintext
client/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.css
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── README.md
    ├── tailwind.config.js
    ├── vercel.json
    └── vite.config.js

server/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── utils/
    ├── package.json
    └── server.js

.gitignore
```
## 🤝 Contributing

Contributions are welcome!  
If you'd like to contribute:  
1. Fork this repository  
2. Create a new branch (`git checkout -b feature-branch`)  
3. Commit your changes (`git commit -m 'Add new feature'`)  
4. Push to your branch (`git push origin feature-branch`)  
5. Open a Pull Request  

---

## 📜 License

This project is licensed under the **MIT License**.  
You are free to use, modify, and distribute this project, provided that proper credit is given. 
