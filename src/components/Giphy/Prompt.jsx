import React from 'react';
import ReactDOM from 'react-dom';

import eventListener from 'eventlistener';


export default class Prompt extends React.Component {

    static displayName = 'Prompt';

    // static propTypes = {
    //     type: React.PropTypes.string,
    //     visible: React.PropTypes.bool,
    //     position: React.PropTypes.shape({
    //         top: React.PropTypes.number,
    //         right: React.PropTypes.number,
    //         left: React.PropTypes.number,
    //         bottom: React.PropTypes.number,
    //     }),
    //     children: React.PropTypes.node,
    //     onOverlayClick: React.PropTypes.func,
    //     onModalClick: React.PropTypes.func,
    //     updatePosition: React.PropTypes.func,
    //     repositionOnMount: React.PropTypes.bool,
    // };

    static defaultProps = {
        visible: false,
        repositionOnMount: false,
        position: {
            top: -99999,
            left: -99999,
        },
    };

    constructor(props) {
        super(props);
        this.reposition = this.reposition.bind(this);
    }

    componentDidMount() {
        if (this.props.repositionOnMount) {
            window.setTimeout(this.reposition, 0);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.visible !== prevProps.visible) {
            if (this.props.visible === true) {
                eventListener.add(window, 'resize', this.reposition, false);
                window.setTimeout(this.reposition, 0);
            }
            else if (this.props.visible === false) {
                eventListener.remove(window, 'resize', this.reposition);
            }
        }
    }

    reposition() {
        const prompt = ReactDOM.findDOMNode(this.refs.prompt);
        if (!prompt || typeof this.props.updatePosition !== 'function') {
            return;
        }

        const height = window.innerHeight || document.body.clientHeight;
        const width = window.innerWidth || document.body.clientWidth;
        const top = (height - prompt.offsetHeight) / 2;
        const left = (width - prompt.offsetWidth) / 2;
        this.props.updatePosition({
            top: Math.max(0, top),
            left: Math.max(0, left),
        });
    }

    render() {
        if (!this.props.visible) {
            return null;
        }

        return (
            <div className="prompt-manager">
                <div className="prompt-overlay" onClick={this.props.onOverlayClick}></div>
                <div className="prompt-modal"
                    ref="prompt"
                    onClick={this.props.onModalClick}
                    style={{
                        top: this.props.position.top,
                        right: this.props.position.right,
                        left: this.props.position.left,
                        bottom: this.props.position.bottom,
                    }}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }
}
