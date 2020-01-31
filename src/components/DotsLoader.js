import React, { Component } from 'react';
import { css } from '@emotion/core';
import { PulseLoader } from 'react-spinners';
 
const override = css`
    display: table;
    margin: 3px auto -22px auto;
    width: fit-content;
`;

export default class DotsLoader extends Component {
    render() {
        return (
        <div className='sweet-loading'>
            <PulseLoader
                css={override}
                sizeUnit={"px"}
                size={10}
                color={'rgb(100, 0, 100)'}
                loading={false}
            />
        </div> 
        )
    }
}