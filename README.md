 Next.js Frontend Setup Instructions
 
3.1 Ensure Backend laravel Is Running

Make sure the Laravel backend is running before starting the frontend:

php artisan serve

3.2 Pull Frontend Code

Pull the latest frontend code from the Git repository.

3.3 Install Frontend Dependencies

Navigate to the frontend project directory and run:

run command npm install

3.4 Run Next.js Development Server

Start the frontend development server:

 run command npm run dev
 
3.5 Frontend Environment Variables (.env)

Create a .env file in the root of the Next.js project with the following value:

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
