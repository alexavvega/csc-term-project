## CSC Term Project – Vintage Video Game E-Commerce Site

Team Members: Alexa, Hensley, Jayden
Project: A vintage video game e-commerce website that allows users to browse, purchase, and learn about older video games in a safe and secure online environment.

🕹️ Overview
This project was developed as part of our Computer Science term project. The goal was to build a full-stack web application for selling vintage video games. The website includes:

Product listings

Shopping cart functionality

User login/registration

Secure purchase handling

Persistent data storage using SQLite

🚀 Getting Started
To run the project locally, follow these steps:

1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/alexavvega/csc-term-project.git
cd csc-term-project
2. Install Dependencies
Run the following command to install all required Node.js packages:

bash
Copy
Edit
npm install
3. Create the SQLite Database
Because we rushed this part of the setup, you'll need to manually create the data/ folder and the empty SQLite database file before running the app:

bash
Copy
Edit
mkdir -p data
touch data/database.sqlite
4. Start the Server
bash
Copy
Edit
nodemon server.js
Visit http://localhost:3000 in your browser to use the site.

📦 Technologies Used
Node.js

Express.js

SQLite3

HTML/CSS/JavaScript

bcrypt (for password hashing)

📌 Notes
No real payment system is connected — this is a simulated e-commerce site for demonstration purposes only.

User authentication is implemented with hashed passwords and session handling.

✅ Future Improvements
Admin panel for managing products

Real payment gateway (e.g., Stripe)

Product search and filters

Responsive design improvements

📄 License
This project is for educational purposes only.
