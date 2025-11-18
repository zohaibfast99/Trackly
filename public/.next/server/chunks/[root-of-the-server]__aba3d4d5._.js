module.exports = [
"[project]/.next-internal/server/app/api/uploadthing/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/app/data/user/sync-user.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/app/data/user/sync-user.ts
__turbopack_context__.s([
    "syncUser",
    ()=>syncUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$kinde$2d$oss$2f$kinde$2d$auth$2d$nextjs$2f$dist$2f$server$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@kinde-oss/kinde-auth-nextjs/dist/server.es.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$kinde$2d$oss$2f$kinde$2d$auth$2d$nextjs$2f$dist$2f$src$2f$session$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__getKindeServerSession$3e$__ = __turbopack_context__.i("[project]/node_modules/@kinde-oss/kinde-auth-nextjs/dist/src/session/index.es.js [app-route] (ecmascript) <export default as getKindeServerSession>");
;
;
const syncUser = async ()=>{
    const { getUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$kinde$2d$oss$2f$kinde$2d$auth$2d$nextjs$2f$dist$2f$src$2f$session$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__getKindeServerSession$3e$__["getKindeServerSession"])();
    const user = await getUser();
    if (!user) return null;
    // Find the existing user in DB
    const existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
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
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.update({
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
"[project]/app/data/user/is-user-authenticated.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "userRequired",
    ()=>userRequired
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$kinde$2d$oss$2f$kinde$2d$auth$2d$nextjs$2f$dist$2f$server$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@kinde-oss/kinde-auth-nextjs/dist/server.es.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$kinde$2d$oss$2f$kinde$2d$auth$2d$nextjs$2f$dist$2f$src$2f$session$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__getKindeServerSession$3e$__ = __turbopack_context__.i("[project]/node_modules/@kinde-oss/kinde-auth-nextjs/dist/src/session/index.es.js [app-route] (ecmascript) <export default as getKindeServerSession>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$sync$2d$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/data/user/sync-user.ts [app-route] (ecmascript)");
;
;
;
const userRequired = async ()=>{
    try {
        const { isAuthenticated, getUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$kinde$2d$oss$2f$kinde$2d$auth$2d$nextjs$2f$dist$2f$src$2f$session$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__getKindeServerSession$3e$__["getKindeServerSession"])();
        const isUserAuthenticated = await isAuthenticated();
        if (!isUserAuthenticated) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redirect"])("/api/auth/login");
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$sync$2d$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["syncUser"])();
        return {
            user,
            isUserAuthenticated
        };
    } catch (error) {
        console.error("Error in userRequired:", error);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redirect"])("/api/auth/login");
    }
};
}),
"[project]/app/api/uploadthing/core.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ourFileRouter",
    ()=>ourFileRouter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$is$2d$user$2d$authenticated$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/data/user/is-user-authenticated.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uploadthing$2f$next$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/uploadthing/next/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@uploadthing/shared/dist/index.js [app-route] (ecmascript)");
;
;
;
const f = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uploadthing$2f$next$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createUploadthing"])();
const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({
        image: {
            /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */ maxFileSize: "1MB",
            maxFileCount: 3
        }
    })// Set permissions and file types for this FileRoute
    .middleware(async ({ req })=>{
        // This code runs on your server before upload
        const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$is$2d$user$2d$authenticated$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userRequired"])();
        // If you throw, the user will not be able to upload
        if (!user) throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]("Unauthorized");
        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        return {
            userId: user.id
        };
    }).onUploadComplete(async ({ metadata, file })=>{
        // This code RUNS ON YOUR SERVER after upload
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.ufsUrl);
        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return {
            uploadedBy: metadata.userId
        };
    }),
    documentUploader: f({
        "application/pdf": {
            /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */ maxFileSize: "1MB",
            maxFileCount: 3
        }
    })// Set permissions and file types for this FileRoute
    .middleware(async ({ req })=>{
        // This code runs on your server before upload
        const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$user$2f$is$2d$user$2d$authenticated$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userRequired"])();
        // If you throw, the user will not be able to upload
        if (!user) throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]("Unauthorized");
        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        return {
            userId: user.id
        };
    }).onUploadComplete(async ({ metadata, file })=>{
        // This code RUNS ON YOUR SERVER after upload
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.ufsUrl);
        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return {
            uploadedBy: metadata.userId
        };
    })
};
}),
"[project]/app/api/uploadthing/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uploadthing$2f$next$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/uploadthing/next/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$uploadthing$2f$core$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/uploadthing/core.ts [app-route] (ecmascript)");
;
;
const { GET, POST } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uploadthing$2f$next$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createRouteHandler"])({
    router: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$uploadthing$2f$core$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ourFileRouter"]
});
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__aba3d4d5._.js.map