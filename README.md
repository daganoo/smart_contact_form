# 📬 Smart Contact Form — Serverless AWS

Serverless contact form pipeline built on AWS — form submissions are validated client-side, transmitted via HTTPS to API Gateway, processed by a Node.js Lambda function, persisted in DynamoDB (UUID partition key), and trigger transactional email notifications through SES. Includes a JWT-less secret-based secured admin dashboard to query all submissions. Infrastructure costs ~$0.50/month under real traffic.

🔗 **Live Demo:** [https://main.d29u8n0o72ktwh.amplifyapp.com](https://main.d29u8n0o72ktwh.amplifyapp.com)

---

## 🏗️ Architecture

![Architecture Diagram](public/architecture.svg)

---

## 🖼️ Application Screenshots

![Form ](public/form.svg)
![Message sent successfully ](public/msg_sent.svg)
![Adimin dashboard ](public/admin_dash.svg)
![dynamoDB database](public/dynamoDB_buckup.svg)

---

## 🔄 Request Flow

### Form Submission
```
User fills form
    → reCAPTCHA v2 token generated (client-side)
    → Field validation (client-side)
    → POST /contact { name, email, subject, message }
    → API Gateway routes to Lambda
    → Lambda parses and validates all fields
    → Lambda writes item to DynamoDB (UUID v4 as partition key)
    → Lambda sends transactional email via SES
    → 200 OK { success: true, id: "uuid" }
    → Success state rendered to user
```

### Admin Dashboard
```
Admin opens dashboard
    → GET /submissions + Authorization: <ADMIN_SECRET> header
    → API Gateway routes to Lambda
    → Lambda checks Authorization header against ADMIN_SECRET env variable
    → 401 Unauthorized if header is missing or invalid
    → DynamoDB Scan if authorized
    → Items sorted by timestamp descending
    → 200 OK — array of submissions returned
    → Dashboard renders submission list + detail view
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | CSS3 (custom, no frameworks) |
| HTTP Client | Axios |
| Bot Protection | Google reCAPTCHA v2 |
| Hosting | AWS Amplify (S3 + CloudFront) |
| API | AWS API Gateway (HTTP API) |
| Compute | AWS Lambda (Node.js 22.x) |
| Database | AWS DynamoDB (on-demand billing) |
| Email | AWS SES (transactional) |
| CI/CD | GitHub → AWS Amplify auto-deploy |

---

## ✨ Features

- **Google reCAPTCHA v2** — blocks bot submissions client-side before hitting the API
- **Authorization header** — secures the admin `/submissions` endpoint with a server-side secret
- **Client-side validation** — prevents empty or malformed submissions from reaching Lambda
- **DynamoDB persistence** — every submission stored with UUID partition key, never lost
- **SES email notifications** — transactional email delivered under 5 seconds
- **CORS configured** — API Gateway restricts to expected headers and methods only
- **No secrets in code** — all sensitive values stored in Lambda env vars and Amplify build vars
- **CI/CD via Amplify** — auto-deploys on every GitHub push, zero manual steps

---

## 📁 Project Structure

```
smart_contact_form/
├── public/
│   └── architecture.svg          # Architecture diagram
├── src/
│   ├── components/
│   │   ├── ContactForm.jsx       # Form UI with validation and loading states
│   │   └── AdminDashboard.jsx    # Protected submissions viewer
│   ├── hooks/
│   │   └── useContactForm.js     # Form state management + API call logic
│   ├── utils/
│   │   └── validation.js         # Client-side field validation rules
│   ├── App.jsx                   # Root component + view switching (form/admin)
│   ├── App.css                   # All component styles
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global reset
├── .env                          # Local environment variables (not committed)
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## ☁️ AWS Infrastructure

### Lambda — `contactFormHandler`

**Runtime:** Node.js 22.x  
**Region:** eu-west-3 (Paris)  
**IAM Policies:** `AmazonDynamoDBFullAccess` + `AmazonSESFullAccess`

**Environment Variables:**
| Key | Description |
|-----|-------------|
| `ADMIN_SECRET` | Secret key validated on every GET /submissions request |

**Route handling:**
```javascript
POST /contact      → validate fields → PutItem to DynamoDB → SendEmail via SES
GET  /submissions  → check Authorization header → Scan DynamoDB → return sorted array
OPTIONS *          → return CORS headers for preflight requests
```

### API Gateway

**Type:** HTTP API  
**Deployed stage:** `$default`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /contact | None | Receive and process form submission |
| GET | /submissions | Authorization header | Return all stored submissions |
| OPTIONS | * | None | Handle CORS preflight |

**CORS Configuration:**
```
Access-Control-Allow-Origin:  *
Access-Control-Allow-Headers: content-type, authorization
Access-Control-Allow-Methods: GET, POST, OPTIONS
```

### DynamoDB — `contact-form-submissions`

**Billing mode:** On-demand (pay per request)  
**Partition key:** `id` (String — UUID v4)

**Item schema:**
```json
{
  "id":        { "S": "a06d2c29-8330-40cf-a1c8-fbd25e344144" },
  "name":      { "S": "John Doe" },
  "email":     { "S": "john@example.com" },
  "subject":   { "S": "Project inquiry" },
  "message":   { "S": "Hello, I would like to discuss..." },
  "timestamp": { "S": "2026-02-20T15:06:09.863Z" }
}
```

### SES — Simple Email Service

**Region:** eu-west-3  
**Identity type:** Verified email address  
**Trigger:** Every successful POST /contact  
**Current mode:** Sandbox (emails delivered to verified addresses only)

---

## 🔐 Security Model

| Threat | Mitigation |
|--------|-----------|
| Bot submissions | Google reCAPTCHA v2 token required client-side |
| Unauthorized admin access | Authorization header checked in Lambda against env variable |
| Secrets in source code | All secrets stored in Lambda env vars and Amplify build vars |
| Overly permissive API | CORS restricts accepted headers and methods |
| Lost submissions | Every submission persisted to DynamoDB regardless of email delivery |

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- AWS account with Lambda, DynamoDB, SES, API Gateway configured
- Google reCAPTCHA v2 site key

### Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/smart_contact_form.git
cd smart_contact_form

# Install dependencies
npm install

# Create environment file
touch .env
```

Add to `.env`:
```env
VITE_API_URL=https://your-api-id.execute-api.region.amazonaws.com/contact
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
VITE_ADMIN_SECRET=your_admin_secret
```

```bash
# Start dev server
npm run dev
```

---

## 💰 Cost Breakdown

| Service | Free Tier | Estimated Monthly Cost |
|---------|-----------|----------------------|
| Lambda | 1M requests free | ~$0.00 |
| API Gateway | 1M requests free | ~$0.00 |
| DynamoDB | 25GB + 200M requests free | ~$0.00 |
| SES | 62,000 emails free | ~$0.00 |
| Amplify | 1000 build mins free | ~$0.50 |
| **Total** | | **~$0.50/month** |

---

## 📊 Performance

- **API response time:** < 300ms average
- **Uptime:** 99.99% (AWS managed infrastructure SLA)
- **Lambda cold start:** < 500ms (Node.js 22.x)
- **Global delivery:** CloudFront CDN via AWS Amplify

---

## 👨‍💻 Author

**Marouane Dagana**

- 💼 LinkedIn: [linkedin.com/in/marouane-dagana](https://linkedin.com/in/marouane-dagana-418832264)
- 🐙 GitHub: [@daganoo](https://github.com/daganoo)
- 📧 Email: marwan.dagana@gmail.com

---

## 📄 License

MIT — free to use for personal projects and client work.

---

## 📊 Repository Stats

![GitHub repo size](https://img.shields.io/github/repo-size/daganoo/smart_contact_form)
![GitHub last commit](https://img.shields.io/github/last-commit/daganoo/smart_contact_form)
![GitHub language count](https://img.shields.io/github/languages/count/daganoo/smart_contact_form)
