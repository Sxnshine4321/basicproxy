// Copyright (c) 2024 iiPython

// List of domains
// Would of preferred to use JSON, but CF doesn't allow `require("fs")`
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
]

// Export our request handler
export default {
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname.split(/\//);

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
            headers: request.headers["content-type"] ? { "Content-Type": request.headers["content-type"] } : {},
            body: request.body
        });

        // Create a new response object to add CORS headers
        const newResponse = new Response(response.body, response);

        // Set CORS headers
        newResponse.headers.set('Access-Control-Allow-Origin', 'https://www.roblox.com'); // Replace '*' with specific origins if needed
        newResponse.headers.set('Access-Control-Allow-Credentials', true);
        newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Add other methods if required
        newResponse.headers.set('Access-Control-Allow-Headers', '*'); // Specify headers if needed

        return newResponse;
    }
}
