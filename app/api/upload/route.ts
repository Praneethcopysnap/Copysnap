import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  console.log('Upload API called');
  
  try {
    // Get authorization header
    const authHeader = request.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No valid authorization header');
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    console.log('Token extracted, creating Supabase client...');
    
    // Create a Supabase client
    const supabase = createClientComponentClient();
    
    try {
      // Verify the token by getting the user
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      
      console.log('User verification result:', userError ? 'Error' : 'Success');
      
      if (userError || !user) {
        console.error('User verification error:', userError);
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
      
      const userId = user.id;
      console.log('Authenticated user ID:', userId);
      
      // Process form data
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      // Validate the file
      if (!file) {
        console.error('No file provided');
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }
      
      console.log('File received:', file.name, file.type, `${file.size} bytes`);
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        console.error('File too large:', file.size);
        return NextResponse.json(
          { error: 'File size exceeds the 10MB limit' },
          { status: 400 }
        );
      }
      
      // Create unique filename
      const fileName = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      console.log('Preparing to save file:', fileName);
      
      // Create directory for user files
      const userDir = join(process.cwd(), 'public', 'uploads', userId);
      await mkdir(userDir, { recursive: true });
      console.log('Directory created at:', userDir);
      
      // Save file to disk
      const filePath = join(userDir, fileName);
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, fileBuffer);
      console.log('File saved to:', filePath);
      
      // Public URL for the file
      const publicPath = `/uploads/${userId}/${fileName}`;
      console.log('Public path:', publicPath);
      
      return NextResponse.json({ 
        success: true, 
        filePath: publicPath
      });
    } catch (error: any) {
      console.error('Error during authentication:', error?.message || error);
      return NextResponse.json(
        { error: `Authentication error: ${error?.message || 'Unknown error'}` },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('File upload error:', error?.message || error);
    return NextResponse.json(
      { error: `Failed to upload file: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
} 