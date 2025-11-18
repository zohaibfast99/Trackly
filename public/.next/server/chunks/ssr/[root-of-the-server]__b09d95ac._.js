module.exports = [
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = globalThis;
const db = globalForPrisma.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = db;
}),
"[project]/app/data/user/sync-user.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/app/data/user/sync-user.ts
__turbopack_context__.s([
    "syncUser",
    ()=>syncUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$kinde$2d$oss$2f$kinde$2d$auth$2d$nextjs$2f$dist$2f$server$2e$es$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@kinde-oss/kinde-auth-nextjs/dist/server.es.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$kinde$2d$oss$2f$kinde$2d$auth$2d$nextjs$2f$dist$2f$src$2f$session$2f$index$2e$es$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getKindeServerSession$3e$__ = __turbopack_context__.i("[project]/node_modules/@kinde-oss/kinde-auth-nextjs/dist/src/session/index.es.js [app-rsc] (ecmascript) <export default as getKindeServerSession>");
;
;
const syncUser = async ()=>{
    const { getUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$kinde$2d$oss$2f$kinde$2d$auth$2d$nextjs$2f$dist$2f$src$2f$session$2f$index$2e$es$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getKindeServerSession$3e$__["getKindeServerSession"])();
    const user = await getUser();
    if (!user) return null;
    // Find the existing user in DB
    const existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].user.findUnique({
        where: {
            id: user.id
        }
    });
    // If user doesn't exist, skip sync
    if (!existingUser) {
        console.log("syncUser: user not found in DB, skipping.");
        return user;
    }
    // If user.picture is a valid image and not gravatar, use it
    const imageUrl = user.picture && !user.picture.includes("gravatar.com") ? user.picture : null;
    // Only update if the image value differs
    if (existingUser.image !== imageUrl) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].user.update({
            where: {
                id: user.id
            },
            data: {
                image: imageUrl
            }
        });
        console.log("syncUser: updated image for", user.id);
    }
    return user;
};
}),
"[project]/app/data/user/is-user-authenticated.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "userRequired",
    ()=>userRequired
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$kinde$2d$oss$2f$kinde$2d$auth$2d$nextjs$2f$dist$2f$server$2e$es$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@kinde-oss/kinde-auth-nextjs/dist/server.es.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$kinde$2d$oss$2f$kinde$2d$auth$2d$nextjs$2f$dist$2f$src$2f$session$2f$index$2e$es$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getKindeServerSession$3e$__ = __turbopack_context__.i("[project]/node_modules/@kinde-oss/kinde-auth-nextjs/dist/src/session/index.es.js [app-rsc] (ecmascript) <export default as getKindeServerSession>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$sync$2d$user$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/data/user/sync-user.ts [app-rsc] (ecmascript)");
;
;
;
const userRequired = async ()=>{
    try {
        const { isAuthenticated, getUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$kinde$2d$oss$2f$kinde$2d$auth$2d$nextjs$2f$dist$2f$src$2f$session$2f$index$2e$es$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getKindeServerSession$3e$__["getKindeServerSession"])();
        const isUserAuthenticated = await isAuthenticated();
        if (!isUserAuthenticated) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/api/auth/login");
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$sync$2d$user$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["syncUser"])();
        return {
            user,
            isUserAuthenticated
        };
    } catch (error) {
        console.error("Error in userRequired:", error);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/api/auth/login");
    }
};
}),
"[project]/lib/schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "projectSchema",
    ()=>projectSchema,
    "taskFormSchema",
    ()=>taskFormSchema,
    "userSchema",
    ()=>userSchema,
    "workspaceSchema",
    ()=>workspaceSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
