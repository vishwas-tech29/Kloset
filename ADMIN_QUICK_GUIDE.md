# 🎯 Admin Quick Guide - Product Management

## 🚀 Quick Start

### Access Admin Panel
1. Go to: `http://localhost:3001/admin`
2. Enter password: `admin123`
3. Click "Products" in sidebar

---

## 📝 Edit a Product

### Step-by-Step:

**1. Find Your Product**
```
Admin → Products → Find product → Click "Edit" button
```

**2. Edit Product Page**
You'll see two main sections:

#### Left Side: Product Images
- Current images displayed
- Click "Choose Files" to add new images
- Click X on any image to remove it
- Multiple images supported

#### Right Side: Product Details
- Product Name
- Description
- Price (₹)
- Compare Price (₹) - optional
- Category dropdown
- Published checkbox
- Featured checkbox

**3. Make Your Changes**
- Update any field you want
- Upload new images if needed
- Remove unwanted images

**4. Save**
- Click "Save Changes" button
- Wait for confirmation
- Done!

---

## 🖼️ Managing Images

### Upload New Images
```
1. Click "Choose Files" button
2. Select one or multiple images
3. Preview appears immediately
4. Images not saved until you click "Save Changes"
```

### Remove Images
```
1. Hover over any image
2. Click the X button that appears
3. Image marked for removal
4. Confirm by clicking "Save Changes"
```

### Tips
- Use high-quality images (800x1000px recommended)
- JPG, PNG, or WebP formats
- Multiple images show as gallery on product page
- First image is the main product image

---

## 💰 Changing Prices

### Regular Price
```
1. Find "Price (₹)" field
2. Enter new price (numbers only)
3. Example: 2499 for ₹2,499
4. Click "Save Changes"
```

### Sale Price (Compare Price)
```
1. Find "Compare Price (₹)" field
2. Enter original price (higher than sale price)
3. Example: Price: 1999, Compare: 2999
4. Shows as: ₹1,999 ~~₹2,999~~
5. Click "Save Changes"
```

---

## 📂 Changing Category

### Available Categories:
- Men
- Women
- Printed
- Embroidery
- Custom

### How to Change:
```
1. Find "Category" dropdown
2. Select new category
3. Click "Save Changes"
4. Product now appears in new category
```

---

## 👁️ Visibility Controls

### Published Status
```
☑️ Published = Visible to customers
☐ Published = Hidden (draft mode)
```

**Use Cases:**
- Uncheck to hide out-of-stock items
- Uncheck while updating product
- Check to make product live

### Featured Status
```
☑️ Featured = Shows on homepage
☐ Featured = Regular product
```

**Use Cases:**
- Check for new arrivals
- Check for bestsellers
- Check for promotional items
- Limit to 6-8 featured products

---

## 🗑️ Deleting Products

### From Products List:
```
1. Find product
2. Click trash icon
3. Confirm deletion
4. Product permanently removed
```

**Warning:** This cannot be undone!

---

## 📊 Product List View

### What You See:
- Product image
- Product name
- Price (₹)
- Category
- Status badges (Published/Draft, Featured)
- Stock count
- Edit button
- Delete button

### Stats at Top:
- Total Products
- Published Products
- Total Stock

---

## 🎨 Visual Guide

### Products List Page
```
┌─────────────────────────────────────────────────┐
│  Products                    [+ Add Product]    │
├─────────────────────────────────────────────────┤
│  [Total: 19] [Published: 19] [Stock: 450]      │
├─────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  [IMG]   │  │  [IMG]   │  │  [IMG]   │     │
│  │  Name    │  │  Name    │  │  Name    │     │
│  │  ₹2,499  │  │  ₹5,999  │  │  ₹4,499  │     │
│  │ Published│  │ Published│  │  Draft   │     │
│  │[Edit][🗑]│  │[Edit][🗑]│  │[Edit][🗑]│     │
│  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────┘
```

### Edit Product Page
```
┌─────────────────────────────────────────────────┐
│  [←] Edit Product                               │
├─────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Images       │  │ Product Details      │   │
│  │              │  │                      │   │
│  │ [IMG] [IMG]  │  │ Name: [________]     │   │
│  │ [IMG] [IMG]  │  │ Desc: [________]     │   │
│  │              │  │ Price: [_____]       │   │
│  │ [+ Upload]   │  │ Category: [▼]        │   │
│  │              │  │ ☑ Published          │   │
│  │              │  │ ☑ Featured           │   │
│  └──────────────┘  └──────────────────────┘   │
│                                                 │
│                    [Cancel] [Save Changes]     │
└─────────────────────────────────────────────────┘
```

---

## ⚡ Quick Actions

### Make Product Featured
```
Edit → Check "Featured" → Save
```

### Hide Product Temporarily
```
Edit → Uncheck "Published" → Save
```

### Change Price
```
Edit → Update "Price" field → Save
```

### Add More Images
```
Edit → Choose Files → Select images → Save
```

### Move to Different Category
```
Edit → Select new category → Save
```

---

## 💡 Pro Tips

### Best Practices
1. **Images:** Use consistent image sizes
2. **Prices:** Round numbers work best (₹2,499 vs ₹2,499.99)
3. **Featured:** Limit to 6-8 products
4. **Descriptions:** Keep under 200 characters
5. **Categories:** Choose most relevant category

### Common Workflows

**New Product Launch:**
```
1. Create product (draft)
2. Add all images
3. Set price
4. Write description
5. Check "Published"
6. Check "Featured" (optional)
7. Save
```

**Sale/Discount:**
```
1. Edit product
2. Lower "Price"
3. Set "Compare Price" to original
4. Check "Featured" to highlight
5. Save
```

**Out of Stock:**
```
1. Edit product
2. Uncheck "Published"
3. Save
4. Re-check when back in stock
```

---

## 🐛 Troubleshooting

### Images Not Uploading
- Check file size (under 10MB)
- Use JPG, PNG, or WebP
- Try one image at a time

### Changes Not Saving
- Check all required fields filled
- Verify internet connection
- Try refreshing page

### Product Not Showing on Store
- Check "Published" is checked
- Verify correct category selected
- Clear browser cache

### Edit Button Not Working
- Verify logged into admin
- Check browser console for errors
- Try different browser

---

## 📞 Need Help?

### Quick Checks
1. ✅ Logged into admin?
2. ✅ Internet connected?
3. ✅ All fields filled correctly?
4. ✅ Clicked "Save Changes"?

### Still Having Issues?
- Check browser console (F12)
- Try in incognito mode
- Clear cache and cookies
- Restart dev server

---

## 🎉 You're Ready!

### What You Can Do Now:
✅ Edit any product
✅ Change prices
✅ Upload images
✅ Remove images
✅ Change categories
✅ Toggle visibility
✅ Delete products

### Start Here:
```
http://localhost:3001/admin/products
```

**Happy managing! 🚀**
