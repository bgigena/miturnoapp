# Setup Guide: GitHub Self-Hosted Runner for Local Deployment

To allow GitHub Actions to deploy directly to your computer (Docker Desktop), you need to install the GitHub Actions "Runner" agent.

## Prerequisites

1.  **Docker Desktop** must be installed and running.
2.  **PowerShell** (standard on Windows).

## Installation Steps

1.  **Go to Repository Settings**:
    *   Navigate to your repository on GitHub.
    *   Click **Settings** tab.
    *   On the left sidebar, click **Actions** -> **Runners**.
    *   Click the green **New self-hosted runner** button.

2.  **Select Image**:
    *   Choose **Windows**.
    *   Architecture: **x64**.

3.  **Run Installation Commands**:
    *   Open PowerShell as an Administrator.
    *   Run the commands provided by GitHub in the "Download" and "Configure" sections.
    *   *Note*: When asked for tags during configuration, just press Enter (default).
    *   *Note*: When asked for the Runner name, you can call it `my-laptop-runner`.

4.  **Start the Runner**:
    *   It's recommended to run it as a service so it stays on.
    *   After configuration, run:
        ```powershell
        ./svc.cmd install
        ./svc.cmd start
        ```
    *   If you just want to run it temporarily, you can use `./run.cmd`.

5.  **Verify**:
    *   Go back to the **Actions -> Runners** page on GitHub.
    *   You should see your runner listed with a green status "Idle".

## How to Deploy

1.  Go to the **Actions** tab in your repository.
2.  Select **"Deploy to Local Docker Desktop"** on the left.
3.  Click **Run workflow**.
4.  Select the branch you want to test.
5.  Click the green **Run workflow** button.

The action will pick up the job, git pull the code to your machine, and run `docker compose up`.
