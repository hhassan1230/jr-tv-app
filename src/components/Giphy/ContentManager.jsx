import React from 'react';
import debug from 'debug';
import jsonp from 'jsonp';
import Giphy from './Giphy';

export default class ContentManager {
    isInitialized = false;

    static init(response) {
        if (this.isInitialized) {
            return;
        }
        this.isInitialized = true;
        let redditGifApi = `http://akz.imgfarm.com/pub/feeds/giphy/redditgif.jsonp?v=${new Date().getTime()}`;
        jsonp(redditGifApi, {
            name: 'jsonpCallback'
        }, (err, data) => {
            if (err) {
                throw(err);
            }
            response(data);
        });
    }
}