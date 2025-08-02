# Admin User Setup Guide

## 🔐 **Default Admin Credentials**

The system automatically creates a default admin user when you first start the application:

### **Default Admin Login:**
```
Email: admin@eventbooker.com
Password: Admin@123
```

## 🚀 **Automatic Admin Creation**

The system now automatically creates a default admin user when:
1. **No users exist** in the database
2. **App initializes** for the first time
3. **Database is empty** and needs initial setup

### **What Happens:**
- ✅ **Automatic Detection**: System checks if any users exist
- ✅ **Admin Creation**: Creates default admin if no users found
- ✅ **Full Permissions**: Admin gets all system permissions
- ✅ **Ready to Use**: Can immediately access admin panel

## 🛠 **Manual Admin Creation (If Automatic Fails)**

If you get "Invalid credentials" error, the admin user needs to be created manually in Appwrite:

### **Method 1: Appwrite Console (Recommended)**

1. **Go to Appwrite Console** → **Authentication** → **Users**
2. **Click "Create User"**
3. **Enter the following details:**
   - **Email**: `admin@eventbooker.com`
   - **Password**: `Admin@123`
   - **Name**: `System Administrator`
4. **Save the user**
5. **Go to Databases** → **eventbooker_db** → **users**
6. **Create a new document** with:
   ```json
   {
     "$id": "same_as_auth_user_id",
     "email": "admin@eventbooker.com",
     "name": "System Administrator",
     "role": "admin",
     "status": "active",
     "profile": "{\"isAdmin\": true, \"permissions\": [\"events\", \"bookings\", \"users\", \"analytics\", \"settings\"], \"createdBy\": \"system\", \"isDefaultAdmin\": true}"
   }
   ```

### **Method 2: Using the Script**

1. **Edit** `utils/create-admin-manual.js`
2. **Replace** `'your-project-id'` with your actual Appwrite project ID
3. **Run the script**:
   ```bash
   node utils/create-admin-manual.js
   ```

### **Method 3: Registration Method**

1. **Go to** `/auth/register`
2. **Register with**:
   - Email: `admin@eventbooker.com`
   - Password: `Admin@123`
   - Name: `System Administrator`
3. **Go to Appwrite Console** → **Databases** → **eventbooker_db** → **users**
4. **Find your user** and change role to `"admin"`

## 🛠 **How to Access Admin Panel**

### **Method 1: Quick Admin Login (Recommended)**
1. **Go to**: `/auth/login`
2. **Click**: "Admin Login" button
3. **Use credentials**:
   - Email: `admin@eventbooker.com`
   - Password: `Admin@123`
4. **Access**: Admin panel automatically

### **Method 2: Regular Login**
1. **Go to**: `/auth/login`
2. **Enter credentials**:
   - Email: `admin@eventbooker.com`
   - Password: `Admin@123`
3. **Click**: "Sign in"
4. **Access**: Admin panel via profile menu

### **Method 3: Direct Admin Setup Page**
1. **Go to**: `/admin-setup`
2. **View**: Admin credentials and features
3. **Click**: "Login as Admin"
4. **Access**: Admin panel directly

## 🔑 **Admin Roles and Permissions**

### **Available Roles:**
- **`user`** - Regular user, can book events
- **`admin`** - Can manage events, bookings, users, analytics
- **`super_admin`** - Full system access (future feature)

### **Admin Permissions:**
- ✅ **Events Management** - Create, edit, delete events
- ✅ **Bookings Management** - View and manage all bookings
- ✅ **User Management** - View and manage user accounts
- ✅ **Analytics** - View system analytics and reports
- ✅ **Settings** - Manage system settings

## 🚀 **Quick Setup Steps**

### **Step 1: Start the Application**
```bash
npm run dev
```

### **Step 2: Create Admin User (If Needed)**
If automatic creation fails, create manually:
1. **Appwrite Console** → **Authentication** → **Users**
2. **Create user**: `admin@eventbooker.com` / `Admin@123`
3. **Database** → **eventbooker_db** → **users** → **Create profile**

### **Step 3: Access Admin Setup**
1. Open: `http://localhost:3000/admin-setup`
2. View default admin credentials
3. Click "Login as Admin"

### **Step 4: Login and Access**
1. Go to: `/auth/login`
2. Click "Admin Login" button
3. Use default credentials
4. Access admin panel

## 📋 **Admin Panel Features**

### **Dashboard** (`/admin`)
- Overview of system statistics
- Recent bookings and events
- Quick actions

### **Events** (`/admin/events`)
- Create new events
- Edit existing events
- Delete events
- Manage event details

### **Bookings** (`/admin/bookings`)
- View all bookings
- Filter by status, date, user
- Manage booking status
- Export booking data

### **Users** (`/admin/users`)
- View all user accounts
- Change user roles
- Manage user status
- View user statistics

### **Analytics** (`/admin/analytics`)
- Revenue reports
- Booking trends
- User statistics
- Event performance

### **Settings** (`/admin/settings`)
- System configuration
- Payment settings
- Email templates
- General settings

## 🔒 **Security Best Practices**

### **Change Default Password**
1. Login as admin
2. Go to **Profile Settings**
3. Change the default password
4. Use a strong password

### **Create Additional Admin Users**
1. Create multiple admin accounts
2. Use different email addresses
3. Set up proper access controls

### **Regular Security Checks**
1. Monitor user activities
2. Review admin actions
3. Keep credentials secure

## 🆘 **Troubleshooting**

### **"Invalid credentials" Error?**
1. **Create admin user manually** in Appwrite Console
2. **Follow manual creation steps** above
3. **Check if user exists** in Authentication → Users
4. **Verify database profile** exists in Databases → users

### **Can't Access Admin Panel?**
1. **Check if admin was created** - Visit `/admin-setup`
2. **Verify login** was successful
3. **Clear browser cache** and try again
4. **Check console errors** for issues

### **Admin Role Not Working?**
1. **Verify role field** in database
2. **Check user status** is "active"
3. **Refresh the page** after role change
4. **Logout and login** again

### **Permission Issues?**
1. **Check user permissions** in profile
2. **Verify database permissions** in Appwrite
3. **Contact support** if issues persist

## 📞 **Support**

If you encounter any issues:

1. **Check the console** for error messages
2. **Verify Appwrite configuration**
3. **Review database permissions**
4. **Contact the development team**

---

## 🎯 **Next Steps**

1. **Start the application**: `npm run dev`
2. **Create admin user** (if automatic fails)
3. **Visit admin setup**: `/admin-setup`
4. **Login with default credentials**
5. **Change the default password**
6. **Explore the admin panel features**
7. **Create additional admin users**
8. **Set up your events and manage bookings**

**Default Admin Login:**
- **Email**: `admin@eventbooker.com`
- **Password**: `Admin@123`

**Quick Access:**
- **Admin Setup**: `/admin-setup`
- **Admin Login**: `/auth/login` → "Admin Login" button
- **Admin Panel**: `/admin`

**Manual Creation:**
- **Appwrite Console**: Authentication → Users → Create User
- **Script**: `utils/create-admin-manual.js` 