# Deploying to Vercel via GitHub

I have already initialized the local Git repository and committed your code.

## Step 1: Push to GitHub
Since I don't have direct access to your GitHub account, please follow these steps:

1.  Log in to [GitHub.com](https://github.com) and create a **New Repository** (name it `recipe-app` or similar).
2.  **Copy the URL** of your new repository (e.g., `https://github.com/your-username/recipe-app.git`).
3.  Run the following commands in your terminal (I have already done `git init` and `git commit` for you):

    ```bash
    git remote add origin <PASTE_YOUR_REPO_URL_HERE>
    git branch -M main
    git push -u origin main
    ```

## Step 2: Host on Vercel
Once your code is on GitHub:

1.  Go to [Vercel.com](https://vercel.com) and log in.
2.  Click **"Add New..."** -> **"Project"**.
3.  Select **"Import from GitHub"**.
4.  Find your `recipe-app` repository and click **Import**.
5.  Vercel will detect it's a Vite app. Just click **Deploy**.

 Your app will be live in less than a minute!
