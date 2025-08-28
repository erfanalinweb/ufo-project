# Production Deployment Guide

## Overview
This guide will help you transition from sandbox/testing environment to production for the UFO Form application with bKash payment integration.

## Current Configuration (Sandbox)
Currently, the application is configured for testing with:
- bKash Sandbox environment
- Test credentials
- Local development setup

## Production Requirements

### 1. bKash Production Credentials
To move to production, you need to obtain production credentials from bKash:

```env
# Replace these sandbox values with production ones
BKASH_APP_KEY=your_production_bkash_app_key
BKASH_APP_SECRET=your_production_bkash_app_secret  
BKASH_USERNAME=your_production_bkash_username
BKASH_PASSWORD=your_production_bkash_password

# Change from sandbox to production URL
BKASH_BASE_URL=https://tokenized.pay.bka.sh/v1.2.0-beta
```

### 2. Production Database
Update your database connection for production:
```env
DATABASE_URL="your_production_database_connection_string"
```

### 3. Production Domain
Update your base URL to your actual domain:
```env
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 4. Security Configuration
Generate a strong JWT secret for production:
```env
JWT_SECRET=your_very_strong_production_jwt_secret_key_minimum_32_characters
```

## Steps to Get bKash Production Access

### 1. Apply for bKash Merchant Account
Contact bKash to apply for a production merchant account:
- **Email**: merchant@bkash.com
- **Phone**: +880-1515-268-268
- **Website**: https://www.bkash.com/

### 2. Required Documents
Prepare the following documents:
- **Business Registration Certificate**
- **Trade License**
- **Tax Identification Number (TIN)**
- **Bank Account Details**
- **Authorized Person's NID**
- **Business Address Proof**
- **Application Details** (what your application does)

### 3. Technical Integration Requirements
- **Callback URL**: Your production domain callback endpoint
- **IP Whitelisting**: Provide your production server IP addresses
- **SSL Certificate**: Ensure your domain has valid SSL certificate

### 4. Verification Process
- bKash will verify your business documents
- Technical integration testing
- Security compliance check
- Final approval and credential issuance

## Environment Configuration

### Development Environment (.env.local)
```env
# Database
DATABASE_URL="your_development_database_url"

# bKash Sandbox Configuration
BKASH_APP_KEY=4f6o0cjiki2rfm34kfdadl1eqq
BKASH_APP_SECRET=2is7hdktrekvrbljjh44ll3d9l1dtjo4pasmjvs5vl5qr3fug4b
BKASH_USERNAME=sandboxTokenizedUser02
BKASH_PASSWORD=sandboxTokenizedUser02@12345
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta

# Local development URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Development JWT Secret
JWT_SECRET=development-jwt-secret-key
```

### Production Environment (.env.production)
```env
# Database
DATABASE_URL="your_production_database_url"

# bKash Production Configuration
BKASH_APP_KEY=your_production_app_key
BKASH_APP_SECRET=your_production_app_secret
BKASH_USERNAME=your_production_username
BKASH_PASSWORD=your_production_password
BKASH_BASE_URL=https://tokenized.pay.bka.sh/v1.2.0-beta

# Production domain
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Strong production JWT secret
JWT_SECRET=your_very_strong_production_jwt_secret_minimum_32_characters
```

## Deployment Checklist

### Pre-Deployment
- [ ] Obtain bKash production credentials
- [ ] Set up production database
- [ ] Configure production domain with SSL
- [ ] Generate strong JWT secret
- [ ] Test all functionality in sandbox environment
- [ ] Backup current data

### Environment Setup
- [ ] Create production environment variables
- [ ] Configure server environment
- [ ] Set up database migrations
- [ ] Configure logging and monitoring
- [ ] Set up error tracking

### Security
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set secure headers
- [ ] Implement rate limiting
- [ ] Set up firewall rules
- [ ] Configure IP whitelisting if required

### Testing
- [ ] Test payment flow with small amounts
- [ ] Verify form submissions
- [ ] Test admin panel functionality
- [ ] Check email notifications (if implemented)
- [ ] Verify database operations
- [ ] Test error handling

### Go-Live
- [ ] Deploy to production server
- [ ] Update DNS records
- [ ] Monitor application logs
- [ ] Test end-to-end functionality
- [ ] Notify stakeholders

## Important Security Notes

### Environment Variables
- **Never commit production credentials to version control**
- Use environment variables or secure secret management
- Keep development and production environments separate
- Regularly rotate secrets and passwords

### Database Security
- Use strong database passwords
- Enable SSL connections
- Implement proper backup strategies
- Set up monitoring and alerts

### Application Security
- Keep dependencies updated
- Implement proper input validation
- Use HTTPS everywhere
- Set up proper logging and monitoring

## Monitoring and Maintenance

### Application Monitoring
- Set up uptime monitoring
- Monitor payment transaction logs
- Track application performance
- Set up error alerts

### Database Monitoring
- Monitor database performance
- Set up backup schedules
- Track storage usage
- Monitor connection pools

### Payment Monitoring
- Monitor bKash transaction success rates
- Track failed payments
- Set up payment reconciliation
- Monitor for suspicious activities

## Support and Troubleshooting

### bKash Support
- **Technical Support**: techsupport@bkash.com
- **Merchant Support**: merchant@bkash.com
- **Documentation**: https://developer.bka.sh/

### Common Issues
1. **Payment failures**: Check credentials and network connectivity
2. **SSL certificate issues**: Ensure valid SSL certificate
3. **Database connection issues**: Verify connection string and network access
4. **CORS errors**: Configure proper CORS settings

## Contact Information

For technical assistance with this application:
- Review application logs
- Check environment configuration
- Verify network connectivity
- Contact your development team

---

**Note**: This guide assumes you have the necessary business licenses and approvals to operate a payment-enabled application in Bangladesh. Ensure compliance with local regulations and bKash's terms of service.