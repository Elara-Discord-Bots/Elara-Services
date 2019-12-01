const {get, post} = require('superagent'), 
      errorMsg = (msg) => {return {status: false, message: msg}};

module.exports = class ServiceClient{
      /**
   * @typedef {Object} ServiceOptions
   * @property {String} [url] Base URL for the service
   * @memberof ServiceClient
   */

  /**
   * @param {string} key API Key
   * @param {ServiceOptions} [options] Client options
   */
    constructor(key, baseURL = "https://services.superchiefyt.tk"){
        if(!key) throw new Error(`You didn't provide an API key!`);
        if(typeof key !== "string") throw new Error(`The API key you provided isn't a string!`);
        async function getAPIResponse(url){
            let body = await get(`${baseURL}${url}`).set('key', key).catch(() => {});
            if(!body) return null;
            if(!body.body) return null;
            return body.body;
        }
        this.ping = async () => {
            let res = await getAPIResponse(`/site/ping`);
                if(!res) return {status: false, message: "I was unable to fetch the site ping!"};
                return res;
        }
        this.support = `${baseURL}/site/support`;
        this.paste = {
            get: async (id) => {
                try{
                if(!id) return errorMsg(`You didn't provide a paste ID!`);
                let body = await getAPIResponse(`/bin/api/${id}`)
                if(!body) return errorMsg(`No response from the Pastebin API`);
                return body;
                }catch(err){
                    return errorMsg(err.message);
                }
            },
            post: async (title, content, privatePaste = false) => {
                try{
                if(!content) return errorMsg(`You didn't provide any content to post to the pastebin API`);
                if(!title) title = null;
                if(typeof privatePaste !== "boolean") privatePaste = false;
                let {body} = await post(`${baseURL}/bin/api`).set('key', key).send({content: content, priv: privatePaste, title: title}).catch(() => {});
                if(!body) return errorMsg(`No response from the Pastebin API!`);
                return body;
                }catch(err){
                    return errorMsg(err.message);
                }
            }
        },
        this.haste = {
            get: async (id, url = `https://haste.superchiefyt.tk/`) => {
                try{
                if(!id) return errorMsg(`You didn't provide a paste ID!`);
                let {body} = await get(`${url}/documents/${id}`)
                if(!body) return errorMsg(`No response from the hastebin website.`);
                return body;
                }catch(err){
                    return errorMsg(err.message);
                }
            },
            post: async (content, options = {}) => {
                try{
                if (typeof options === "string") options = { url: "https://haste.superchiefyt.tk", extension: options };
                const url = "url" in options ? options.url : "https://haste.superchiefyt.tk";
                const extension = "extension" in options ? options.extension : "js";
                if(!content) return errorMsg(`You didn't provide any content!`)
                let {body} = await post(`${url}/documents`).send(content)
                if(!body) return errorMsg(`No response from the hastebin website.`);
                let info = {
                    status: true,
                    id: body.key,
                    url: `${url}/${body.key}.${extension}`
                }
                return info;
                }catch(err){
                    return errorMsg(err.message);
                }
            }
        },
        this.api = {
            dbl: {
                get: async (token, id) => {
                    try{
                        if(!token) return errorMsg(`You didn't provide a Discord Bot List(top.gg) token!`);
                        if(!id) return errorMsg(`You didn't provide a Discord Bot or User ID`);
                        let {body} = await get(`${baseURL}/api/dbl/stats?id=${id}`).set('token', token).set("key", key).catch(() => {});
                        if(!body) return errorMsg(`Unknown error while trying to fetch the image from the API`);
                        return body;
                    }catch(err){
                        return errorMsg(err.message)
                    }
                },
                post: async (token, id, servers, shards = 0) => {
                    try{
                        if(!token) return errorMsg(`You didn't provide a Discord Bot List(top.gg) token!`);
                        if(!id) return errorMsg(`You didn't provide a Discord Bot or User ID`);
                        if(!servers) return errorMsg(`You didn't provide 'servers' number!`);
                        if(!shards) shards = 0;
                        if(isNaN(servers)) return errorMsg(`The 'servers' number value isn't valid!`);
                        if(isNaN(shards)) return errorMsg(`The 'shards' number value isn't valid!`);
                        let body = await getAPIResponse(`/api/dbl/post?id=${id}&servers=${servers}&shards=${shards}&token=${token}`);
                        if(!body) return errorMsg(`Unknown error while trying to post the stats to DBL(top.gg)`);
                        if(body.status !== true) return errorMsg(body.message)
                        return body;
                    }catch(err){
                        return errorMsg(err.message)
                    }
                }
            },
            photos: async (image) => {
                try{
                    if(!image) return errorMsg(`You didn't provide an image endpoint, ex: 'cats', 'pugs', 'dogs'`);
                    let body = await getAPIResponse(`/api/photos/${image}`)
                    if(!body) return errorMsg(`Unknown error while trying to fetch the image from the API`);
                    return body;
                }catch(err){
                    return errorMsg(err.message)
                }
            },
            special: async (image) => {
                try{
                    if(!image) return errorMsg(`You didn't provide an special endpoint`);
                    let body = await getAPIResponse(`/api/special?type=${image}`)
                    if(!body) return errorMsg(`Unknown error while trying to fetch the image from the API`);
                    return body;
                }catch(err){
                    return errorMsg(err.message)
                }
            },
            translate: async (toLang, text) => {
                try{
                    if(!toLang) return errorMsg(`You didn't provide the 'to' language!`);
                    if(!text) return errorMsg(`You didn't provide any text!`);
                    let body = await getAPIResponse(`/api/translate?to=${toLang}&text=${text}`)
                    if(!body) return errorMsg(`Unknown error while trying to fetch the translation from the API`);
                    return body;
                }catch(err){
                    return errorMsg(err.message);
                }
            },
            invites: async (type) => {
                try{
                    if(!type) type = "both";
                    let body = await getAPIResponse(`/api/invites?type=${type.toLowerCase()}`);
                    if(!body) return errorMsg(`Unknown error while trying to fetch the invites from the API`)
                    return body;
                }catch(err){
                    return errorMsg(err.message);
                }
            },
            facts: async (type) => {
                try{
                    if(!type) type = "random";
                    let body = await getAPIResponse(`/api/facts?type=${type.toLowerCase()}`)
                    if(!body) return errorMsg(`Unknown error while trying to fetch the fact(s) from the API`)
                    return body;
                }catch(err){
                    return errorMsg(err.message);
                }
            },
            memes: async (clean = false) => {
                try{
                    if(!["true", "false"].includes(clean.toString().toLowerCase())) return errorMsg(`The 'clean' you provided is invalid, it has to be a boolean.`)
                    let res = await getAPIResponse(`/api/photos/memes?clean=${clean}`);
                    if(!res) return errorMsg(`I was unable to fetch the meme :(`);
                    return res;
                }catch(err){
                    return errorMsg(err.message);
                }
            },
            ball: async () => {
                try{
                    let body = await getAPIResponse(`/api/8ball`)
                    if(!body) return errorMsg(`Unknown error while trying to fetch 8ball from the API`)
                    return body;
                }catch(err){
                    return errorMsg(err.message);
                }
            },
            dogbreed: async (type, breed) => {
                try{
                    if(!type) type = "";
                    if(!breed) breed = "none";
                    let body = await getAPIResponse(`/api/dogbreed?type=${type}&breed=${breed}`)
                    if(!body) return errorMsg(`Unable to fetch the dog-breed from the API site!`);
                    return body;
                }catch(err){
                    return errorMsg(err.message);
                }
            },
            npm: async (name) => {
                try{
                    if(!name) return errorMsg(`You didn't provide a npm package name!`);
                    let body = await getAPIResponse(`/api/npm?name=${name}`);
                    if(!body) return errorMsg(`Unable to fetch the npm package from the API site!`);
                    return body;
                }catch(err){
                    return errorMsg(err.message);
                }
            },
            time: async (place, all = false) => {
                try{
                    if(typeof all !== "boolean") return errorMsg(`'all' isn't a boolean!`)
                    if(all === true) {
                        let body = await getAPIResponse(`/api/time?all=true`);
                        if(!body) return errorMsg(`Unable to fetch the times list!`);
                        return body;
                    }
                    if(!place) return errorMsg(`You didn't provide a place!`);
                    let body = await getAPIResponse(`/api/time?place=${place.toString().toLowerCase()}`);
                    if(!body) return errorMsg(`Unable to fetch the info for ${place}`);
                    return body;
                }catch(err){
                    return errorMsg(err.message)
                }
            },
            docs: async (search, project = "stable", branch = "stable") => {
                try{
                    if(!search) return errorMsg(`Well tell me what you want to search for?`);
                    let body = await getAPIResponse(`/api/discord.js-docs?search=${search}&project=${project}&branch=${branch}`);
                    if(!body) return errorMsg(`I was unable to fetch the docs infomration`);
                    return body;
                }catch(err){
                    return errorMsg(err.message)
                }
            },
            platform: {
                mixer: async (name) => {
                    try{
                        if(!name) return errorMsg(`You didn't provide a mixer username`);
                        let res = await getAPIResponse(`/api/platform/mixer?user=${name}`);
                        if(!res) return errorMsg(`Unable to fetch the mixer information from the API site`);
                        return res;
                    }catch(err){
                        return errorMsg(err.message);
                    }
                },
                ytstats: async (token, IDOrName) => {
                    try{
                        if(!token) return errorMsg(`You didn't provide a youtube API key`);
                        if(!IDOrName) return errorMsg(`You didnt provide a channel ID or name!`);
                        let res = await getAPIResponse(`/api/platform/yt-stats?user=${IDOrName}&token=${token}`);
                        if(!res) return errorMsg(`Unable to fetch the ytstats information from the API site`);
                        return res;
                    }catch(err){
                        return errorMsg(err.message);
                    }
                },
                twitch: async (token, name) => {
                    try{
                        if(!token) return errorMsg(`You didn't provide a twitch API key`);
                        if(!name) return errorMsg(`You didnt provide a channel name!`);
                        let res = await getAPIResponse(`/api/platform/twitch?user=${name}&token=${token}`);
                        if(!res) return errorMsg(`Unable to fetch the twitch information from the API site`);
                        return res;
                    }catch(err){
                        return errorMsg(err.message);
                    }
                },
                roblox: async (id) => {
                    try{
                        if(!id) return errorMsg(`You didn't provide a Discord user ID`);
                        let res = await getAPIResponse(`/api/platform/roblox?id=${id}`);
                        if(!res) return errorMsg(`Unable to fetch the roblox information from the API site`);
                        return res;
                    }catch(err){
                        return errorMsg(err.message);
                    }
                },
                robloxgroup: async (id) => {
                    try{
                        if(!id) return errorMsg(`You didn't provide a roblox group ID`);
                        let res = await getAPIResponse(`/api/platform/roblox-group?id=${id}`);
                        if(!res) return errorMsg(`Unable to fetch the roblox group information from the API site`);
                        return res;
                    }catch(err){
                        return errorMsg(err.message);
                    }
                },
                fortnite: async (token, name, platform = "pc") => {
                    try{
                        if(!token) return errorMsg(`You didn't provide a Fortnite API key`);
                        if(!name) return errorMsg(`You didn't provide a username!`);
                        if(!platform) platform = "pc";
                        let res = await getAPIResponse(`/api/platform/fortnite?user=${name}&token=${token}&platform=${platform}`);
                        if(!res) return errorMsg(`Unable to fetch the fortnite information from the API site`);
                        return res;
                    }catch(err){
                        return errorMsg(err.message);
                    }
                },
                paladins: async (devID, auth, username, platform = "pc") => {
                    try{
                        if(!devID) return errorMsg(`You didn't provide the 'devID'`);
                        if(!auth) return errorMsg(`You didn't provide the 'auth'`)
                        if(!username) return errorMsg(`You didn't provide a username!`);
                        if(!platform) platform = "pc";
                        let res = await getAPIResponse(`/api/platform/paladins?devID=${devID}&auth=${auth}&platform=${platform}&user=${username}`);
                        if(!res) return errorMsg(`Nothing found for that user!`);
                        return res;
                    }catch(err){
                        return errorMsg(err.message);
                    }
                },
                imdb: async (token, show) => {
                    try{
                        if(!token) return errorMsg(`You didn't provide a 'imdb' API key!`)
                        if(!show) return errorMsg(`You didn't provide the tv-show or movie name!`);
                        let res = await getAPIResponse(`/api/platform/imdb?token=${token}&show=${show}`);
                        if(!res) return errorMsg(`Unable to fetch the imdb information, try again later.`);
                        return res;
                    }catch(err){
                        return errorMsg(err.message);
                    }
                },
                ytsearch: async (token, name, type = "video") => {
                    try{
                        if(!token) return errorMsg(`You didn't provide a 'imdb' API key!`)
                        if(!name) return errorMsg(`You didn't provide the name to search for!`);
                        if(!type) type = "video";
                        let res = await getAPIResponse(`/api/platform/yt-search?token=${token}&name=${name}&type=${type}`);
                        if(!res) return errorMsg(`Unable to fetch the ytsearch information, try again later.`);
                        return res;
                    }catch(err){
                        return errorMsg(err.message);
                    }
                }
            }
        },
        this.dev = {
            blacklists: {
                servers: async (id = "all") => {
                    try{
                        if(!id) return errorMsg(`You didn't provide a Discord server ID!`);
                        let res = await getAPIResponse(`/dev/blacklists/servers?id=${id}`);
                        if(!res) return errorMsg(`I was unable to fetch the blacklisted servers.`);
                        return res;
                    }catch(err){
                        return errorMsg(err.message);
                    }
                },
                users: async (id = "all") => {
                    try{
                        if(!id) return errorMsg(`You didn't provide a Discord user ID!`);
                        let res = await getAPIResponse(`/dev/blacklists/users?id=${id}`);
                        if(!res) return errorMsg(`I was unable to fetch the blacklisted users.`);
                        return res;
                    }catch(err){
                        return errorMsg(err.message);
                    }
                }
            }
        }
    };
}
