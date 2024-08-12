# Store front end application

## Introduction

Welcome to the store website. This is simple e-commerce application to buy products

![image](https://github.com/user-attachments/assets/dbbdeb2b-e586-490a-b874-36e3e4f578e2)



## Tech Stack

The Blog REST API is built using the following technologies:

- **react.js**
- **vite **


## Getting Started

Follow these instructions to run the project locally using Node js:

1. Clone the project repository to your local machine:

   ```bash
   git clone <repository_url>
   cd <project_directory>

1. Create a .env file in the project root and configure the following environment variables:

```bash
VITE_BACKEND_SERVER = http://localhost:5000 (back end server)
VITE_KASKIER_BASEURL = https://checkout.kashier.io
VITE_KASHIER_PAYMENTAPIKEY = paymentapi key
VITE_KASHIER_MODE = test
VITE_KASHIER_MID = MID-1234-56
VITE_KASHIER_REDIRECTURL = http://localhost:5173/paymentStatus
VITE_KASHIER_WEBHOOK = https://store-back-end-7v7c.onrender.com/api/webhook/kashier-webhook (webhook URL)

```
2. install debndaceis

```bash
yarn install
```

4. Start the development server:
   
```bash
yarn dev
```

Now you can see your API docs at: `http://localhost:5173`


## live preview
you can see the live preview [here](https://store-front-end-rouge.vercel.app/)
please before start interact with website be sure back end server is running

Backend repo: https://github.com/amrmuhamedd/store-back-end
API docs: https://store-back-end-7v7c.onrender.com/api-docs/#/

## At the end 
Please refer to the Swagger documentation for detailed information on each endpoint and how to use them.

If you have any questions or encounter issues, feel free to reach out for assistance. Happy coding!
