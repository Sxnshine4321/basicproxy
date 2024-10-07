// Copyright (c) 2024 iiPython

const domains = [
    "apis",
    "assetdelivery",
    "avatar",
    "badges",
    "catalog",
    "chat",
    "contacts",
    "contentstore",
    "develop",
    "economy",
    "economycreatorstats",
    "followings",
    "friends",
    "games",
    "groups",
    "groupsmoderation",
    "inventory",
    "itemconfiguration",
    "locale",
    "notifications",
    "points",
    "presence",
    "privatemessages",
    "publish",
    "search",
    "thumbnails",
    "trades",
    "translations",
    "users"
];

// Export request handler
export default {
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname.split(/\//);

        // Check if this is a preflight request (OPTIONS method)
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,  // HTTP 204: No Content
                headers: {
                    'Access-Control-Allow-Origin': 'https://www.roblox.com',
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Max-Age': '86400'  // Cache preflight for 1 day
                }
            });
        }

        // Check for missing subdomain
        if (!path[1].trim()) {
            return new Response(JSON.stringify({ message: "Missing ROBLOX subdomain." }), { status: 400 });
        }

        // Check if the subdomain is allowed
        if (!domains.includes(path[1])) {
            return new Response(JSON.stringify({ message: "Specified subdomain is not allowed." }), { status: 401 });
        }

        // Fetch the resource from the specified subdomain
        const response = await fetch(`https://${path[1]}.roblox.com/${path.slice(2).join("/")}${url.search}`, {
            method: request.method,
            headers: {
                "Content-Type": request.headers.get("content-type") || "application/json", // Ensure content-type is set
                "Cookie": request.headers.get("Cookie"), // Forward cookies (optional)
            },
            body: request.body
        });

        // Create a new response object to add CORS headers
        const newResponse = new Response(response.body, response);

        // Set CORS headers
        newResponse.headers.set('Access-Control-Allow-Origin', 'https://www.roblox.com');
        newResponse.headers.set('Access-Control-Allow-Credentials', 'true');
        newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Explicit headers

        return newResponse;
    }
};
