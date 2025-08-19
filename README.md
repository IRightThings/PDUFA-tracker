# 🎯 PDUFA Tracker - AI-Powered FDA Calendar

> The first visual PDUFA calendar built specifically for biotech investors who need to see FDA dates at a glance, not dig through spreadsheets.

![PDUFA Tracker Preview](https://img.shields.io/badge/Status-MVP_Ready-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-React%2BNode.js%2BPostgreSQL-blue)
![API Integration](https://img.shields.io/badge/APIs-OpenFDA%2BSEC%2BClinicalTrials-orange)

## 🚀 Features

### ✅ Live FDA Data Integration
- Real-time PDUFA events from OpenFDA API
- Daily automatic sync with FDA databases
- Historical approval tracking and analysis

### 📅 Visual Calendar Interface
- Modern, responsive calendar design
- Stock ticker prominence (GILD, MRK, ABBV)
- Risk-based color coding (Green/Orange/Red)
- Mobile-optimized touch interface

### 🧠 AI-Powered Analysis (Coming Soon)
- Approval probability predictions
- Company sentiment analysis from SEC filings
- Clinical trial success pattern recognition
- Management confidence scoring

### 💰 Investment-Focused Features
- Market cap filtering (Micro/Small/Large cap)
- Risk level assessment
- Priority review indicators
- Real-time event updates

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (converting to React)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **APIs**: OpenFDA, SEC EDGAR, ClinicalTrials.gov
- **Deployment**: Railway (Backend) + Vercel (Frontend)
- **AI/ML**: TensorFlow.js, Natural Language Processing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenFDA API access (optional but recommended)

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/pdufa-tracker.git
cd pdufa-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run db:setup

# Start development server
npm run devVisit http://localhost:8000 to see the application
