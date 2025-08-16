# The Bigger Boss - API Documentation

## Overview
This document outlines the API endpoints for The Bigger Boss website, primarily focused on lead magnet collection, user qualification, and analytics tracking.

## Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://thebiggerboss.com/api`

## Authentication
Currently, all endpoints are public as this is a marketing website. Future authentication will be implemented for user dashboards.

## Endpoints

### Lead Magnet Endpoints

#### POST `/api/lead-magnets/submit`
Submit lead magnet form data and initiate download/access.

**Request Body:**
```typescript
{
  email: string;           // Required: User email address
  firstName?: string;      // Optional: User first name
  lastName?: string;       // Optional: User last name
  company?: string;        // Optional: Company name
  challenge?: string;      // Optional: Biggest content challenge
  persona: 'smb' | 'agency'; // Required: User persona
  magnetType: 'pdf' | 'webinar'; // Required: Lead magnet type
  source?: string;         // Optional: Traffic source
  utmParams?: {           // Optional: UTM tracking parameters
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  }
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  downloadUrl?: string;    // For PDF downloads
  accessLink?: string;     // For webinar registration
  leadId: string;         // Unique lead identifier
}
```

**Example Request:**
```bash
curl -X POST https://thebiggerboss.com/api/lead-magnets/submit \
  -H "Content-Type: application/json" \
  -d '{
    "email": "samira@example.com",
    "firstName": "Samira",
    "company": "Local Bakery",
    "challenge": "Creating consistent content",
    "persona": "smb",
    "magnetType": "pdf"
  }'
```

#### GET `/api/lead-magnets/download/[id]`
Retrieve lead magnet download link (secured endpoint).

**Parameters:**
- `id`: Lead magnet identifier

**Response:**
```typescript
{
  success: boolean;
  downloadUrl: string;
  expiresAt: string;      // ISO timestamp
}
```

### Analytics Endpoints

#### POST `/api/analytics/track-event`
Track custom events for conversion optimization.

**Request Body:**
```typescript
{
  event: string;          // Event name (e.g., 'lead_magnet_view')
  properties: {           // Event properties
    page?: string;        // Page URL
    persona?: string;     // User persona
    magnetType?: string;  // Lead magnet type
    source?: string;      // Traffic source
    [key: string]: any;   // Additional properties
  };
  userId?: string;        // Anonymous or identified user ID
  sessionId: string;      // Session identifier
}
```

**Response:**
```typescript
{
  success: boolean;
  eventId: string;
}
```

#### POST `/api/analytics/page-view`
Track page views with enhanced metadata.

**Request Body:**
```typescript
{
  page: string;           // Page URL
  title: string;          // Page title
  referrer?: string;      // Referrer URL
  userAgent: string;      // User agent string
  sessionId: string;      // Session identifier
  utmParams?: {           // UTM parameters
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  }
}
```

### Contact Form Endpoints

#### POST `/api/contact/submit`
Submit general contact form inquiries.

**Request Body:**
```typescript
{
  name: string;           // Required: Contact name
  email: string;          // Required: Contact email
  company?: string;       // Optional: Company name
  message: string;        // Required: Inquiry message
  inquiryType: 'general' | 'sales' | 'support' | 'partnership';
  phone?: string;         // Optional: Phone number
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  ticketId?: string;      // Support ticket ID if applicable
}
```

### A/B Testing Endpoints

#### GET `/api/ab-test/variant`
Retrieve A/B test variant for current session.

**Query Parameters:**
- `test`: Test name (e.g., 'lead_magnet_type')
- `persona`: User persona ('smb' | 'agency')

**Response:**
```typescript
{
  success: boolean;
  variant: string;        // Variant identifier
  testId: string;         // Test identifier
}
```

#### POST `/api/ab-test/convert`
Track conversion event for A/B test.

**Request Body:**
```typescript
{
  testId: string;         // Test identifier
  variant: string;        // Variant identifier
  conversionType: string; // Conversion event type
  sessionId: string;      // Session identifier
}
```

## Error Handling

All endpoints return consistent error responses:

```typescript
{
  success: false;
  error: {
    code: string;         // Error code (e.g., 'VALIDATION_ERROR')
    message: string;      // Human-readable error message
    details?: any;        // Additional error details
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Invalid request data
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server-side error
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Authentication required

## Rate Limiting

### Current Limits
- **Lead Magnet Submissions**: 5 requests per minute per IP
- **Analytics Events**: 100 requests per minute per IP
- **Contact Form**: 3 requests per minute per IP

### Rate Limit Headers
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1640995200
```

## Webhooks (Future Implementation)

### Lead Magnet Webhook
**Endpoint**: `POST /api/webhooks/lead-magnet`
Triggered when new lead magnet is submitted.

**Payload:**
```typescript
{
  event: 'lead.created';
  data: {
    leadId: string;
    email: string;
    persona: string;
    magnetType: string;
    timestamp: string;
  }
}
```

## Testing

### Development Testing
Use Postman collection or curl commands for API testing:

```bash
# Test lead magnet submission
curl -X POST http://localhost:3000/api/lead-magnets/submit \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","persona":"smb","magnetType":"pdf"}'

# Test analytics tracking
curl -X POST http://localhost:3000/api/analytics/track-event \
  -H "Content-Type: application/json" \
  -d '{"event":"test_event","properties":{"page":"/"},"sessionId":"test-session"}'
```

### Production Testing
- Use staging environment for integration testing
- Monitor error rates and response times
- Validate A/B test variant distribution

## Security Considerations

### Data Validation
- All inputs validated using Zod schemas
- Email format validation
- SQL injection prevention
- XSS protection

### Privacy Compliance
- No sensitive data logged
- GDPR-compliant data handling
- Cookie consent integration
- Data retention policies enforced

### Monitoring
- API response time monitoring
- Error rate tracking
- Usage analytics
- Security event logging

## Future Enhancements

### Planned Features
- User authentication endpoints
- CRM integration webhooks
- Advanced analytics dashboard API
- Real-time collaboration endpoints

### Scalability Considerations
- Database connection pooling
- Caching layer implementation
- Microservices migration path
- Load balancing strategies

---

*Generated via context7 MCP documentation research*
*Last Updated: Project initialization*
*API Version: v1.0.0*