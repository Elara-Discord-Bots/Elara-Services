const {get, post} = require('superagent'), 
      baseURL = `https://services.superchiefyt.tk`;

function errorMsg (msg) {
    return {status: false, message: msg};
}

async function getAPIResponse(url, key){
    let {body} = await get(`${baseURL}${url}`).set('key', key).catch(() => {});
    if(!body) return null;
    return body;
}

module.exports = {
    support: `${baseURL}/site/support`,
    paste: {
        get: async (key, id) => {
            try{
            if(!key) return errorMsg(`You didn't provide a Pastebin API Key`)
            if(!id) return errorMsg(`You didn't provide a paste ID!`);
            let body = await getAPIResponse(`/bin/api/${id}`, key)
            if(!body) return errorMsg(`No response from the Pastebin API`);
            return body;
            }catch(err){
                return errorMsg(err.message);
            }
        },
        post: async (key, title, content, privatePaste = false) => {
            try{
            if(!key) return errorMsg(`You didn't provide a Pastebin API Key`);
            if(!content) return errorMsg(`You didn't provide any content to post to the pastebin API`);
            if(!title) title = null;
            if(typeof public !== "boolean") privatePaste = false;
            let {body} = await post(`${baseURL}/bin/api`).set('key', key).send({content: content, priv: privatePaste, title: title}).catch(() => {});
            if(!body) return errorMsg(`No response from the Pastebin API!`);
            return body;
            }catch(err){
                return errorMsg(err.message);
            }
        }
    },
    api: {
        dbl: {
            get: async (key, token, id) => {
                try{
                    if(!key) return errorMsg("You didn't provide a API Key!")
                    if(!token) return errorMsg(`You didn't provide a Discord Bot List(top.gg) token!`);
                    if(!id) return errorMsg(`You didn't provide a Discord Bot or User ID`);
                    let {body} = await get(`${baseURL}/api/dbl/stats?id=${id}`).set('token', token).set("key", key).catch(() => {});
                    if(!body) return errorMsg(`Unknown error while trying to fetch the image from the API`);
                    return body;
                }catch(err){
                    return errorMsg(err.message)
                }
            },
            post: async (key, token, id, servers, shards = 0) => {
                try{
                    if(!key) return errorMsg("You didn't provide a API Key!")
                    if(!token) return errorMsg(`You didn't provide a Discord Bot List(top.gg) token!`);
                    if(!id) return errorMsg(`You didn't provide a Discord Bot or User ID`);
                    if(!servers) return errorMsg(`You didn't provide 'servers' number!`);
                    if(!shards) shards = 0;
                    if(isNaN(servers)) return errorMsg(`The 'servers' number value isn't valid!`);
                    if(isNaN(shards)) return errorMsg(`The 'shards' number value isn't valid!`)
                    let {body} = await get(`${baseURL}/api/dbl/post?id=${id}`).set('token', token).set("key", key).send({servers: servers, shards: shards}).catch(() => {});
                    if(!body) return errorMsg(`Unknown error while trying to fetch the image from the API`);
                    return body;
                }catch(err){
                    return errorMsg(err.message)
                }
            }
        },
        photos: async (key, image) => {
            try{
                if(!key) return errorMsg("You didn't provide a API Key!")
                if(!image) return errorMsg(`You didn't provide an image endpoint, ex: 'cats', 'pugs', 'dogs'`);
                let body = await getAPIResponse(`/api/photos/${image}`, key)
                if(!body) return errorMsg(`Unknown error while trying to fetch the image from the API`);
                return body;
            }catch(err){
                return errorMsg(err.message)
            }
        },
        special: async (key, image) => {
            try{
                if(!key) return errorMsg("You didn't provide a API Key!")
                if(!image) return errorMsg(`You didn't provide an special endpoint`);
                let body = await getAPIResponse(`/api/special?type=${image}`, key)
                if(!body) return errorMsg(`Unknown error while trying to fetch the image from the API`);
                return body;
            }catch(err){
                return errorMsg(err.message)
            }
        },
        translate: async (key, toLang, text) => {
            try{
                if(!key) return errorMsg(`You didn't provide a API Key`);
                if(!toLang) return errorMsg(`You didn't provide the 'to' language!`);
                if(!text) return errorMsg(`You didn't provide any text!`);
                let body = await getAPIResponse(`/api/translate?to=${toLang}&text=${text}`, key)
                if(!body) return errorMsg(`Unknown error while trying to fetch the translation from the API`);
                return body;
            }catch(err){
                return errorMsg(err.message);
            }
        },
        invites: async (key, type) => {
            try{
                if(!key) return errorMsg(`You didn't provide a API Key`);
                if(!type) type = "both";
                let body = await getAPIResponse(`/api/invites?type=${type.toLowerCase()}`, key);
                if(!body) return errorMsg(`Unknown error while trying to fetch the invites from the API`)
                return body;
            }catch(err){
                return errorMsg(err.message);
            }
        },
        facts: async (key, type) => {
            try{
                if(!key) return errorMsg(`You didn't provide a API Key`);
                if(!type) type = "random";
                let body = await getAPIResponse(`/api/facts?type=${type.toLowerCase()}`, key)
                if(!body) return errorMsg(`Unknown error while trying to fetch the fact(s) from the API`)
                return body;
            }catch(err){
                return errorMsg(err.message);
            }
        },
        ball: async (key) => {
            try{
                if(!key) return errorMsg(`You didn't provide a API Key`);
                let body = await getAPIResponse(`/api/8ball`, key)
                if(!body) return errorMsg(`Unknown error while trying to fetch 8ball from the API`)
                return body;
            }catch(err){
                return errorMsg(err.message);
            }
        },
        dogbreed: async (key, type, breed) => {
            try{
                if(!key) return errorMsg(`You didn't provide a API Key`);
                if(!type) type = "";
                if(!breed) breed = "none";
                let body = await getAPIResponse(`/api/dogbreed?type=${type}&breed=${breed}`, key)
                if(!body) return errorMsg(`Unable to fetch the dog-breed from the API site!`);
                return body;
            }catch(err){
                return errorMsg(err.message);
            }
        },
        npm: async (key, name) => {
            try{
                if(!key) return errorMsg(`You didn't provide a API Key`);
                if(!name) return errorMsg(`You didn't provide a npm package name!`);
                let body = await getAPIResponse(`/api/npm?name=${name}`, key);
                if(!body) return errorMsg(`Unable to fetch the npm package from the API site!`);
                return body;
            }catch(err){
                return errorMsg(err.message);
            }
        },
        platform: {
            mixer: async (key, name) => {
                try{
                    if(!key) return errorMsg(`You didn't provide a API Key`);
                    if(!name) return errorMsg(`You didn't provide a mixer username`);
                    let res = await getAPIResponse(`/api/platform/mixer?user=${name}`, key);
                    if(!res) return errorMsg(`Unable to fetch the mixer information from the API site`);
                    return res;
                }catch(err){
                    return errorMsg(err.message);
                }
            },
            ytstats: async (key, token, IDOrName) => {
                try{
                    if(!key) return errorMsg(`You didn't provide a API Key`);
                    if(!token) return errorMsg(`You didn't provide a youtube API key`);
                    if(!IDOrName) return errorMsg(`You didnt provide a channel ID or name!`);
                    let res = await getAPIResponse(`/api/platform/yt-stats?user=${IDOrName}&token=${token}`, key);
                    if(!res) return errorMsg(`Unable to fetch the ytstats information from the API site`);
                    return res;
                }catch(err){
                    return errorMsg(err.message);
                }
            },
            twitch: async (key, token, name) => {
                try{
                    if(!key) return errorMsg(`You didn't provide a API Key`);
                    if(!token) return errorMsg(`You didn't provide a twitch API key`);
                    if(!name) return errorMsg(`You didnt provide a channel name!`);
                    let res = await getAPIResponse(`/api/platform/twitch?user=${name}&token=${token}`, key);
                    if(!res) return errorMsg(`Unable to fetch the twitch information from the API site`);
                    return res;
                }catch(err){
                    return errorMsg(err.message);
                }
            },
            roblox: async (key, id) => {
                try{
                    if(!key) return errorMsg(`You didn't provide a API Key`);
                    if(!id) return errorMsg(`You didn't provide a Discord user ID`);
                    let res = await getAPIResponse(`/api/platform/roblox?id=${id}`, key);
                    if(!res) return errorMsg(`Unable to fetch the roblox information from the API site`);
                    return res;
                }catch(err){
                    return errorMsg(err.message);
                }
            },
            robloxgroup: async (key, id) => {
                try{
                    if(!key) return errorMsg(`You didn't provide a API Key`);
                    if(!id) return errorMsg(`You didn't provide a roblox group ID`);
                    let res = await getAPIResponse(`/api/platform/roblox-group?id=${id}`, key);
                    if(!res) return errorMsg(`Unable to fetch the roblox group information from the API site`);
                    return res;
                }catch(err){
                    return errorMsg(err.message);
                }
            },
            fortnite: async (key, token, name, platform = "pc") => {
                try{
                    if(!key) return errorMsg(`You didn't provide a API Key`);
                    if(!token) return errorMsg(`You didn't provide a Fortnite API key`);
                    if(!name) return errorMsg(`You didn't provide a username!`);
                    if(!platform) platform = "pc";
                    let res = await getAPIResponse(`/api/platform/fortnite?user=${name}&token=${token}&platform=${platform}`, key);
                    if(!res) return errorMsg(`Unable to fetch the fortnite information from the API site`);
                    return res;
                }catch(err){
                    return errorMsg(err.message);
                }
            },
            paladins: async (key, devID, auth, username, platform = "pc") => {
                try{
                    if(!key) return errorMsg(`You didn't provide a API Key`);
                    if(!devID) return errorMsg(`You didn't provide the 'devID'`);
                    if(!auth) return errorMsg(`You didn't provide the 'auth'`)
                    if(!username) return errorMsg(`You didn't provide a username!`);
                    if(!platform) platform = "pc";
                    let res = await getAPIResponse(`/api/platform/paladins?devID=${devID}&auth=${auth}&platform=${platform}&user=${username}`, key);
                    if(!res) return errorMsg(`Nothing found for that user!`);
                    return res;
                }catch(err){
                    return errorMsg(err.message);
                }
            },
            imdb: async (key, token, show) => {
                try{
                    if(!key) return errorMsg(`You didn't provide a API Key`);
                    if(!token) return errorMsg(`You didn't provide a 'imdb' API key!`)
                    if(!show) return errorMsg(`You didn't provide the tv-show or movie name!`);
                    let res = await getAPIResponse(`/api/platform/imdb?token=${token}&show=${show}`, key);
                    if(!res) return errorMsg(`Unable to fetch the imdb information, try again later.`);
                    return res;
                }catch(err){
                    return errorMsg(err.message);
                }
            },
            ytsearch: async (key, token, name, type = "video") => {
                try{
                    if(!key) return errorMsg(`You didn't provide a API Key`);
                    if(!token) return errorMsg(`You didn't provide a 'imdb' API key!`)
                    if(!name) return errorMsg(`You didn't provide the name to search for!`);
                    if(!type) type = "video";
                    let res = await getAPIResponse(`/api/platform/yt-search?token=${token}&name=${name}&type=${type}`, key);
                    if(!res) return errorMsg(`Unable to fetch the ytsearch information, try again later.`);
                    return res;
                }catch(err){
                    return errorMsg(err.message);
                }
            }
        }
    }
}
