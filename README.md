# Real-time NBA Analytics App

An innovative NBA analytics application featuring **AI commentary**, **live score tracking**, and a (very unscientific) **win probability over time**. Built with Next.js, it utilizes SingleStore for real-time data analytics and the LLaVa 1.5 multimodal model hosted on Groq for millisecond latency inference.

## Features

- **AI Commentary**: Real-time AI-generated insights on games and player performances.
- **Live Score Tracking**: Up-to-the-second scores and stats from ongoing NBA games.
- **Win Probability Over Time**: Visual representation of each team's chance to win as the game progresses.

## Prerequisites

- **Node.js**: Version 14 or higher.
- **npm or Yarn**: For dependency management.
- **SingleStore Account**: For real-time analytics.
- **Groq API Key**: Access to the LLaVa 1.5 model.
- **OpenAI API Key**: For additional AI functionalities.

# Installation

```
npm install
```

# SingleStore Connection Details
DATABASE_HOST=your-singlestore-host
DATABASE_USERNAME=your-singlestore-username
DATABASE_PASSWORD=your-singlestore-password
DATABASE_NAME=your-singlestore-database-name

# Groq API Key
GROQ_API_KEY=your-groq-api-key

# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key

# Running the project

```
npm run dev
```

You can access the project at `localhost:3001`
