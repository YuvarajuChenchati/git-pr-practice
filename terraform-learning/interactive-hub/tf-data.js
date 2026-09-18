// Terraform Interactive Mastery Hub: Stories, Cloud Canvas Models & Quiz Data
window.TF_DATA = {
  stories: [
    {
      id: "ch1-clickops-tragedy",
      title: "Episode 1: The ClickOps Tragedy — The $12,000 Surprise Bill",
      tagline: "Why clicking buttons in the AWS Web Console is the fastest way to bankrupt your startup.",
      memeUrl: "https://media.giphy.com/media/xT5LMzIK1AdZJ4cYW4/giphy.gif",
      memeCaption: "Engineer: 'I only clicked 5 buttons in AWS Console!' The AWS Bill: '$12,482.19'",
      content: `
### 🖱️ The ClickOps Trap
Imagine an engineer setting up an AWS environment:
1. They log in to the AWS console.
2. They click through the VPC wizard.
3. They spin up an EC2 instance, test something, and get distracted.
4. They forget about a provisioned NAT Gateway, unattached Elastic IPs, and an unencrypted RDS database running in the background.
5. **End of month**: A **$12,482 surprise bill** arrives on the company credit card!
6. Management asks: *"Who created this? Why is it running?"* Nobody knows.

---

### 🛡️ The Terraform Salvation
With **Infrastructure as Code (IaC)**:
- Every VPC, server, and firewall rule is written in declarative code in Git.
- Code reviews happen *before* cloud resources are ever created.
- When development finishes at 6 PM on Friday?
  \`\`\`bash
  terraform destroy -auto-approve
  \`\`\`
- Everything is wiped out cleanly. Weekend cost: **$0.00**.
- On Monday at 9 AM?
  \`\`\`bash
  terraform apply -auto-approve
  \`\`\`
- The entire enterprise architecture is resurrected in **3 minutes**!
      `,
      takeaways: [
        "ClickOps is unrepeatable, unversioned, and prone to catastrophic human error.",
        "Terraform makes infrastructure reproducible, auditable, and version-controlled in Git.",
        "Clean teardowns (`terraform destroy`) save thousands of dollars in unused cloud resources."
      ]
    },
    {
      id: "ch2-holy-trinity",
      title: "Episode 2: The Holy Trinity — Init, Plan & Apply Under the Hood",
      tagline: "How human-readable HCL converts into billions of dollars of cloud compute.",
      memeUrl: "https://media.giphy.com/media/26n6WywJyh39n1pBu/giphy.gif",
      memeCaption: "Junior dev: 'Just run terraform apply!' Senior dev: 'DID YOU READ THE PLAN FIRST?!'",
      content: `
### 🔍 The Anatomy of a Terraform Run

#### 1. \`terraform init\` (The Foundation)
- Scans your \`.tf\` files for required providers (\`hashicorp/aws\`, \`kubernetes\`).
- Downloads provider binaries into the hidden \`.terraform/\` directory.
- Initializes the backend connection.

#### 2. \`terraform plan\` (The Look-Before-You-Leap)
- Queries the real AWS API to refresh its memory of the real world.
- Compares real world vs your desired code.
- Generates the **Execution Plan**:
  - \`+\` **Green**: Creating a new resource.
  - \`~\` **Yellow**: Modifying an existing resource safely in-place.
  - \`-\` **Red**: Deleting a resource.
  - \`-/+\` **Red/Green**: Destroying and re-creating (Danger zone for databases!).

#### 3. \`terraform apply\` (The Execution)
- Makes authenticated HTTPS REST calls to AWS/GCP/Azure.
- Waits for resources to be provisioned.
- Updates the all-important \`terraform.tfstate\` file.
      `,
      takeaways: [
        "Always review the `terraform plan` output before applying.",
        "Watch out for `- / +` destroy and recreate diffs on databases.",
        "Terraform is idempotent: running apply twice with no code changes does nothing."
      ]
    },
    {
      id: "ch3-state-file-nightmare",
      title: "Episode 3: The State File Nightmare (The Forbidden Git Commit)",
      tagline: "Why committing `terraform.tfstate` to GitHub is an immediate security disaster.",
      memeUrl: "https://media.giphy.com/media/QMHoU66sBXCAVGs0km/giphy.gif",
      memeCaption: "Junior engineer committing terraform.tfstate with plaintext RDS passwords to GitHub.",
      content: `
### 💀 What Lurks Inside \`terraform.tfstate\`?
When Terraform provisions resources, it stores a JSON mapping of everything in \`terraform.tfstate\`.
**THE DANGER**:
- If you create an RDS database with \`password = "SuperSecret123"\`, Terraform stores that password in **100% PLAINTEXT** inside the state file!
- Automated scrapers search GitHub 24/7 for commits containing \`.tfstate\`.
- If committed, your database credentials and AWS infrastructure topology are compromised in seconds!

---

### 🛡️ The Rule: Always Use Remote Backends
1. Add \`*.tfstate\` and \`*.tfstate.backup\` to your \`.gitignore\`.
2. Store state in an encrypted Amazon S3 bucket.
3. Lock state using AWS DynamoDB so two team members never apply changes at the exact same moment!
      `,
      takeaways: [
        "Never commit terraform.tfstate to Git (it contains plaintext secrets).",
        "Always use remote backends (Amazon S3 with AES-256 encryption).",
        "Enable S3 bucket versioning so you can roll back corrupted state files."
      ]
    },
    {
      id: "ch4-drift-detection",
      title: "Episode 4: The Rogue Sysadmin & Drift Detection",
      tagline: "What happens when someone bypasses Terraform and edits AWS manually at midnight?",
      memeUrl: "https://media.giphy.com/media/WrNfErAnGV7lm/giphy.gif",
      memeCaption: "Terraform finding 14 unauthorized manual changes made in the AWS Web Console.",
      content: `
### 🕵️ The Mystery of the Broken Firewall
It was 2 AM. An engineer needed to debug an issue quickly:
- They opened the AWS Console and edited the production Security Group: opened port 22 (SSH) to \`0.0.0.0/0\` (the entire world).
- The next morning, they forgot to close it.

Then another engineer ran:
\`\`\`bash
terraform plan
\`\`\`
**Terraform immediately caught the rogue change**:
\`\`\`text
~ aws_security_group.web_traffic
  ~ ingress {
      ~ cidr_blocks = ["0.0.0.0/0"] -> ["10.0.0.0/8"] (Restricting to internal network)
    }
\`\`\`
Running \`terraform apply\` immediately reverted the unauthorized rule, restoring enterprise security compliance!
      `,
      takeaways: [
        "State Drift occurs when cloud resources are changed outside of Terraform.",
        "Terraform continuously compares real-world API data against desired code.",
        "Applying Terraform enforces your declared desired state and wipes away manual tampering."
      ]
    },
    {
      id: "ch5-the-devops-trinity",
      title: "Episode 5: The Grand Symphony — Docker + K8s + Terraform",
      tagline: "How the entire modern cloud engineering stack fits together into a single unified pipeline.",
      memeUrl: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif",
      memeCaption: "The moment when Terraform provisions the EKS cluster, K8s deploys the pods, and the Docker app responds 200 OK.",
      content: `
### 🎼 The Unified Cloud Architecture
Now you understand the entire puzzle:
1. **Docker**: Packages your Node.js application, binaries, and dependencies into an immutable, 54MB image.
2. **Kubernetes**: Manages 50 pods of that image across multiple servers, auto-healing crashes and load balancing user sessions.
3. **Terraform**: Writes the code that provisions the AWS VPC, the subnets, the internet gateways, and the Managed EKS cluster in the first place!

You now possess the foundational knowledge that powers the infrastructure of Netflix, Uber, Spotify, and Airbnb!
      `,
      takeaways: [
        "Docker = The Brick (Packaging).",
        "Kubernetes = The City Manager (Cluster Orchestration).",
        "Terraform = The Land Architect (Infrastructure Provisioning)."
      ]
    }
  ],

  // Quiz Arena Data
  quizChallenges: [
    {
      id: 1,
      title: "The Dangerous Database Recreation",
      scenario: "You rename the `name` parameter in an `aws_db_instance` (PostgreSQL) resource block in Terraform. When you run `terraform plan`, you see `- / + destroy and then create replacement`. What will happen if you type 'yes'?",
      memeCorrect: "https://media.giphy.com/media/2bYewTk7K2No1NvcuK/giphy.gif",
      memeWrong: "https://media.giphy.com/media/QMHoU66sBXCAVGs0km/giphy.gif",
      options: [
        "Terraform will seamlessly rename the database without downtime.",
        "Terraform will permanently delete the production database, erasing all customer data, and create a blank new database!",
        "AWS will reject the request automatically.",
        "The state file will revert the change."
      ],
      correctIndex: 1,
      explanation: "In AWS, certain parameters (like DB instance identifiers) cannot be modified in-place. Terraform diff `- / +` means it will DESTROY the existing resource before creating a new one! Always protect critical databases with `lifecycle { prevent_destroy = true }`!"
    },
    {
      id: 2,
      title: "The State Locking Collision",
      scenario: "Two DevOps engineers on your team run `terraform apply` at the exact same second. What prevents them from corrupting the cloud state?",
      memeCorrect: "https://media.giphy.com/media/d3mlE7uhX8KFgEmY/giphy.gif",
      memeWrong: "https://media.giphy.com/media/xT5LMzIK1AdZJ4cYW4/giphy.gif",
      options: [
        "AWS IAM blocks the second user.",
        "DynamoDB State Locking: The first apply acquires a `LockID` mutex in DynamoDB. The second user receives 'Error: State locked' and exits.",
        "Terraform automatically merges the changes like Git.",
        "The second user's terminal crashes."
      ],
      correctIndex: 1,
      explanation: "Using an S3 remote backend with a DynamoDB lock table provides distributed locking. The first process acquires the lock, preventing race conditions and state file corruption!"
    },
    {
      id: 3,
      title: "The State Drift Mystery",
      scenario: "A sysadmin logs into the AWS Web Console and changes an EC2 instance type from `t3.micro` to `t3.large`. What happens when you run `terraform plan`?",
      memeCorrect: "https://media.giphy.com/media/a5viI92PAF89q/giphy.gif",
      memeWrong: "https://media.giphy.com/media/11StaZ9Lj75oCY/giphy.gif",
      options: [
        "Terraform ignores the manual change and does nothing.",
        "Terraform queries AWS API, detects the drift (`t3.large`), and shows a plan diff to change it back to `t3.micro` to match your code!",
        "Terraform crashes with an authentication error.",
        "Terraform updates your local `.tf` files automatically."
      ],
      correctIndex: 1,
      explanation: "Terraform plan always refreshes the state against the real-world cloud API. It detects the unauthorized manual change as drift, and offers to bring reality back in line with your declared code!"
    },
    {
      id: 4,
      title: "Count vs For_Each Trap",
      scenario: "You use `count = 3` to create 3 subnets (`subnet[0]`, `subnet[1]`, `subnet[2]`). If you delete `subnet[1]` from the middle of your list, what does Terraform do?",
      memeCorrect: "https://media.giphy.com/media/l4pMattUYTTM7qpIk/giphy.gif",
      memeWrong: "https://media.giphy.com/media/WrNfErAnGV7lm/giphy.gif",
      options: [
        "It only deletes subnet[1].",
        "It shifts all subsequent indices, unnecessarily destroying and recreating subnet[2]! This is why `for_each` with unique map keys is best practice.",
        "It throws a syntax error.",
        "It renames subnet[2] to subnet[1] without touching it."
      ],
      correctIndex: 1,
      explanation: "Because `count` is index-based, removing an item from the middle changes all following indices, forcing Terraform to destroy and recreate them. Always use `for_each` for critical production resources!"
    },
    {
      id: 5,
      title: "The Pre-Existing Cloud Resource",
      scenario: "Your company has an existing AWS S3 bucket created 4 years ago via the console. How do you bring it under Terraform management without deleting it?",
      memeCorrect: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif",
      memeWrong: "https://media.giphy.com/media/xThuW4BaAA2f7nRvoc/giphy.gif",
      options: [
        "Delete the bucket in the console and recreate it with Terraform.",
        "Write the matching resource block in `.tf` and run `terraform import aws_s3_bucket.my_bucket <bucket-name>`.",
        "You can never import existing resources into Terraform.",
        "Email AWS support to transfer ownership."
      ],
      correctIndex: 1,
      explanation: "`terraform import` reads the existing cloud resource attributes and writes them directly into `terraform.tfstate`, bringing legacy resources under code management with zero downtime!"
    }
  ],

  // Cloud Canvas Simulation Components
  canvasResources: [
    { id: "vpc", name: "aws_vpc.production_vpc", type: "VPC", cidr: "10.0.0.0/16", status: "Not Created" },
    { id: "igw", name: "aws_internet_gateway.gw", type: "Gateway", status: "Not Created" },
    { id: "subnet_pub", name: "aws_subnet.public_1", type: "Subnet", cidr: "10.0.1.0/24", status: "Not Created" },
    { id: "sg", name: "aws_security_group.web", type: "Firewall", ports: "80, 443", status: "Not Created" },
    { id: "ec2", name: "aws_instance.app_server", type: "Compute", size: "t3.medium", status: "Not Created" },
    { id: "s3", name: "aws_s3_bucket.assets", type: "Storage", status: "Not Created" }
  ]
};
