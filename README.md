# Data Analytics Assistant

Analyze your data with powerful visualizations and AI-powered insights. This application allows users to upload data files (CSV, Excel), view data in tables, generate various visualizations, and gain insights through an integrated chat interface.

## Key Features

*   **File Upload:** Supports CSV and Excel file formats for data input.
*   **Data Table View:** Display uploaded data in a structured, paginated table.
*   **Data Visualization:** Create various chart types to explore data visually.
*   **AI-Powered Insights:** Interact with a chat interface to ask questions about your data and receive insights.
*   **Responsive Design:** Built with modern UI components for a seamless experience across devices.

## Technologies Used

*   **Frontend:**
    *   [React](https://react.dev/)
    *   [Vite](https://vitejs.dev/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [Shadcn UI](https://ui.shadcn.com/) (with Radix UI primitives)
*   **Data Handling & Visualization:**
    *   [Papaparse](https://www.papaparse.com/) (for CSV parsing)
    *   [XLSX (SheetJS)](https://sheetjs.com/) (for Excel parsing)
    *   [Recharts](https://recharts.org/) (for charts)
*   **Routing & State Management:**
    *   [React Router DOM](https://reactrouter.com/)
    *   [@tanstack/react-query](https://tanstack.com/query/latest)

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```
    *(Replace `<repository_url>` with the actual URL of this repository and `<repository_directory>` with the name of the cloned folder.)*
2.  **Install dependencies:**
    This project uses npm for package management.
    ```bash
    npm install
    ```
    *(If you use Yarn or PNPM, you might need to adjust this step, e.g., `yarn install` or `pnpm install`)*

## Running the Application

*   **Development Server:**
    To start the development server, run:
    ```bash
    npm run dev
    ```
    This will typically open the application in your default browser at `http://localhost:5173` (Vite's default port, may vary).

*   **Production Build:**
    To create a production-ready build, run:
    ```bash
    npm run build
    ```
    The output files will be generated in the `dist` directory.

*   **Preview Production Build:**
    To preview the production build locally, run:
    ```bash
    npm run preview
    ```

*   **Linting:**
    To check the code for linting issues, run:
    ```bash
    npm run lint
    ```

## Project Structure

A brief overview of the main directories:

*   `public/`: Contains static assets like `favicon.ico`, `index.html`.
*   `src/`: Contains the core application code.
    *   `components/`: Reusable React components.
        *   `ui/`: Shadcn UI components.
        *   `chat/`: Components related to the chat interface.
    *   `hooks/`: Custom React hooks.
    *   `lib/`: Utility functions and libraries.
    *   `pages/`: Top-level page components (e.g., `Index.tsx`, `NotFound.tsx`).
    *   `utils/`: Utility functions for specific tasks like data analysis, file processing.
    *   `App.tsx`: Main application component, sets up routing and providers.
    *   `main.tsx`: Entry point of the application.
*   `vite.config.ts`: Configuration for Vite.
*   `tailwind.config.ts`: Configuration for Tailwind CSS.
*   `package.json`: Lists project dependencies and scripts.

---

This README provides a basic guide to the Data Analytics Assistant.
```