;
const userSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(2, "Name is required").max(50, "Maximum is 50 characters"),
    about: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    country: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Country is required"),
    industryType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Industry type is required"),
    //email: z.string().email("Invalid email address"),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].email("Invalid email address"),
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Role is required"),
    image: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const workspaceSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(2, "Name is required").max(50, "Maximum is 50 characters"),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const projectSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(3, {
        message: "Project name must be at least 3 characters."
    }),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    workspaceId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    memberAccess: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional()
});
const taskFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Title is Required"),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    assigneeId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "TODO",
        "IN_PROGRESS",
        "COMPLETED",
        "BLOCKED",
        "BACKLOG",
        "IN_REVIEW"
    ]),
    dueDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    startDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    priority: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL"
    ]),
    attachments: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "IMAGE",
            "PDF"
        ])
    })).optional()
});
}),
"[project]/utils/get-invite-code.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateInviteCode",
    ()=>generateInviteCode
]);
const generateInviteCode = ()=>{
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let inviteCode = "";
    for(let i = 0; i < 6; i++){
        const randomIndex = Math.floor(Math.random() * characters.length);
        inviteCode += characters[randomIndex];
    }
    return inviteCode;
};
}),
"[project]/app/actions/workspace.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"7f4738f8e2bdcd71d31303fc273ce2f3cc72eddba0":"joinWorkspaceWithInvite","7f49a125d0f965d9ae008dbdbed7c62af09f6368dd":"getRecentTasks","7f5469d63b5afde4f4cfc89fbbc27103b08ebae6aa":"getWorkspaceMembers","7f5808bcf23f15bbd89ef1118c339248bd58082fdb":"getWorkspaceInfo","7f71ee4b09f19976bc404a08e015707c1db7944eb7":"createNewWorkspace","7f977f833c2894be4e1a5b9624185d30b8d723a99f":"updateWorkspace","7f9da0eaf236e6f96f9908a29c42c2a9051b8bdaa0":"updateMemberRole","7fa2d201f6144fefb475876aa45e22ce9f5e82f316":"removeWorkspaceMember","7feaebac38be3fb7b4e58ff4230b46c3cccafe926e":"getWorkspaceByInviteCode","7fecf4f57a1d76619680690544ed941cea593c0dbb":"deleteWorkspace","7ff09ee16fab957a655a3f6438b0c5da38eb6fa954":"getWorkspaceStats","7ff287ac54e684b6296204bb2b3c1a2dc99062282d":"resetWorkspaceInviteCode","7ffda43b0a276375489aafec6aae853923dd7b2a60":"inviteUserToWorkspace"},"",""] */ __turbopack_context__.s([
    "createNewWorkspace",
    ()=>createNewWorkspace,
    "deleteWorkspace",
    ()=>deleteWorkspace,
    "getRecentTasks",
    ()=>getRecentTasks,
    "getWorkspaceByInviteCode",
    ()=>getWorkspaceByInviteCode,
    "getWorkspaceInfo",
    ()=>getWorkspaceInfo,
    "getWorkspaceMembers",
    ()=>getWorkspaceMembers,
    "getWorkspaceStats",
    ()=>getWorkspaceStats,
    "inviteUserToWorkspace",
    ()=>inviteUserToWorkspace,
    "joinWorkspaceWithInvite",
    ()=>joinWorkspaceWithInvite,
    "removeWorkspaceMember",
    ()=>removeWorkspaceMember,
    "resetWorkspaceInviteCode",
    ()=>resetWorkspaceInviteCode,
    "updateMemberRole",
    ()=>updateMemberRole,
    "updateWorkspace",
    ()=>updateWorkspace
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$is$2d$user$2d$authenticated$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/data/user/is-user-authenticated.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$get$2d$invite$2d$code$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/get-invite-code.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
const createNewWorkspace = async (data)=>{
    try {
        const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$is$2d$user$2d$authenticated$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userRequired"])();
        const validatedData = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workspaceSchema"].parse(data);
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspace.create({
            data: {
                name: validatedData.name,
                description: validatedData.description,
                ownerId: user.id,
                inviteCode: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$get$2d$invite$2d$code$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateInviteCode"])(),
                members: {
                    create: {
                        userId: user.id,
                        accessLevel: "OWNER"
                    }
                }
            }
        });
        return {
            data: res
        };
    } catch (err) {
        console.log(err);
        return {
            status: 500,
            message: "An error occured while creating the workspace"
        };
    }
};
const updateWorkspace = async (workspaceId, data)=>{
    const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$is$2d$user$2d$authenticated$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userRequired"])();
    const validatedData = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workspaceSchema"].parse(data);
    const isUserAMember = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspaceMember.findUnique({
        where: {
            userId_workspaceId: {
                userId: user.id,
                workspaceId: workspaceId
            }
        }
    });
    if (!isUserAMember) {
        throw new Error("You are not a member of this workspace.");
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspace.update({
        where: {
            id: workspaceId
        },
        data: {
            name: validatedData.name,
            description: validatedData.description || ""
        }
    });
    return {
        success: true
    };
};
const resetWorkspaceInviteCode = async (workspaceId)=>{
    const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$is$2d$user$2d$authenticated$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userRequired"])();
    const isUserAMember = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspaceMember.findUnique({
        where: {
            userId_workspaceId: {
                userId: user.id,
                workspaceId: workspaceId
            }
        }
    });
    if (!isUserAMember) {
        throw new Error("You are not a member of this workspace.");
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspace.update({
        where: {
            id: workspaceId
        },
        data: {
            inviteCode: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$get$2d$invite$2d$code$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateInviteCode"])()
        }
    });
};
const deleteWorkspace = async (workspaceId)=>{
    const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$is$2d$user$2d$authenticated$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userRequired"])();
    const isUserAMember = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspaceMember.findUnique({
        where: {
            userId_workspaceId: {
                userId: user.id,
                workspaceId: workspaceId
            }
        }
    });
    if (!isUserAMember) {
        throw new Error("You are not a member of this workspace.");
    }
    if (isUserAMember && isUserAMember.accessLevel !== __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["AccessLevel"].OWNER) {
        throw new Error("only an owner can delete the workspace");
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspace.delete({
        where: {
            id: workspaceId
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/workspace");
};
const getWorkspaceStats = async (workspaceId)=>{
    try {
        const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$is$2d$user$2d$authenticated$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userRequired"])();
        // Check if user is a member of the workspace
        const isUserAMember = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: user.id,
                    workspaceId: workspaceId
                }
            }
        });
        if (!isUserAMember) {
            throw new Error("You are not a member of this workspace.");
        }
        // Get task stats
        const taskStats = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].task.groupBy({
            by: [
                'status'
            ],
            where: {
                project: {
                    workspaceId: workspaceId
                }
            },
            _count: {
                id: true
            }
        });
        // Get total tasks
        const totalTasks = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].task.count({
            where: {
                project: {
                    workspaceId: workspaceId
                }
            }
        });
        // Get total members
        const totalMembers = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspaceMember.count({
            where: {
                workspaceId
            }
        });
        // Get total projects
        const totalProjects = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].project.count({
            where: {
                workspaceId
            }
        });
        // Get overdue tasks
        const tasksOverdue = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].task.count({
            where: {
                project: {
                    workspaceId: workspaceId
                },
                dueDate: {
                    lt: new Date()
                },
                status: {
                    notIn: [
                        'COMPLETED'
                    ]
                }
            }
        });
        // Process task stats
        const statsMap = taskStats.reduce((acc, stat)=>{
            acc[stat.status] = stat._count.id;
            return acc;
        }, {});
        const stats = {
            totalTasks,
            completedTasks: statsMap['COMPLETED'] || 0,
            inProgressTasks: statsMap['IN_PROGRESS'] || 0,
            todoTasks: statsMap['TODO'] || 0,
            backlogTasks: statsMap['BACKLOG'] || 0,
            totalMembers,
            totalProjects,
            tasksOverdue
        };
        return {
            success: true,
            data: stats
        };
    } catch (error) {
        console.error('Error fetching workspace stats:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch workspace stats'
        };
    }
};
const getRecentTasks = async (workspaceId, limit = 5)=>{
    try {
        const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$is$2d$user$2d$authenticated$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userRequired"])();
        // Check if user is a member of the workspace
        const isUserAMember = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: user.id,
                    workspaceId: workspaceId
                }
            }
        });
        if (!isUserAMember) {
            throw new Error("You are not a member of this workspace.");
        }
        const recentTasks = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].task.findMany({
            where: {
                project: {
                    workspaceId: workspaceId
                }
            },
            orderBy: {
                updatedAt: 'desc'
            },
            take: limit,
            include: {
                project: {
                    select: {
                        name: true
                    }
                }
            }
        });
        return {
            success: true,
            data: recentTasks
        };
    } catch (error) {
        console.error('Error fetching recent tasks:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch recent tasks',
            data: []
        };
    }
};
const getWorkspaceInfo = async (workspaceId)=>{
    try {
        const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$is$2d$user$2d$authenticated$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userRequired"])();
        // Check if user is a member of the workspace
        const isUserAMember = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: user.id,
                    workspaceId: workspaceId
                }
            }
        });
        if (!isUserAMember) {
            throw new Error("You are not a member of this workspace.");
        }
        const workspace = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspace.findUnique({
            where: {
                id: workspaceId
            },
            select: {
                id: true,
                name: true,
                description: true,
                ownerId: true
            }
        });
        if (!workspace) {
            throw new Error("Workspace not found.");
        }
        return {
            success: true,
            data: workspace
        };
    } catch (error) {
        console.error('Error fetching workspace info:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch workspace info'
        };
    }
};
const getWorkspaceMembers = async (workspaceId)=>{
    try {
        const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$is$2d$user$2d$authenticated$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userRequired"])();
        // Check if user is a member of the workspace
        const isUserAMember = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: user.id,
                    workspaceId: workspaceId
                }
            }
        });
        if (!isUserAMember) {
            throw new Error("You are not a member of this workspace.");
        }
        const [members, workspace] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspaceMember.findMany({
                where: {
                    workspaceId
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspace.findUnique({
                where: {
                    id: workspaceId
                },
                select: {
                    id: true,
                    name: true,
                    inviteCode: true,
                    ownerId: true
                }
            })
        ]);
        if (!workspace) {
            throw new Error("Workspace not found.");
        }
        return {
            success: true,
            data: {
                members,
                workspace
            }
        };
    } catch (error) {
        console.error('Error fetching workspace members:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch workspace members'
        };
    }
};
const inviteUserToWorkspace = async (workspaceId, email)=>{
    try {
        const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$is$2d$user$2d$authenticated$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userRequired"])();
        // Check if current user is a member with appropriate permissions
        const currentUserMember = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: user.id,
                    workspaceId: workspaceId
                }
            }
        });
        if (!currentUserMember) {
            throw new Error("You are not a member of this workspace.");
        }
        // Only owners and members can invite (viewers cannot)
        if (currentUserMember.accessLevel === __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["AccessLevel"].VIEWER) {
            throw new Error("You don't have permission to invite users.");
        }
        // Check if user with this email exists
        const existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].user.findUnique({
            where: {
                email
            }
        });
        if (existingUser) {
            // Check if user is already a member
            const existingMember = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspaceMember.findUnique({
                where: {
                    userId_workspaceId: {
                        userId: existingUser.id,
                        workspaceId: workspaceId
                    }
                }
            });
            if (existingMember) {
                throw new Error("User is already a member of this workspace.");
            }
            // Add user as a member
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspaceMember.create({
                data: {
                    userId: existingUser.id,
                    workspaceId: workspaceId,
                    accessLevel: __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["AccessLevel"].MEMBER
                }
            });
            return {
                success: true,
                message: "User added to workspace successfully."
            };
        } else {
            // For now, we'll just return success for non-existing users
            // In a real app, you'd send an email invitation
            return {
                success: true,
                message: "Invitation sent! User will be added when they sign up."
            };
        }
    } catch (error) {
        console.error('Error inviting user:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to invite user'
        };
    }
};
const removeWorkspaceMember = async (workspaceId, memberId)=>{
    try {
        const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$is$2d$user$2d$authenticated$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userRequired"])();
        // Check if current user is the workspace owner
        const workspace = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspace.findUnique({
            where: {
                id: workspaceId
            },
            select: {
                ownerId: true
            }
        });
        if (!workspace) {
            throw new Error("Workspace not found.");
        }
        if (workspace.ownerId !== user.id) {
            throw new Error("Only the workspace owner can remove members.");
        }
        // Get the member to remove
        const memberToRemove = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspaceMember.findUnique({
            where: {
                id: memberId
            }
        });
        if (!memberToRemove) {
            throw new Error("Member not found.");
        }
        if (memberToRemove.workspaceId !== workspaceId) {
            throw new Error("Member does not belong to this workspace.");
        }
        // Cannot remove the owner
        if (memberToRemove.accessLevel === __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["AccessLevel"].OWNER) {
            throw new Error("Cannot remove the workspace owner.");
        }
        // Remove the member
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspaceMember.delete({
            where: {
                id: memberId
            }
        });
        return {
            success: true,
            message: "Member removed successfully."
        };
    } catch (error) {
        console.error('Error removing member:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to remove member'
        };
    }
};
const updateMemberRole = async (workspaceId, memberId, newRole)=>{
    try {
        const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$is$2d$user$2d$authenticated$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userRequired"])();
        // Check if current user is the workspace owner
        const workspace = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspace.findUnique({
            where: {
                id: workspaceId
            },
            select: {
                ownerId: true
            }
        });
        if (!workspace) {
            throw new Error("Workspace not found.");
        }
        if (workspace.ownerId !== user.id) {
            throw new Error("Only the workspace owner can change member roles.");
        }
        // Get the member to update
        const memberToUpdate = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspaceMember.findUnique({
            where: {
                id: memberId
            }
        });
        if (!memberToUpdate) {
            throw new Error("Member not found.");
        }
        if (memberToUpdate.workspaceId !== workspaceId) {
            throw new Error("Member does not belong to this workspace.");
        }
        // Cannot change the owner's role
        if (memberToUpdate.accessLevel === __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["AccessLevel"].OWNER) {
            throw new Error("Cannot change the workspace owner's role.");
        }
        // Cannot make someone an owner (there can only be one owner)
        if (newRole === __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["AccessLevel"].OWNER) {
            throw new Error("Cannot assign owner role to another member.");
        }
        // Update the member's role
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspaceMember.update({
            where: {
                id: memberId
            },
            data: {
                accessLevel: newRole
            }
        });
        return {
            success: true,
            message: "Member role updated successfully."
        };
    } catch (error) {
        console.error('Error updating member role:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update member role'
        };
    }
};
const getWorkspaceByInviteCode = async (workspaceId, inviteCode)=>{
    try {
        const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$is$2d$user$2d$authenticated$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userRequired"])();
        // Find workspace by ID and invite code
        const workspace = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspace.findFirst({
            where: {
                id: workspaceId,
                inviteCode: inviteCode
            },
            select: {
                id: true,
                name: true,
                description: true,
                members: {
                    select: {
                        userId: true
                    }
                }
            }
        });
        if (!workspace) {
            return {
                success: false,
                error: "Invalid or expired invite link."
            };
        }
        // Check if user is already a member
        const alreadyMember = workspace.members.some((member)=>member.userId === user.id);
        return {
            success: true,
            data: {
                workspace: {
                    id: workspace.id,
                    name: workspace.name,
                    description: workspace.description,
                    memberCount: workspace.members.length
                },
                alreadyMember
            }
        };
    } catch (error) {
        console.error('Error fetching workspace by invite code:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch workspace information'
        };
    }
};
const joinWorkspaceWithInvite = async (workspaceId, inviteCode)=>{
    try {
        const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$is$2d$user$2d$authenticated$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userRequired"])();
        // Verify workspace and invite code
        const workspace = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspace.findFirst({
            where: {
                id: workspaceId,
                inviteCode: inviteCode
            }
        });
        if (!workspace) {
            return {
                success: false,
                error: "Invalid or expired invite link."
            };
        }
        // Check if user is already a member
        const existingMember = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: user.id,
                    workspaceId: workspaceId
                }
            }
        });
        if (existingMember) {
            return {
                success: false,
                error: "You are already a member of this workspace."
            };
        }
        // Add user as a member
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].workspaceMember.create({
            data: {
                userId: user.id,
                workspaceId: workspaceId,
                accessLevel: __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["AccessLevel"].MEMBER
            }
        });
        return {
            success: true,
            message: "Successfully joined the workspace!"
        };
    } catch (error) {
        console.error('Error joining workspace:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to join workspace'
        };
    }
};
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createNewWorkspace,
    updateWorkspace,
    resetWorkspaceInviteCode,
    deleteWorkspace,
    getWorkspaceStats,
    getRecentTasks,
    getWorkspaceInfo,
    getWorkspaceMembers,
    inviteUserToWorkspace,
    removeWorkspaceMember,
    updateMemberRole,
    getWorkspaceByInviteCode,
    joinWorkspaceWithInvite
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createNewWorkspace, "7f71ee4b09f19976bc404a08e015707c1db7944eb7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateWorkspace, "7f977f833c2894be4e1a5b9624185d30b8d723a99f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(resetWorkspaceInviteCode, "7ff287ac54e684b6296204bb2b3c1a2dc99062282d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteWorkspace, "7fecf4f57a1d76619680690544ed941cea593c0dbb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getWorkspaceStats, "7ff09ee16fab957a655a3f6438b0c5da38eb6fa954", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getRecentTasks, "7f49a125d0f965d9ae008dbdbed7c62af09f6368dd", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getWorkspaceInfo, "7f5808bcf23f15bbd89ef1118c339248bd58082fdb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getWorkspaceMembers, "7f5469d63b5afde4f4cfc89fbbc27103b08ebae6aa", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(inviteUserToWorkspace, "7ffda43b0a276375489aafec6aae853923dd7b2a60", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(removeWorkspaceMember, "7fa2d201f6144fefb475876aa45e22ce9f5e82f316", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateMemberRole, "7f9da0eaf236e6f96f9908a29c42c2a9051b8bdaa0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getWorkspaceByInviteCode, "7feaebac38be3fb7b4e58ff4230b46c3cccafe926e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(joinWorkspaceWithInvite, "7f4738f8e2bdcd71d31303fc273ce2f3cc72eddba0", null);
}),
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/workspace-invite/[workspaceId]/join/[inviteCode]/page.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/app/workspace-invite/[workspaceId]/join/[inviteCode]/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/workspace-invite/[workspaceId]/join/[inviteCode]/page.tsx <module evaluation>", "default");
}),
"[project]/app/workspace-invite/[workspaceId]/join/[inviteCode]/page.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/app/workspace-invite/[workspaceId]/join/[inviteCode]/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/workspace-invite/[workspaceId]/join/[inviteCode]/page.tsx", "default");
}),
"[project]/app/workspace-invite/[workspaceId]/join/[inviteCode]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$workspace$2d$invite$2f5b$workspaceId$5d2f$join$2f5b$inviteCode$5d2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/app/workspace-invite/[workspaceId]/join/[inviteCode]/page.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$workspace$2d$invite$2f5b$workspaceId$5d2f$join$2f5b$inviteCode$5d2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/app/workspace-invite/[workspaceId]/join/[inviteCode]/page.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$workspace$2d$invite$2f5b$workspaceId$5d2f$join$2f5b$inviteCode$5d2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/workspace-invite/[workspaceId]/join/[inviteCode]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/workspace-invite/[workspaceId]/join/[inviteCode]/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b09d95ac._.js.map