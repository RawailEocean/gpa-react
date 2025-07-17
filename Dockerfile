# Stage 1: Build React app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package files first to use Docker layer caching
COPY package*.json ./
RUN npm ci  # Faster and more reliable in CI than `npm install`

# Now copy the rest of the app
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy build output to nginx directory
COPY --from=builder /app/build /usr/share/nginx/html

# Optional: remove default Nginx config if not needed
# RUN rm /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
