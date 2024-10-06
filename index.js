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

        if (!path[1].trim()) return new Response(JSON.stringify({ message: "Missing ROBLOX subdomain." }), { status: 400 });

        if (!domains.includes(path[1])) return new Response(JSON.stringify({ message: "Specified subdomain is not allowed." }), { status: 401 });
        
        return fetch(`https://${path[1]}.roblox.com/${path.slice(2).join("/")}${url.search}`, {
            method: request.method,
            headers: request.headers["content-type"] ? { "Content-Type": request.headers["content-type"] } : {},
            body: request.body
        });
    }
}
