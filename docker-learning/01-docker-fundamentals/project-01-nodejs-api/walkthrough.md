# 🧪 Project 01: Hands-on Lab & Walkthrough

Follow these exact steps in your terminal to build and run your first containerized Node.js API.

---

### Step 1: Open Terminal in Project Directory
In PowerShell:
```powershell
cd c:\Users\chyuv\Desktop\Practice\docker-learning\01-docker-fundamentals\project-01-nodejs-api
```

---

### Step 2: Build the Docker Image
Build the image and tag it as `diagnostic-api:v1`:
```powershell
docker build -t diagnostic-api:v1 .
```
*(Notice the `.` at the end! It tells Docker to use the current directory as the **build context**).*

Watch the build output:
- Step 1: Downloads `node:22-alpine` if not cached
- Step 2: Sets `WORKDIR /app`
- Step 3: Copies `package.json`
- Step 4: Runs `npm install`
- Step 5: Copies application files
- Successfully tagged `diagnostic-api:v1`

---

### Step 3: Inspect the Image
Check that your image was created:
```powershell
docker images
```
See image layers and their sizes:
```powershell
docker history diagnostic-api:v1
```

---

### Step 4: Run the Container (The Right Way)
Run it in detached mode (`-d`), mapping host port `3000` to container port `3000`:
```powershell
docker run -d -p 3000:3000 --name my-diagnostic-app diagnostic-api:v1
```

Check if it's running:
```powershell
docker ps
```
You should see:
`CONTAINER ID ... diagnostic-api:v1 ... 0.0.0.0:3000->3000/tcp ... my-diagnostic-app`

---

### Step 5: Test the Application in Browser
Open your browser and navigate to:
👉 **`http://localhost:3000`**

You will see the **Docker Diagnostic Dashboard** rendered directly from inside your container!
Notice the **Container ID** on the webpage matches the container ID shown in `docker ps`!

Test the API endpoint via PowerShell:
```powershell
curl http://localhost:3000/api/info
curl http://localhost:3000/api/health
```

---

### Step 6: View Live Logs
Stream the logs from the container in real-time:
```powershell
docker logs -f my-diagnostic-app
```
*(Press `Ctrl + C` to stop watching logs. The container will KEEP running!)*

---

### Step 7: Jump Inside the Running Container
Use `docker exec` to start an interactive shell:
```powershell
docker exec -it my-diagnostic-app sh
```
Inside the container, run:
```sh
ls -la          # See /app directory structure
cat package.json
ps aux          # See the node process running as PID 1
exit            # Exit the container
```

---

### Step 8: Clean Up
When you are done testing:
```powershell
docker stop my-diagnostic-app
docker rm my-diagnostic-app
```

🎉 **Congratulations! You have completed Project 1!**
Now advance to [Module 02: Dockerfile & Image Mastery](../02-dockerfile-image-mastery/README.md).
