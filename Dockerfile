# server/Dockerfile
FROM node:20

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Expose API port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
