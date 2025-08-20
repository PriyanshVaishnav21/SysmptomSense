
# Kubernetes Manifests for Symptom Sense AI Hub

This directory contains Kubernetes manifest files for deploying the Symptom Sense AI Hub application.

## Files

- `deployment.yaml`: Defines the deployment of the application with container specifications, resource limits, and health checks
- `service.yaml`: Creates a ClusterIP service to expose the application internally
- `ingress.yaml`: Sets up the ingress to make the application accessible from outside the cluster
- `config-map.yaml`: Contains environment configurations for the application
- `secret.yaml`: Stores sensitive information like API keys (values are placeholders)
- `hpa.yaml`: Horizontal Pod Autoscaler for automatic scaling based on CPU and memory usage

## Deployment Instructions

1. Build and push the Docker image:
   ```
   docker build -t symptom-sense-ai-hub:latest .
   docker tag symptom-sense-ai-hub:latest <your-registry>/symptom-sense-ai-hub:latest
   docker push <your-registry>/symptom-sense-ai-hub:latest
   ```

2. Update the image name in `deployment.yaml` with your registry and tag.

3. Update `secret.yaml` with your actual secrets (base64 encoded).

4. Apply the manifests:
   ```
   kubectl apply -f kubernetes-manifest/
   ```

5. Verify the deployment:
   ```
   kubectl get pods,services,ingress
   ```

6. Cluster Creation
```bash
kind create cluster --name symptom-sense --config kind-cluster-config.yaml
```

7. Deployment
```bash
git clone https://github.com/PriyanshVaishnav21/symptom-sense-ai-hub.git
cd symptom-sense-ai-hub/
```

### Building Docker Image
```bash
docker build -t symptom-sense-ai-hub:latest .
```

### Loding into KIND
```bash
kind load docker-image symptom-sense-ai-hub:latest --name symptom-sense
```

### Deploy to K8s
```bash
cd kubernetes-manifest/
kubectl apply -f .
```

### Access Application
- First set the incound rules in Security Groups
```bash
http://<public-ip-ec2>:30000
```



