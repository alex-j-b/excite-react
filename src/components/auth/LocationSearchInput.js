import React, { Component } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
    
export default class LocationSearchInput extends Component {
    handleChange = this.handleChange.bind(this);
    handleSelect = this.handleSelect.bind(this);

    handleChange(address) {
        this.props.onLocationChange(address);
    };
    
    handleSelect(address) {
        this.props.onLocationChange(address);
    };
    
    render() {
        return (
            <PlacesAutocomplete
                value={this.props.address || ''}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                    <>
                        <input
                            {...getInputProps({
                                placeholder: 'Adresse',
                                className: 'location-search-input',
                            })}
                        />
                        <div className="autocomplete-dropdown-container">
                            {suggestions.map(suggestion => {
                                const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                return (
                                    <div
                                        {...getSuggestionItemProps(suggestion, {
                                            className,
                                            style,
                                        })}
                                    >
                                        <span>{suggestion.description}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </PlacesAutocomplete>
        );
    }
}