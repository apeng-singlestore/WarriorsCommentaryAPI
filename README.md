Prerequisites
Node.js: Version 14 or higher.
npm or Yarn: For dependency management.
SingleStore Account: For real-time analytics.
Groq API Key: Access to the LLaVa 1.5 model.
OpenAI API Key: For additional AI functionalities.
Installation
Clone the Repository

bash
Copy code
git clone https://github.com/yourusername/nba-analytics-app.git
cd nba-analytics-app
Install Dependencies

bash
Copy code
npm install
Configuration
Create a .env.local file in the project's root directory and add your credentials:

env
Copy code
# SingleStore Connection Details
DATABASE_HOST=your-singlestore-host
DATABASE_USERNAME=your-singlestore-username
DATABASE_PASSWORD=your-singlestore-password
DATABASE_NAME=your-singlestore-db-name

# Groq API Key
GROQ_API_KEY=your-groq-api-key

# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key
Note: Replace the placeholder values with your actual credentials.

Running the Application
Start the development server with:

bash
Copy code
npm run dev
Access the app at http://localhost:3001.