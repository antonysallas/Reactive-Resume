# Reactive Resume - Troubleshooting Guide

## 🐛 Current Issues Being Investigated

### Issue 2: Social Icon Function Evaluation
**Status**: Investigating template compilation

**Problem Details**:
- Function `getSocialIconUrl(item.icon)` appears as literal string in browser requests
- Expected: Function should be evaluated and return proper icon URL
- Actual: String literal being passed to HTTP request

**Investigation Steps**:
1. ✅ Verified social icons exist in `apps/artboard/public/social-icons/`
2. ⏳ Need to check if artboard app requires rebuild to include new assets
3. ⏳ Investigate template compilation process in artboard

**Code Location**: `apps/artboard/src/templates/ditto.tsx:143`

### Issue 1: MinIO Image Loading
**Status**: Configuration updated, testing required

**Problem Details**:
- Images return `net::ERR_EMPTY_RESPONSE` when accessed from Docker container
- MinIO service is running but images not accessible via URLs like:
  `http://localhost:9000/default/cmaz1z2pn0000parrys9dpxml/pictures/cmaz1z2pn0000parrys9dpxml.jpg`

**Solutions Applied**:
1. ✅ Updated MinIO configuration in `compose.yml`
2. ✅ Added console port 9001 and proper command
3. ⏳ Requires container restart to take effect

## 🔧 Technical Architecture

### MinIO Storage Flow
1. **Upload**: Server uploads images to MinIO bucket
2. **URL Generation**: Storage service creates public URLs
3. **PDF Generation**: Puppeteer tries to access images via URLs
4. **Issue**: localhost URLs not accessible from Docker container context

### Social Icons Flow
1. **Template Rendering**: React components use `getSocialIconUrl()` function
2. **Asset Resolution**: Function should resolve to local or CDN URLs
3. **PDF Rendering**: Puppeteer renders final HTML with resolved URLs
4. **Issue**: Function not being evaluated during template compilation

## 📋 Resolution Checklist

### Immediate Actions Required
- [ ] Restart Docker containers: `podman compose down && podman compose up --build`
- [ ] Test MinIO console access at http://localhost:9001
- [ ] Verify bucket creation and permissions
- [ ] Force rebuild artboard app to include social icons

### Verification Tests
- [ ] Upload test image and verify URL accessibility
- [ ] Generate PDF with profile image and check for errors
- [ ] Test social icons display in PDF output
- [ ] Check browser console for any remaining errors

## 🔍 Debugging Commands

### Check MinIO Status
```bash
# Check if MinIO is responding
curl -f http://localhost:9000/minio/health/live

# Check bucket existence (requires credentials)
curl -H "Authorization: Bearer <token>" http://localhost:9000/default/
```

### Check Artboard Build
```bash
# Rebuild artboard with new assets
nx build artboard

# Check if social icons are included in build
ls -la apps/artboard/dist/social-icons/
```

### Monitor Container Logs
```bash
# Watch all container logs
podman compose logs -f

# Watch specific service
podman compose logs -f minio
```

## 🎯 Expected Outcomes

After applying all fixes:
1. **Images**: Profile pictures should display correctly in PDF exports
2. **Social Icons**: Social network icons should appear properly in templates
3. **URLs**: All asset URLs should resolve correctly from Docker containers
4. **Performance**: No more ERR_EMPTY_RESPONSE errors in logs

## 📝 Notes

- MinIO console will be available at http://localhost:9001 after restart
- Social icons are now available in both client and artboard apps
- URL mapping for localhost→host.docker.internal is handled by printer service
- This troubleshooting guide will be updated as we resolve each issue