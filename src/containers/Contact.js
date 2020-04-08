//React
import React, { Component } from "react";
import "./Contact.css";
//Redux
import { connect } from "react-redux";
//Libs
import { API } from "aws-amplify";
//Components
import DotsLoader from '../components/DotsLoader';
//Images
import forestBG from "../images/forest.jpg";


class Contact extends Component {
    onChange = this.onChange.bind(this);
    onSubmit = this.onSubmit.bind(this);
    state = {
        email: '',
        text: '',
        loading: false
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    async onSubmit(e) {
        e.preventDefault();
        this.refs.emailNotSent.style.display = 'none';
        this.refs.emailSent.style.display = 'none';
        this.setState({ loading: true });

        try {
            const user = this.props.isLogged ? this.props.user : { email: this.state.email };
            await API.post('exciteAPI', '/postEmail', {
                'body': {
                    'user': user,
                    'text': this.state.text
                }
            });
            this.setState({
                loading: false,
                text: ''
            });
            this.refs.emailSent.style.display = 'inline';
        } catch(e) {
            this.setState({ loading: false });
            this.refs.emailNotSent.style.display = 'inline';
        }
    }

    componentDidUpdate() {
        this.refs.emailSent.style.display = 'inline';
    }

    componentDidMount() {
        let title = document.querySelector('head > title');
        title.innerHTML = 'Excite | Contact';
    }

    render() {
        return (
            <div className="contact" style={{ backgroundImage: `url(${forestBG})` }}>

                <form onSubmit={this.onSubmit}>
                    <p className="title"><span className="purple">C</span>ontactez-nous</p>
                    <h5>Si vous avez une question, n'hésitez pas à nous écrire, nous vous répondrons rapidement.</h5>

                    { !(this.props.isLogging || this.props.isLogged) &&
                        <>
                        <label htmlFor="email">
                            <span><span className="purple">E</span>mail</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Adresse email"
                            name="email"
                            spellCheck={false}
                            onChange={this.onChange}
                            value={this.state.email}
                            required
                        ></input>
                        </>
                    }

                    <label htmlFor="text">
                        <span><span className="purple">M</span>essage</span>
                    </label>
                    <textarea
                        type="text"
                        placeholder="Message..."
                        name="text"
                        spellCheck={false}
                        onChange={this.onChange}
                        value={this.state.text}
                        required
                    ></textarea>

                    <button className="e-button">Envoyer</button>
                    <span ref="emailNotSent" className="error-input email-notsent">Erreur, veuillez réessayer</span>
                    <span ref="emailSent" className="confirmation-modif email-sent">Message envoyé &#10004;</span>
                    <DotsLoader loading={this.state.loading}/>
                </form>

            </div>
        );
    }
}

function mapStateToProps(reduxState) {
    return {
        user: reduxState.user,
        isLogged: reduxState.isLogged,
        isLogging: reduxState.isLogging
    };
}
export default connect(mapStateToProps, null)(Contact);