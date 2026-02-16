# Domain Update Guide: music-up-alpha.vercel.app → www.musicup.co

This guide outlines the configuration changes needed after updating your domain from `https://music-up-alpha.vercel.app` to `https://www.musicup.co`.

## ✅ Completed Code Changes

The following have already been updated in the codebase:

- **Main Layout** (`src/app/layout.tsx`): Updated metadataBase and Open Graph URLs
- **Series Layout** (`src/app/series/layout.tsx`): Updated canonical and Open Graph URLs
- **Library Layout** (`src/app/library/layout.tsx`): Updated canonical and Open Graph URLs
- **Structured Data** (`src/components/structured-data.tsx`): Updated organization URLs
- **Robots.txt** (`src/app/robots.ts`): Updated base URL
- **Sitemap** (`src/app/sitemap.ts`): Updated base URL
- **Environment Examples** (`.env.example`): Updated production URL documentation

## 🔧 Required Configuration Updates

### 1. Vercel Environment Variables

Update the following environment variable in your Vercel project:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables
2. Update or add:
   ```
   NEXT_PUBLIC_APP_URL=https://www.musicup.co
   ```
3. Set this for **Production**, **Preview**, and **Development** environments
4. **Redeploy** your application after updating

### 2. Supabase URL Configuration

**CRITICAL:** Update your Supabase authentication settings to allow the new domain's callback URL.

#### Steps:

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your MusicUp project
3. Navigate to **Authentication** → **URL Configuration**
4. Update **Site URL** to:
   ```
   https://www.musicup.co
   ```

5. Update **Redirect URLs** to include:
   ```
   https://www.musicup.co/auth/callback
   https://www.musicup.co/reset-password
   http://localhost:3000/auth/callback (for development)
   http://localhost:3000/reset-password (for development)
   ```

6. **Remove old URLs** (optional but recommended):
   - `https://music-up-alpha.vercel.app/auth/callback`
   - `https://music-up-alpha.vercel.app/reset-password`

#### Why This Matters:

Without updating the Supabase redirect URLs, users will continue to see errors when:
- Clicking password reset links from emails
- Being redirected after email confirmation
- Using any authentication flow that requires a callback

### 3. Email Configuration (Resend)

If you're using custom email links in Resend templates, update any hardcoded URLs:

1. Go to [Resend Dashboard](https://resend.com/dashboard)
2. Check your email templates
3. Update any URLs from `music-up-alpha.vercel.app` to `www.musicup.co`

### 4. Vercel Custom Domain

Ensure your custom domain is properly configured in Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add `www.musicup.co` if not already added
3. Configure DNS settings as instructed by Vercel
4. Set `www.musicup.co` as the primary domain if desired

## 🧪 Testing After Configuration

### 1. Password Reset Flow
- Go to `/forgot-password`
- Enter your email
- Click the link in the email
- Verify you're redirected to `/reset-password` successfully
- Set a new password
- Confirm you can log in

### 2. Social Media Sharing
Test Open Graph tags using:
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

Enter `https://www.musicup.co` and verify:
- Correct title appears
- Description is accurate
- Auto-generated image displays correctly

### 3. Sitemap & Robots
- Visit `https://www.musicup.co/sitemap.xml`
- Visit `https://www.musicup.co/robots.txt`
- Verify all URLs use the new domain

### 4. Search Console
If you're using Google Search Console:
1. Add the new domain as a property
2. Submit the new sitemap: `https://www.musicup.co/sitemap.xml`
3. Monitor for any crawl errors

## 📸 Open Graph Images (Auto-Generated)

The application now automatically generates Open Graph images at build time using Next.js's built-in image generation:

1. **Main OG Image**: `src/app/opengraph-image.tsx`
   - Auto-generated at 1200x630px
   - Features MusicUp logo, tagline, and description
   - Uses brand colors (orange gradient: #EB6A18 to #c2410c)

2. **Series OG Image**: `src/app/series/opengraph-image.tsx`
   - Auto-generated at 1200x630px
   - Showcases the 9 concert series
   - Includes series names with emoji icons

These images are dynamically created during the build process and served at `/opengraph-image` and `/series/opengraph-image` respectively. No manual image creation needed!

## 🚀 Deployment Checklist

After making all configuration changes:

- [ ] Updated Vercel environment variable `NEXT_PUBLIC_APP_URL`
- [ ] Updated Supabase Site URL
- [ ] Updated Supabase Redirect URLs
- [ ] Redeployed application from Vercel
- [ ] Tested password reset flow end-to-end
- [ ] Verified social media sharing shows correct metadata
- [ ] Checked sitemap.xml uses new domain
- [ ] Checked robots.txt uses new domain
- [x] Open Graph images are auto-generated at build time
- [ ] Updated DNS records if needed
- [ ] Tested all major user flows on production

## 📋 Quick Reference

| Configuration | Location | New Value |
|--------------|----------|-----------|
| Vercel Env Var | Vercel Dashboard → Settings → Environment Variables | `NEXT_PUBLIC_APP_URL=https://www.musicup.co` |
| Supabase Site URL | Supabase Dashboard → Authentication → URL Configuration | `https://www.musicup.co` |
| Supabase Redirect URL | Supabase Dashboard → Authentication → URL Configuration | `https://www.musicup.co/auth/callback` |
| Custom Domain | Vercel Dashboard → Settings → Domains | `www.musicup.co` |

## ⚠️ Common Issues

### Issue: Password reset still shows old domain in email
**Solution**: The redirect URL is cached in Supabase emails. Users who received emails before the update need to request a new password reset email.

### Issue: Social media shows old domain when sharing
**Solution**: Clear the cache in Facebook Debugger and Twitter Card Validator by entering the new URL.

### Issue: Authentication callback fails
**Solution**: Double-check that `https://www.musicup.co/auth/callback` is added to Supabase Redirect URLs (not just Site URL).

## 📞 Support

If you encounter issues after following this guide:
1. Check Supabase logs: Dashboard → Logs
2. Check Vercel logs: Dashboard → Deployments → View Function Logs
3. Check browser console for errors
4. Verify environment variables are set correctly: `console.log(process.env.NEXT_PUBLIC_APP_URL)`

---

**Last Updated**: 2025-11-12
**Status**: Configuration changes required in Vercel and Supabase
