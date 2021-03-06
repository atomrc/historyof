/*global require, module, fetch*/
var fetchPolyfill = require("whatwg-fetch");

var config = {
    loginUrl: "/user/authenticate",
    urlPattern: "/u/stories/:eid"
};

function request(url, params={}) {
    params.method = params.method ? params.method : "GET";
    params.headers = Object.assign({}, {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }, params.headers);

    params.body = params.body ? JSON.stringify(params.body) : undefined;

    return fetch(url, params)
        .then(function (response) {
            if (!response.ok) {
                throw response;
            }

            return response.status === 200 ?
                response.json() :
                "ok";
        })
        .catch(function (response) {
            return response
                .json()
                .then(function (data) {
                    throw {
                        status: response.status,
                        message: data.error
                    };
                });
        });
}

function requestProtected(url, token, params) {
    if (!token) {
        return Promise.reject("[API] Requesting protected ressource (" + url + ") with no token");
    }

    var conf = Object.assign({}, {
        headers: {
            Authorization: "Bearer " + token
        }
    }, params);

    return request(url, conf);
}

function generateUrl(url, data) {
    data = data || {};
    for (var i in data) {
        url = url.replace(":" + i, data[i]);
    }
    //cut the end of the pattern to remove unbinded datas
    return url.replace(/\/:.*/g, "");
}

function initStory (story) {
    story.date = new Date(story.date);
    return story;
}

var api = {
    login: function ({ login, password }) {

        return request(config.loginUrl, {
            method: "POST",
            body: {
                login: login,
                password: password
            }
        });
    },

    checkLogin: function (login) {
        return request("/check/login/" + login);
    },

    checkPseudo: function (pseudo) {
        return request("/check/pseudo/" + pseudo);
    },

    fetchUser: function (token) {
        return requestProtected("/u", token);
    },

    createUser: function (user) {
        return request("/user/create", {
            method: "POST",
            body: user
        });
    },

    fetchStories: function (token) {
        return requestProtected("/u/stories", token)
            .then((stories) => {
                return stories.map(initStory)
            });
    },

    createStory: function (token, story) {
        return requestProtected("/u/stories", token, {
                method: "POST",
                body: story
            }).then(initStory);
    },

    updateStory: function (token, story) {
        return requestProtected(generateUrl(config.urlPattern, { eid: story.id }), token, {
            method: "PUT",
            body: story
        }).then(initStory);
    },

    removeStory: function (token, storyid) {
        requestProtected(generateUrl(config.urlPattern, { eid: storyid }), token, {
            method: "DELETE"
        });
    }
};

module.exports = api;
