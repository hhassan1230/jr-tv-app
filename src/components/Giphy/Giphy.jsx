import React from 'react';
import debug from 'debug';

import shallowequal from 'shallowequal';
import ContentManager from './ContentManager';
import Prompt from './Prompt';
import SharePrompt  from "./SharePrompt";

import './style.scss';

const log = debug('wtt.Giphy');

export default class Giphy extends React.Component {
    static displayName = 'Giphy';

    static propTypes = {
        
    };

    constructor(props) {
        log('constructor');
        super(props);
        this.count = 0;
        this.state = {
            currentGifUrl: `https://s3.amazonaws.com/tholman.com/img/static.gif`,
            currentTitle: `Now Loading....`,
            currentSource: `static`,
            localStorgeArray: ``,
            hourFormat: `12hour`
        };
    }

    static defaultProps = {
        config: {
            currentGifList: [],
        },
    };

    formatGifs(giphyContent, origins){
        if (origins === 'reddit') {
            let finalArray = [];

            const gifPattern = /(\.gif$|\.gifv$)/;
            const imgurDetection = /(i\.imgur)/;
            if (giphyContent.length > 0) {
                for (let i = 0; i < giphyContent.length; i++) {
                    // debugger;
                    let currentSource = 'reddit';
                    if (gifPattern.test(giphyContent[i].data.url)) {
                        if (imgurDetection.test(giphyContent[i].data.url)) {
                            currentSource = 'imgur';
                        }
                        let giphyTitle = giphyContent[i].data.title;
                        let giphyUrl = giphyContent[i].data.url;
                        // TO TRY AND INNCORP IFRAME
                        // if (giphyUrl[giphyUrl.length - 1] === 'v') {
                        //     giphyUrl = giphyUrl.slice(0, -1);
                        // }
                        finalArray.push({name: giphyTitle, url: giphyUrl, source: currentSource});
                    }
                }
                return finalArray;
            }
        } else if (origins === 'giphy') {
            
        } else {
            return [];
        }
    }

    componentWillMount(){
        let shouldUpdate = false;
        let localGiphyArray = localStorage.getItem("mywayGiphyArray");
        let currentDate = new Date();
        currentDate = `${currentDate.getMonth()+1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
        if (localGiphyArray === null || localGiphyArray === 'undefined') {
            shouldUpdate = true;
        } else {
            let storageDate = localStorage.getItem("mywayGiphyDate");
            if (storageDate === null || storageDate === 'undefined') {
                localStorage.setItem("mywayGiphyDate", currentDate);
            } else {
                if (storageDate !== currentDate) {
                    shouldUpdate = true;
                }
            }
        }

        if (shouldUpdate) {
            log('componentWillMount', 'Getting Data');

            window.setTimeout(()=>{
                ContentManager.init((data)=>{
                    this.props.config.currentGifList = data.data.children;
                    this.count = 0;
                    let currentGifArray = this.formatGifs(this.props.config.currentGifList, 'reddit');

                    localStorage.setItem("mywayGiphyArray", JSON.stringify(this.shuffle(currentGifArray)));
                    localStorage.setItem("mywayGiphyCount", this.count);
                    localStorage.setItem("mywayGiphyDate", currentDate);
                    this.setState({
                        localStorgeArray: `have data on ${currentDate}`
                    });
                });
            }, 0);
        }
    }

    shuffle(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i),
        x = o[--i],
        o[i] = o[j],
        o[j] = x)
            ;
        return o
    }

    handleShare(){
        // debugger;
        //this.props.visible = true;
    }


    componentDidMount() {
        log('componentDidMount');

        // let currentArray = this.formatGifs(this.props.config.currentGifList, 'reddit');
        // localStorage.setItem("mywayGiphyArray", currentArray);
    }


    render() {
        let currentArray = JSON.parse(localStorage.getItem("mywayGiphyArray")); // this is being saved as a string!!!!!
        let rederingGipUrl = this.state.currentGifUrl;
        let rederingGipName = this.state.currentTitle;
        let rederingGifSource = this.state.currentSource;
        if (localStorage.getItem("mywayGiphyCount") === null) {
            localStorage.setItem("mywayGiphyCount", this.count);
        }
        let gifCount = parseInt(localStorage.getItem("mywayGiphyCount"));
        if (currentArray) {
            if (currentArray !== 'undefined' && currentArray.length > 0) {
                if (gifCount >= 0 && currentArray.length >= gifCount) {
                    if (currentArray.length == gifCount) {
                        gifCount = 0;
                    }
                    rederingGipUrl = currentArray[gifCount].url;
                    rederingGipName = currentArray[gifCount].name;
                    rederingGifSource = currentArray[gifCount].source;
                } else {
                    gifCount = 0;
                    rederingGipUrl = currentArray[gifCount].url;
                    rederingGipName = currentArray[gifCount].name;
                    rederingGifSource = currentArray[gifCount].source;
                }
            } else {
                let currentGifArray = this.formatGifs(this.props.config.currentGifList, 'reddit');
                localStorage.setItem("mywayGiphyArray", JSON.stringify(currentGifArray));

            }
            gifCount += 1;
            localStorage.setItem("mywayGiphyCount", gifCount);
        }
        let gifImgWindow = <img id="gif-pic" src='https://s3.amazonaws.com/tholman.com/img/static.gif' />;
        if (rederingGipUrl[rederingGipUrl.length - 1] === 'v' || rederingGifSource === 'imgur') {
            let givId = rederingGipUrl.match(/imgur.com\/(...*)\.(gifv|gif)/);
            // Todo vidStyles will change
            gifImgWindow = <video poster={`//i.imgur.com/${givId[1]}.jpg`} preload="auto" autoPlay="autoplay" muted="muted" loop="loop" webkit-playsinline="" id="gif-pic" className='video-gifv'><source src={`//i.imgur.com/${givId[1]}.mp4`} type="video/mp4" /></video>
            log('Render', 'GIFV!!!!!!');
        } else {
            gifImgWindow = <img id="gif-pic" src={rederingGipUrl} />;
        }
        //rederingGipUrl[rederingGipUrl.length - 1] === 'v' ? <iframe src='http://i.imgur.com/NMlK3Bc.gifv' /> : <img id="gif-pic" src={rederingGipUrl} />
        // <video poster="//i.imgur.com/pmtlqx7h.jpg" preload="auto" autoplay="autoplay" muted="muted" loop="loop" webkit-playsinline="" style="width: 527px; height: 292px;"> <source src="//i.imgur.com/pmtlqx7.mp4" type="video/mp4"></video>

        return(
            <div>
            <SharePrompt props={this.props} />
                <div className='tv-container'>
                    {/*<div className='gif-container'>
                         <div className='gif-name'>
                            <div className='tite-container'>
                                <h1 dangerouslySetInnerHTML={{__html: rederingGipName}} />
                            </div>
                        </div>


                    </div>
                    <div className='share-click' onClick={() => this.handleShare()}>
                        <img className='tv-image' src='https://media.giphy.com/media/eslTmXcTNiiVDSyh0W/giphy.gif'/>
                    </div>
                    <img className='tv-image responsive-img' src='https://media.giphy.com/media/eslTmXcTNiiVDSyh0W/giphy.gif'/> */}
                    <div className='tv-screen'>
                        <div className='mediaWrapper'>
                            {gifImgWindow}
                        </div>
                    </div>
                </div>
            </div>
        ); 
    }

}