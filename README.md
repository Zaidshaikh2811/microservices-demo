# Microservices Demo

This repository contains a beginner-friendly microservices architecture built with Node.js, Docker, and Kubernetes. Each service is self-contained and communicates via an event bus. The project is designed for learning and experimentation.

## Project Structure

```
comments/        # Comments service
posts/           # Posts service
query/           # Query service
event-bus/       # Event bus service
infra/k8s/       # Kubernetes manifests
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [Docker](https://www.docker.com/get-started)
- [Kubernetes](https://kubernetes.io/) (Minikube or Docker Desktop with K8s enabled)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/Zaidshaikh2811/microservices-demo.git
cd microservices-demo
```

### 2. Install Dependencies

Install dependencies for each service:

```sh
cd comments && npm install
cd ../posts && npm install
cd ../query && npm install
cd ../event-bus && npm install
```

### 3. Build Docker Images

Build Docker images for each service:

```sh
docker build -t comments-service ./comments

docker build -t posts-service ./posts

docker build -t query-service ./query

docker build -t event-bus-service ./event-bus
```

### 4. Start Kubernetes Cluster

If using Minikube:

```sh
minikube start
```

### 5. Apply Kubernetes Manifests

Apply all manifests in the `infra/k8s` folder:

```sh
kubectl apply -f infra/k8s
```

### 6. Access the Application

Find the ingress service URL:

```sh
kubectl get services
```

If using Minikube, you may need to run:

```sh
minikube service ingres-srv --url
```

## Useful Commands

- List all pods:
  ```sh
  kubectl get pods
  ```
- View logs for a pod:
  ```sh
  kubectl logs <pod-name>
  ```
- Delete all resources:
  ```sh
  kubectl delete -f infra/k8s
  ```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.
