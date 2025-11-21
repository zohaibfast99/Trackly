import { db } from "@/lib/db";
import { userRequired } from "../user/is-user-authenticated";

export const getUserWorkspaces = async () => {
    try{
        const { user } = await userRequired();

        // Check if user exists in database, if not create them
        let dbUser = await db.user.findUnique({
            where: {id: user.id},
            include: {
                workspaces: {
                    select: {
                        id: true,
                        userId: true,
                        workspaceId: true,
                        accessLevel: true,
                        createdAt: true,
                        workspace: {select: {name: true}},
                    },
                },
            },
        });

        // If user doesn't exist in database, create them
        if (!dbUser) {
            console.log("User not found in DB, creating new user:", user.id);
            dbUser = await db.user.create({
                data: {
                    id: user.id,
                    name: user.given_name && user.family_name 
                        ? `${user.given_name} ${user.family_name}` 
                        : user.given_name || user.family_name || 'Unknown User',
                    email: user.email || '',
                    image: user.picture || null,
                    onboardingCompleted: false,
                },
                include: {
                    workspaces: {
                        select: {
                            id: true,
                            userId: true,
                            workspaceId: true,
                            accessLevel: true,
                            createdAt: true,
                            workspace: {select: {name: true}},
                        },
                    },
                },
            });
        }

        return {data: dbUser}
    }catch (error) {
        // Check if it's a redirect error and re-throw it
        if (error && typeof error === 'object' && 'digest' in error) {
            const digest = (error as any).digest;
            if (typeof digest === 'string' && digest.includes('NEXT_REDIRECT')) {
                throw error;
            }
        }
        
        console.error("Error in getUserWorkspaces:", error)
        return{
            success:false,
            error:true,
            message: "Failed to fetch workspaces",
            status: 500,
        };
    }
};