import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req:NextRequest) {
    try {
        const videos = await prisma.video.findMany({
            orderBy:{createdAt :'desc'}
        });

        return NextResponse.json(videos);
    } catch (error) {
        console.log(error);
        return NextResponse.json({error : "Something went wrong in fetching /video"},{
            status : 500
        });
    }
    finally
    {
        await prisma.$disconnect();
    }
}