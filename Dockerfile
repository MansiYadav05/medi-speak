# Step 1: Build the React application
FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Pass the API key during build time so Vite can embed it
ARG GEMINI_API
ENV GEMINI_API=$GEMINI_API

RUN npm run build

# Step 2: Serve the app with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]