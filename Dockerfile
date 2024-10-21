# # update pip
# RUN pip install --upgrade pip
# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the site directory into the container
COPY site /app/site

# Copy the Python script to generate the JSON file
COPY pythonscript.py /app/pythonscript.py

# # update pip
RUN pip install --upgrade pip

# Install any necessary packages (if any)
RUN pip install --no-cache-dir flask

# Expose port 8000 to allow external access
EXPOSE 8000

# Run the Python script to generate dist.json and then start the HTTP server
CMD ["sh", "-c", "python /app/pythonscript.py && python -m http.server 8000 --directory /app/site"]
