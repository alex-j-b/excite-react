import React, { Component } from 'react';
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';

const override = css`
    position: absolute;
    top: calc(50% - 25px);
    left: calc(50% - 25px);
`;

export default class CircleLoader extends Component {
    render() {
        return (
        <div className='sweet-loading'>
            <ClipLoader
                css={override}
                sizeUnit={"px"}
                size={50}
                color={'rgb(100, 0, 100)'}
                loading={this.props.loading}
            />
        </div>
        )
    }
}
