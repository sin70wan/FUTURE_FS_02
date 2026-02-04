const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
    try {
        console.log('🔗 Connecting to MongoDB...');
        
        // Use modern MongoDB connection (no deprecated options)
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lead-crm');
        
        console.log('✅ MongoDB Connected');
        
        // Default credentials
        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@nexuscrm.com';
        const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
        
        // Check if admin already exists
        const adminExists = await User.findOne({ email: adminEmail });
        
        if (!adminExists) {
            const admin = await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            
            console.log('✅ Admin user created successfully!');
            console.log('📧 Email:', admin.email);
            console.log('🔑 Password:', adminPassword);
            console.log('👑 Role:', admin.role);
        } else {
            console.log('✅ Admin user already exists');
            console.log('📧 Email:', adminExists.email);
            console.log('👑 Role:', adminExists.role);
            
            // Update password if needed
            if (adminPassword) {
                adminExists.password = adminPassword;
                await adminExists.save();
                console.log('🔑 Password updated');
            }
        }
        
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
};

createAdminUser();