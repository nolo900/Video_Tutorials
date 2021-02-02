const camelCaseKeys = require('camelcase-keys');
const express = require('express');

function createQueries({ db }) {
    function loadHomePage() {
        return db.then(client => {
            return client('pages')
                .where({ page_name: 'home' })
                .limit(1)
                .then(camelCaseKeys)
                .then(rows => rows[0])
        })
    }
    return { loadHomePage }
}

function createHandlers({ queries }){
    function home(req,res,next) {
        return queries.loadHomePage().then(homePageData => {
            // console.log('homePageData ->', homePageData);
            res.render('home/templates/home', homePageData.pageData)
        }).catch(next)
    }
    return { home }
}


function createHome({ db }) {
    const queries  = createQueries({ db });
    const handlers = createHandlers({ queries });

    const router = express.Router();
    router.route('/').get(handlers.home);

    return {
        handlers,
        queries,
        router
    }
}

module.exports = createHome;
