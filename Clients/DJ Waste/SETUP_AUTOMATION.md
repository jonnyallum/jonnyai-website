
# 🚀 Automated Deployment Setup

**Owen Stinger** has prepared the automation. Follow these steps to enable "God-Tier" automated deployments.

## 1. Hostinger Setup (One-time)
1. Log in to **Hostinger hPanel**.
2. Go to **Advanced** -> **SSH Access**.
3. **Enable SSH Access** if it's disabled.
4. Note your **SSH Port** (likely `65002`) and **IP Address** (`92.112.189.250`).
5. Scroll down to **SSH Keys** and click **Add SSH Key**.
6. Paste this **Public Key** content:
    ```text
    ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFs2ffiZfi5+UA+LiTLt3pGjkBqO70tEz4mBYnsOhT8w jonny@Jonny-Allum
    ```

## 2. GitHub Secrets Setup
1. Go to your GitHub Repository: `https://github.com/jonnyallum/dj-waste.co.uk`
2. Settings -> **Secrets and variables** -> **Actions**.
3. Click **New repository secret**.
4. Add the following secrets:

| Name | Value | Description |
| :--- | :--- | :--- |
| `SSH_HOST` | `92.112.189.250` | Your Hostinger IP |
| `SSH_PORT` | `65002` | SSH Port (check hPanel, likely 65002) |
| `SSH_USER` | `u384342620` | Your FTP/SSH Username |
| `SSH_KEY` | *(Content of file `hostinger_deploy_key`)* | **Private Key** generated in this folder. Open it with Notepad to copy. |

## 3. Verify
Once these are set, every `git push` to `master` will:
1. Build the React app.
2. Automatically sync the `dist/public` folder to Hostinger.
3. Be live in ~2 minutes.

**No more FTP dragging or manual scripts!** 🐝
