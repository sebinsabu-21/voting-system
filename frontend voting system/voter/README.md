# Voter Portal - Supabase Integration

A complete voter portal with OTP verification and user registration, integrated with Supabase for backend services.

## Features

- ✅ User Registration with Username and Phone
- ✅ OTP Generation and Verification
- ✅ Password Creation with Validation
- ✅ Secure Password Hashing
- ✅ **Face Recognition Enrollment & Verification**
- ✅ Database Integration with Supabase
- ✅ Session Management

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- A Supabase project created

## 📚 Setup Instructions

### ⚡ Quick Start (5 minutes)
For a fast setup guide, see **[QUICK_START.md](QUICK_START.md)**

### 📖 Detailed Step-by-Step Guide
For comprehensive instructions with screenshots explanations, see **[SETUP_GUIDE.md](SETUP_GUIDE.md)**

### Summary of Steps:

1. **Create Supabase Account** - Sign up at [supabase.com](https://supabase.com)
2. **Create New Project** - Set up your database project
3. **Get API Credentials** - Copy your Project URL and Anon Key
4. **Set Up Database** - Run the SQL schema to create tables
5. **Configure App** - Update `supabase-config.js` with your credentials
6. **Test** - Open `index.html` and test the registration flow

**The detailed guide includes:**
- Step-by-step instructions with explanations
- Troubleshooting section for common issues
- Screenshots guidance
- Verification checkpoints
- Complete checklist

### 5. Set Up Row Level Security (RLS)

The SQL schema includes RLS policies that allow anonymous users to:
- Insert and read voter records
- Insert, read, and delete OTP verifications

These policies are already included in the schema file. If you need to customize them:
1. Go to **Authentication** → **Policies** in Supabase dashboard
2. Adjust policies as needed for your security requirements

## Project Structure

```
projectad/
├── index.html              # Main landing page (Generate OTP)
├── otp.html               # OTP verification page
├── password.html          # Password creation page
├── script.js              # Main page JavaScript with Supabase integration
├── otp-script.js          # OTP verification JavaScript with Supabase
├── password-script.js     # Password creation JavaScript with Supabase
├── supabase-config.js     # Supabase configuration
├── supabase-schema.sql    # Database schema
├── styles.css             # Styling
└── README.md              # This file
```

## How It Works

### Registration Flow

1. **Generate OTP** (`index.html`)
   - User enters username and phone number
   - System checks if user already exists in Supabase
   - Generates 6-digit OTP and stores it in `otp_verifications` table
   - OTP expires after 5 minutes

2. **Verify OTP** (`otp.html`)
   - User enters the 6-digit OTP
   - System verifies OTP against database
   - Checks if OTP is not expired
   - Deletes used OTP from database

3. **Create Password** (`password.html`)
   - User creates password meeting requirements
   - Confirms password
   - Password is hashed using SHA-256
   - User data is saved to `voters` table

## Database Tables

### `voters`
- `id` (UUID) - Primary key
- `username` (VARCHAR) - Unique username
- `phone` (VARCHAR) - Unique phone number
- `password_hash` (VARCHAR) - Hashed password
- `created_at` (TIMESTAMP) - Registration timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

### `otp_verifications`
- `id` (UUID) - Primary key
- `username` (VARCHAR) - Username
- `phone` (VARCHAR) - Phone number
- `otp` (VARCHAR) - 6-digit OTP
- `expires_at` (TIMESTAMP) - Expiration timestamp
- `created_at` (TIMESTAMP) - Creation timestamp

## Security Features

- ✅ Password hashing (SHA-256)
- ✅ OTP expiration (5 minutes)
- ✅ Unique username and phone constraints
- ✅ Row Level Security (RLS) enabled
- ✅ Input validation on client side

## Testing

1. Open `index.html` in a web browser
2. Enter a username and 10-digit phone number
3. Click "Generate OTP"
4. Check browser console for the generated OTP (in production, this would be sent via SMS)
5. Enter the OTP and click "Submit"
6. Create a password meeting all requirements
7. Click "Register" to complete registration

## Customization

### Change OTP Expiration Time

In `script.js` and `otp-script.js`, modify:
```javascript
expiresAt.setMinutes(expiresAt.getMinutes() + 5); // Change 5 to desired minutes
```

### Use Stronger Password Hashing

Currently using SHA-256. For production, consider using bcrypt or Argon2. You can use Supabase Edge Functions for server-side hashing.

### Enable SMS OTP Delivery

1. Set up Twilio or similar SMS service
2. Create a Supabase Edge Function
3. Call the function when generating OTP
4. Send OTP via SMS instead of showing in alert

## Troubleshooting

### "Invalid API key" Error
- Verify your Supabase URL and anon key in `supabase-config.js`
- Make sure you copied the correct keys from Supabase dashboard

### "Table does not exist" Error
- Run the SQL schema in Supabase SQL Editor
- Check that tables were created in the Table Editor

### "Row Level Security" Error
- Check that RLS policies are created in the SQL schema
- Verify policies in Authentication → Policies

### OTP Not Verifying
- Check browser console for errors
- Verify OTP hasn't expired (5 minutes)
- Check database for OTP records

## 🤖 Face Recognition Setup

The voter portal includes face recognition for secure authentication. To enable this feature:

1. **Download Model Files** - See `FACE_API_SETUP.md` for detailed instructions
2. **Set Up Models Folder** - Create `/models` folder and place model files
3. **Run Web Server** - Required for face-api.js (use `http://localhost` or HTTPS)

**Quick Setup:**
- Download models from: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
- Place in `models/` folder
- Run local web server: `python -m http.server 8000`
- Open: `http://localhost:8000`

See **FACE_API_SETUP.md** for complete setup instructions.

## Future Enhancements

- [ ] Add SMS integration for OTP delivery
- [ ] Implement login functionality
- [ ] Add password reset feature
- [ ] Add email verification
- [ ] Implement user dashboard
- [ ] Add voting functionality
- [ ] Admin panel for voter management
- [ ] Liveness detection (blink detection)
- [ ] Multiple face enrollment options

## Support

For issues or questions:
- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Review browser console for errors
- Verify database schema is correctly set up

