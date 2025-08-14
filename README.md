# Funds Front - Deployment on AWS with CloudFormation

This repository contains the **AWS CloudFormation template** to deploy the `funds-front` application (Next.js) on an EC2 instance using **SSR (Server-Side Rendering)** with `npm start` and **systemd** for automatic service management.

It also provides a **step-by-step guide** to manually deploy the infrastructure using the AWS console.

---

## Prerequisites

Before deploying, make sure you have:

- An active AWS account.
- A Key Pair in your chosen AWS region (to access the EC2 instance via SSH).
- Internet connection and sufficient permissions to create EC2 instances, Security Groups, and CloudFormation stacks.
- Optional: AWS CLI configured if you prefer to deploy via command line.

---

## Manual Deployment Steps

1. **Access CloudFormation**

   - Go to the [AWS Console](https://aws.amazon.com/console/).
   - Search for **CloudFormation** and click **Create stack** → **With new resources (standard)**.

2. **Upload the Template**

   - Select **Upload a template file**.
   - Click **Choose file** and select `cloudformation.yaml` from this repository.
   - Click **Next**.

3. **Configure the Stack**

   - Enter a name for your stack, e.g., `funds-front-stack`.
   - Fill in any required template parameters:
     - `KeyName`: your AWS Key Pair.
   - Click **Next**.

4. **Configure Additional Options (Optional)**

   - Add tags, permissions, or policies if needed.
   - Click **Next**.

5. **Review and Create Stack**

   - Review all details and make sure everything is correct.
   - Check the acknowledgment box if necessary (**I acknowledge that AWS CloudFormation might create IAM resources**).
   - Click **Create stack**.

6. **Wait for Stack Creation**

   - CloudFormation will start creating resources.  
   - Monitor progress in the **Events** tab.  
   - Once the status changes to **CREATE_COMPLETE**, your infrastructure is ready.

7. **Access the Application**

   - Obtain the **public IP** of the EC2 instance (from the Outputs tab or EC2 console).  
   - Open a browser and navigate to:

     ```
     http://<EC2_PUBLIC_IP>:3000
     ```

   - The Next.js app should now be live.

---

## Security and Best Practices

- **Do not commit secrets** to the repository.  
- Configure the **Security Group** to restrict access in production if necessary.
- Check the systemd service logs on the EC2 instance:

  ```bash
  sudo journalctl -u fundsfront -f
  ```
  
### To stop the service:
  ```bash
  sudo systemctl stop fundsapp
  ```

### To restart the service:
  ```bash
  sudo systemctl restart fundsapp
  ```