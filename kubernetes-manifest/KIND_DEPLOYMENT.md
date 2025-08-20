# Symptom Sense AI Hub Deployment with KIND

This README outlines the process of setting up a local Kubernetes cluster using KIND (Kubernetes IN Docker), building a Docker image for the Symptom Sense AI Hub, and deploying it into the cluster using Kubernetes manifests.

---

## 🧰 Prerequisites

Ensure you have the following installed on your Ubuntu system:

- Docker
- KIND
- kubectl
- Git

---

## 🔧 System Setup

### Install Docker

```bash
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

### Install KIND
```bash
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.17.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
kind --version
```

### Install kubectl 
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
kubectl version --client
```

