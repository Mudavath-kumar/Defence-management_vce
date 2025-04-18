# Defence Management System

A comprehensive system for tracking and managing military assets, personnel, and operations.

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or Atlas)

### Setup

1. Clone the repository
2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
3. Create a `.env.local` file based on `.env.local.example` and add your MongoDB connection string:
   \`\`\`
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/defence-system?retryWrites=true&w=majority
   \`\`\`

4. Run the development server:
   \`\`\`
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- Weapons inventory management with check-in/check-out functionality
- Vehicle fleet management with deployment tracking
- Activity logging for all operations
- Real-time dashboard with key metrics
- MongoDB integration for data persistence

## Database Structure

The system uses MongoDB with the following collections:

- `weapons`: Stores all weapon information
- `vehicles`: Stores all vehicle information
- `activities`: Logs all check-in/check-out and deployment activities

## Environment Variables

- `MONGODB_URI`: MongoDB connection string

## License

This project is licensed under the MIT License
