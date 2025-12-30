# Deploying the Recipe App

Since this is a static React application (built with Vite), deployment is very simple. I have already generated the production build for you in the `dist` folder.

Here are the 3 easiest ways to deploy:

## Option 1: Netlify Drop (Easiest - No Tools Required)
1.  Locate the folder: `c:\Users\Hassan Ahmed\Antigravity workplace\recipe-app\dist`
2.  Go to [Netlify Drop](https://app.netlify.com/drop).
3.  **Drag and drop** the `dist` folder directly onto the page.
4.  Your site will be live instantly!

## Option 2: Vercel (Recommended for Best Performance)
If you have a GitHub account:
1.  Push this code to a new GitHub repository.
2.  Go to [Vercel.com](https://vercel.com) and log in.
3.  Click **"Add New..."** -> **"Project"**.
4.  Select your repository.
5.  Framework Preset should auto-detect as **Vite**.
6.  Click **Deploy**.

## Option 3: Local Preview
To test the production build locally before deploying:
1.  Run `npm run preview` in your terminal.
2.  It will serve the `dist` folder at `http://localhost:4173`.
