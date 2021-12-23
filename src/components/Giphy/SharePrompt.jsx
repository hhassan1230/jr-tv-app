import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';
import jsonp from 'jsonp';
import Prompt from './Prompt';

const log = debug('wtt.SharePrompt');

const title = 'GitHub';
const shareUrl = 'https://i.redd.it/ylqdihuc17ay.gif';

export default class TVPrompt extends React.Component {
    constructor(props) {
        log('constructor');
        super(props);
        this.state = {
            promptVisible: false
        };
        this.repositionShowPrompt = this.repositionShowPrompt.bind(this);
    }

    repositionShowPrompt() {
        const prompt = ReactDOM.findDOMNode(this.refs.tvShowPrompt);
        if (!prompt) return;

        const height = window.innerHeight || document.body.clientHeight;
        const width = window.innerWidth || document.body.clientWidth;
        const top = (height + document.documentElement.scrollTop - prompt.offsetHeight) / 2;
        const left = (width + document.documentElement.scrollLeft - prompt.offsetWidth) / 2;
        // TVActions.updatePosition({
        //     top: Math.max(0, top),
        //     left: Math.max(0, left),
        // });
    }

    closeModal(){
        //TVActions.hide();
    }

    modalContent(){
        if (!this.props.visible) {
            return null;
        }
        return(
        	<div>
	            <div className="closeBtn trigerClose track" onClick={() => this.closeModal()}></div>

        	</div>
    	);
	}

    render() {
        log('promptrender', this.props, this.state);

        return(
            <Prompt
                type="contentModal"
                visible={this.props.visible/* set to true to work on model*/}
                // visible={true}
                position={this.props.position}
                onOverlayClick={this.overlayClicked}
                >

                {/*<div className="model" ref="sharePrompt" onLoad={this.repositionShowPrompt}>
                    this.modalContent()
                    <TwitterShareButton
                        url={shareUrl}
                        title={title}
                        className="Demo__some-network__share-button">
                        <TwitterIcon
                          size={32}
                          round />
                    </TwitterShareButton>
                    <FacebookShareButton
                        url={shareUrl}
                        title={title}
                        className="Demo__some-network__share-button">
                        <FacebookIcon
                          size={32}
                          round />
                    </FacebookShareButton>
                </div>*/}
            </Prompt>
        );
    }
}