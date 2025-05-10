# Mission & Leave Management System - Frontend

This is the frontend application for the Mission & Leave Management System, built with React, TypeScript, and Tailwind CSS.

## Features

- Modern React with TypeScript
- Tailwind CSS for styling
- Redux Toolkit for state management
- React Query for data fetching
- Protected routes with authentication
- Responsive design
- Mission request management
- Leave request management

## Prerequisites

- Node.js 16+
- npm 7+

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_API_URL=http://localhost:8000/api
   VITE_APP_NAME="Mission & Leave Management System"
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:3000.

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── services/      # API services
├── store/         # Redux store and slices
└── types/         # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License.
