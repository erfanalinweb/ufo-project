# UFO Form with bKash Payment Integration (PostgreSQL + Prisma)

## Setup Instructions

### 1. Install Dependencies
```bash
cd ufo-form
npm install
```

### 2. Database Setup (PostgreSQL)
Install PostgreSQL and create a database:
```sql
CREATE DATABASE ufo_form_db;
CREATE USER ufo_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ufo_form_db TO ufo_user;
```

### 3. Environment Configuration
Create a `.env.local` file in the `ufo-form` directory:

```env
# Database
DATABASE_URL="postgresql://ufo_user:your_password@localhost:5432/ufo_form_db?schema=public"

# bKash Configuration
BKASH_APP_KEY=your_bkash_app_key_here
BKASH_APP_SECRET=your_bkash_app_secret_here
BKASH_USERNAME=your_bkash_username_here
BKASH_PASSWORD=your_bkash_password_here

# Use sandbox for testing, production for live
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta
# BKASH_BASE_URL=https://tokenized.pay.bka.sh/v1.2.0-beta

# Your application base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Database Migration
Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Application
```bash
npm run dev
```

## Application Flow

1. **Form Submission** (`/`)
   - User fills the form with personal details
   - Clicks "আবেদন ফি জমা দিন (২০ টাকা)"
   - Form data is saved to database with status 'pending'
   - bKash payment session is created
   - User is redirected to bKash payment gateway

2. **Payment Process**
   - User enters bKash credentials (number, OTP, PIN)
   - Confirms payment of 20 Taka
   - bKash processes the payment

3. **Payment Callback**
   - bKash redirects back to `/api/bkash/callback`
   - Payment is executed and verified
   - Database is updated with transaction details
   - User is redirected to success page

4. **Success Page** (`/success`)
   - Shows "সঠিক তথ্য দিয়ে আবেদনের জন্য আপনাকে ধন্যবাদ।"
   - Provides home button to return to main page

5. **Admin Dashboard** (`/admin`)
   - View all applications with payment status
   - Filter by payment status (pending, completed, failed)
   - View transaction details and bKash information

## API Routes

- `POST /api/form/submit` - Save form data and create transaction
- `POST /api/bkash/initiate` - Get token and create bKash payment session
- `POST /api/bkash/execute` - Execute bKash payment after user confirmation
- `GET /api/bkash/callback` - Handle bKash payment callback
- `GET /api/admin/applications` - Fetch all applications with transaction data

## Database Schema (Prisma)

### FormData Table
- Personal information (name, father/mother name, NID, DOB, phone)
- Address details (village, union, upazila, district)
- Family & economic info (family members, income source, monthly income, land)
- Housing details (house type, toilet type, water sources)
- Children information (total, male, female counts)
- Donation items requested

### Transaction Table
- Links to FormData (one-to-many relationship)
- Payment details (amount, currency, bKash payment ID, transaction ID)
- Status tracking (PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED, REFUNDED)
- Timestamps (created, updated, completed)
- bKash specific fields (customer number, merchant invoice number)

### Key Features
- ✅ **Relational Design**: Separate form data from payment transactions
- ✅ **Data Integrity**: Foreign key constraints and unique NID validation
- ✅ **Status Tracking**: Comprehensive transaction status management
- ✅ **Audit Trail**: Complete timestamp tracking for all operations

## Features

- ✅ Complete form with validation
- ✅ bKash payment integration
- ✅ Database storage with SQLite
- ✅ Payment status tracking
- ✅ Success page with Bengali text
- ✅ Admin dashboard for monitoring
- ✅ Responsive design
- ✅ Error handling and user feedback
- ✅ Loading states during submission

## Notes

- The application fee is set to 20 Taka
- Each NID can only submit one application (unique constraint)
- All form fields are required
- Payment status: pending, completed, failed
- Admin dashboard shows real-time application data