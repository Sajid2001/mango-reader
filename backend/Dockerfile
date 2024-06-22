# Use an official Python runtime as a parent image
FROM python:3.10.3-slim-buster

# Set the working directory inside the container
WORKDIR /api 

# Install gnupg and other system dependencies
RUN apt-get update \
    && apt-get install -y gnupg \
                           libpq-dev gcc libc-dev \
                           unzip wget curl \
                           libxpm4 libxrender1 libgtk2.0-0 libnss3 libgconf-2-4 xvfb \
                           libxi6 libgconf-2-4 libxcomposite1 libasound2 libxrandr2 \
                           libatk1.0-0 libgtk-3-0

# Install Chrome
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable

# Install Chromedriver (version 97, adjust as needed)
RUN wget -q "https://storage.googleapis.com/chrome-for-testing-public/126.0.6478.63/linux64/chromedriver-linux64.zip" \
    && unzip chromedriver-linux64.zip \
    && mv chromedriver-linux64/chromedriver /usr/local/bin/ \
    && rm chromedriver-linux64.zip

# Copy requirements.txt file and install Python dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose port 8000 to allow external access
EXPOSE 8000

# Set executable permissions on start.sh script if needed
RUN chmod +x ./scripts/start.sh

# Use the start script as the entrypoint
CMD ["./scripts/start.sh"]
