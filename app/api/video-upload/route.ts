import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryUploadResult {
    public_id: string;
    [key: string]: unknown;
    bytes: number;
    duration?: number;
}

export async function POST(req: NextRequest) {
    try {
        const {userId} = await auth();

        if(!userId) {
            return NextResponse.json({error: "Unauthorised"}, {status: 401});
        }

        if(!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
           !process.env.CLOUDINARY_API_KEY || 
           !process.env.CLOUDINARY_API_SECRET
        ) {
            return NextResponse.json({error: "Cloudinary credentials not found"}, {status: 500});
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const originalSize = formData.get("originalSize") as string;

        if(!file) {
            return NextResponse.json({error: "File not found"}, {status: 400});
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        let result = undefined;
        if(file.size > 40 * 1024 * 1024) { // 40 MB limit{}
        result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder : "video-uploads",
                        resource_type : "video",
                        eager: [
                        { quality: "auto", format: "mp4", codec: "h264" }
                        ],
                        eager_async: true
                    },
                    (error, result) => {
                        if(error) {
                            reject(error);
                        }
                        resolve(result as CloudinaryUploadResult);
                    }
                );

                uploadStream.end(buffer);
            }
        );
        }
        else
        {
            result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder : "video-uploads",
                        resource_type : "video",
                        transformation : [
                           {
                            quality : "auto",
                            fetch_format : "mp4"
                           }
                        ]
                    },
                    (error, result) => {
                        if(error) {
                            reject(error);
                        }
                        resolve(result as CloudinaryUploadResult);
                    }
                );

                uploadStream.end(buffer);
            }
        );
        }

        const video = await prisma.video.create({
            data: {
                title,
                description,
                publicId: result.public_id,
                originalSize: originalSize,
                compressedSize: String(result.bytes),
                duration: result.duration || 0,
            }
        });

        return NextResponse.json(video);
        
    } catch (error) {
        console.log("Error in video-upload route", error);
        return NextResponse.json({error: "Video upload route error"}, {status: 500});
    }
    finally {
        await prisma.$disconnect();
    }
}