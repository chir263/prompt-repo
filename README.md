# Virtual Labs Prompt Repository

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Components](#components)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [Google Sheet Structure](#google-sheet-structure)
  - [Hierarchical Structure](#hierarchical-structure)
- [Usage](#usage)
  - [Generating an API Key](#generating-an-api-key)
  - [Basic Usage](#basic-usage)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Project Overview

**Virtual Labs Prompt Repository** is a tool designed for Virtual Labs staff to generate various types of content, such as blogs and documentation, using large language models (LLMs). The repository contains predefined prompt templates, allowing users to input specific information to generate content efficiently.

## Key Features

- **Content Generation**: Generate content like blogs and documentation using predefined prompt templates.
- **User Inputs**: Customize content generation by providing specific inputs.
- **Hierarchical Structure**: Organized structure with prompt directories, categories, and templates for easy navigation and usage.

## Components

The project is divided into two main components:

1. **Frontend**:

   - Developed using ReactJS and CSS.
   - Provides an interactive user interface for inputting data and generating content.

2. **Backend**:
   - Developed using Flask (Python).
   - Handles server-side logic and integrates with the Gemeni API for text generation.

## Installation

### Prerequisites

- **Node.js and npm** for the frontend.
- **Python 3.9+** for the backend.

## Installation

### Prerequisites

- **Node.js and npm** for the frontend.
- **Python 3.9+** for the backend.

### Frontend Setup

- Navigate to the frontend directory:

```
cd frontend
```

- Install dependencies:

  ```
  npm install
  ```

- Start the frontend server:

  ```
  npm start
  ```

### Backend Setup

1. Create a .env file and a secrets folder in the backend directory.
2. Place the service-account-secret.json file inside the secrets folder.
3. Set up a Python virtual environment and activate it:

```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Start the backend server:

```bash
python server.py
```

### Environment Variables

**.env file:**

- `GOOGLE_SHEET_ID`: ID of the Google Sheet used for storing data.
- `GEMENI_API`: API key for Gemeni, used for text generation.

### Google Sheet Structure

The Google Sheet contains three tabs:

**Users:**

- **Github Account**: The GitHub account of the user.
- **Role**: The role of the user.

**Prompt Directories:**

- **Prompt Directory**: Name of the prompt directory.
- **Category List**: List of categories under the directory.

**Prompt Templates:**

- **Prompt Directory**: The directory to which the template belongs.
- **Category**: The category under the directory.
- **Template Name**: Name of the template.
- **Prompt Template**: The template text.
- **Placeholders**: Placeholders to be filled by user inputs.

### Hierarchical Structure

The application is organized in a hierarchical manner:

Prompt Directory → Prompt Category → Prompt Template

Users add inputs in the Prompt Template to generate the desired content.

## Usage

### Generating an API Key

Users can generate their Gemeni API key from [this link](link).

### Basic Usage

1. Start the frontend and backend servers as described in the installation section.
2. Open the frontend in your browser.
3. Navigate through the prompt directories and categories to find the desired prompt template.
4. Fill in the required placeholders and generate content.
