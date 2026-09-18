# Lab 02: Manual Network Linking & DNS Discovery

### Objective
Learn how Docker's internal DNS allows containers on the same custom bridge network to ping each other by name.

---

### Step 1: Create a Custom Bridge Network
```powershell
docker network create my-lab-network
docker network ls
```

---

### Step 2: Launch Container Alpha on the Network
```powershell
docker run -d --name alpha --network my-lab-network alpine sleep 1000
```

---

### Step 3: Launch Container Beta and Ping Alpha by Name
```powershell
docker run --rm --network my-lab-network alpine ping -c 3 alpha
```

Output:
```
PING alpha (172.x.x.x): 56 data bytes
64 bytes from 172.x.x.x: seq=0 ttl=64 time=0.123 ms
64 bytes from 172.x.x.x: seq=1 ttl=64 time=0.089 ms
64 bytes from 172.x.x.x: seq=2 ttl=64 time=0.095 ms
```

> [!TIP]
> Notice we didn't specify any IP addresses! Docker's internal DNS automatically resolved `alpha` to its current container IP. If `alpha` restarts and gets a new IP, DNS updates automatically.

---

### Step 4: Cleanup
```powershell
docker stop alpha
docker rm alpha
docker network rm my-lab-network
```
