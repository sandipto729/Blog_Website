import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongo';
import User from '@/model/user';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try{
        const { name, email, password } = await request.json();
        await connectDB();
        
        const user = await User.findOne({ email });
        if(user) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }
        
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const newUser = await User.create({ 
            name, 
            email, 
            password: hashedPassword,
            isSetPassword: true
        });
        
        return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    }
    catch(error){
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}