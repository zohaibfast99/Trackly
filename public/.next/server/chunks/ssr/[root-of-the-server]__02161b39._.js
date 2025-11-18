module.exports = [
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
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
"[project]/app/data/workspace/get-user-workspaces.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getUserWorkspaces",
    ()=>getUserWorkspaces
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$is$2d$user$2d$authenticated$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/data/user/is-user-authenticated.ts [app-rsc] (ecmascript)");
;
;
const getUserWorkspaces = async ()=>{
    try {
        const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$is$2d$user$2d$authenticated$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["userRequired"])();
        const workspaces = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].user.findUnique({
            where: {
                id: user.id
            },
            include: {
                workspaces: {
                    select: {
                        id: true,
                        userId: true,
                        workspaceId: true,
                        accessLevel: true,
                        createdAt: true,
                        workspace: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });
        return {
            data: workspaces
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: true,
            message: "Failed to fetch workspaces",
            status: 500
        };
    }
};
}),
"[project]/app/(protected)/workspace/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$workspace$2f$get$2d$user$2d$workspaces$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/data/workspace/get-user-workspaces.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
;
;
const page = async ()=>{
    const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$workspace$2f$get$2d$user$2d$workspaces$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserWorkspaces"])();
    //if (!data) return null;
    if (data?.onboardingCompleted && data?.workspaces?.length === 0) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/create-workspace");
    } else if (!data?.onboardingCompleted) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/onboarding");
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/workspace/${data?.workspaces[0].workspaceId}`);
    }
};
const __TURBOPACK__default__export__ = page;
}),
"[project]/app/(protected)/workspace/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/(protected)/workspace/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__02161b39._.js.map