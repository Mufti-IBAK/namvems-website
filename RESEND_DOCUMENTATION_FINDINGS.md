# Resend Documentation Research & Findings

## Key Resend Documentation Points

### From Address Requirements
1. **Test Domain**: `onboarding@resend.dev` - Always available for testing
2. **Custom From Names**: When using test domain, format should be `Your Name <onboarding@resend.dev>`
3. **API Name Matching**: User mentioned changing API name to "NAMVEMS" - should use `NAMVEMS <onboarding@resend.dev>`

### API Permissions
- **Sending Access**: Basic permission for sending emails
- **Full Access**: Includes sending + domain management + webhook management
- **Key Point**: Full access shouldn't break existing functionality, but format might need adjustment

### Rate Limits
- **Test Domain**: 100 emails per day
- **Verified Domain**: Higher limits based on plan
- **Batch Sending**: Max 50 recipients per API call (we're already implementing this)

### HTML Email Requirements
- **Size Limits**: Max 100KB per email
- **Content Restrictions**: 
  - No external CSS links
  - Inline styles preferred
  - No JavaScript
  - Images should be properly encoded or hosted

### Common Issues
1. **Large HTML Templates**: Can cause silent failures
2. **Malformed From Addresses**: Must follow RFC 5322 format
3. **Missing Required Fields**: `from`, `to`, `subject` are mandatory
4. **Batch Array Format**: Recipients in batch calls must be properly formatted

## Identified Issues in Our Code

### 1. From Address Format
Current: `NAMVEMS <onboarding@resend.dev>`
Should be: `NAMVEMS <onboarding@resend.dev>` ✅ (Already correct)

### 2. Large HTML Templates
Our email templates are quite large with extensive styling. This might be causing silent failures.

### 3. Batch Email Structure
Need to verify our batch email structure matches Resend requirements exactly.

## Fixes to Implement
1. Update from address to match user's API name: `NAMVEMS@resend.dev` 
2. Simplify HTML templates to reduce size
3. Add better error logging to catch silent failures
4. Test with minimal content first, then gradually add styling
