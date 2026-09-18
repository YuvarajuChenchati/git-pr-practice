# Lab 01: Your First Containers & Interactive Execution

### Objective
Understand image downloading, container execution, interactive vs detached modes, and process lifecycle.

---

### Step 1: Run the classic Hello World test
Run this in PowerShell:
```powershell
docker run hello-world
```
**What just happened?**
1. Docker checked if the image `hello-world:latest` exists locally.
2. It wasn't found, so Docker automatically pulled it from Docker Hub.
3. Docker created a container process from the image, executed it, printed text to your console, and exited immediately because its primary task finished.

---

### Step 2: Run an interactive Linux container
Let's spin up a minimal Alpine Linux container (only 5 MB!):
```powershell
docker run -it --name my-alpine alpine sh
```
Notice your terminal prompt changed to `/ #`! You are now **inside** an isolated Linux machine.

Try running inside the container:
```sh
uname -a
cat /etc/os-release
ps aux
```
Notice `ps aux` shows only 1 or 2 processes: `sh` is PID 1! The container cannot see any processes from your Windows laptop.

Exit the container:
```sh
exit
```

---

### Step 3: Check container status
Run:
```powershell
docker ps
```
Your `my-alpine` container is NOT listed! Why? Because typing `exit` terminated PID 1 (`sh`), so the container stopped.

Now run:
```powershell
docker ps -a
```
There it is! Status shows `Exited (0)`.

---

### Step 4: Restart an existing container & execute commands
Instead of creating a new container, restart the existing one:
```powershell
docker start my-alpine
```
Now check `docker ps`: it is running!

To jump into a running container:
```powershell
docker exec -it my-alpine sh
```
Inside, create a file:
```sh
echo "Docker is awesome!" > /test.txt
cat /test.txt
exit
```

---

### Step 5: Understand Container Ephemerality
Stop and remove the container:
```powershell
docker stop my-alpine
docker rm my-alpine
```
Now run a brand new Alpine container:
```powershell
docker run -it --rm alpine cat /test.txt
```
Output:
`cat: can't open '/test.txt': No such file or directory`

> [!IMPORTANT]
> **Key Takeaway**: Containers are ephemeral! Any files written inside a container vanish when the container is deleted, unless saved to a Volume or Bind Mount.
