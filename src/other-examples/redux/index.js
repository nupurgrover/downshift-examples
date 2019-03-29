import React, { Component } from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import glamorous, { Div } from 'glamorous';
import { css } from 'glamor';
import matchSorter from 'match-sorter';
import Downshift from 'downshift';
import {
    Menu,
    ControllerButton,
    Input,
    Item,
    ArrowIcon,
    XIcon
} from './components';
import downshiftStore from './store';
import * as Actions from './actions';

function ExampleDownshift({ itemToString, getItems, ...rest }) {
    return (
        <Downshift itemToString={itemToString} {...rest}>
            {({
                getInputProps,
                getButtonProps,
                getItemProps,
                isOpen,
                toggleMenu,
                clearSelection,
                selectedItem,
                inputValue,
                highlightedIndex
            }) =>
                <div className={css({ width: 250, margin: 'auto' })}>
                    <Div position="relative" css={{ paddingRight: '1.75em' }}>
                        <Input
                            {...getInputProps({
                                isOpen,
                                placeholder: 'Find a Star Wars character'
                            })}
                        />
                        {selectedItem
                            ? <ControllerButton
                                css={{ paddingTop: 4 }}
                                onClick={clearSelection}
                                aria-label="clear selection"
                            >
                                <XIcon />
                            </ControllerButton>
                            : <ControllerButton {...getButtonProps()}>
                                <ArrowIcon isOpen={isOpen} />
                            </ControllerButton>}
                    </Div>
                    {!isOpen
                        ? null
                        : <Menu>
                            {getItems(inputValue).map((item, index) =>
                                <Item
                                    key={item.id}
                                    {...getItemProps({
                                        item,
                                        index,
                                        isActive: highlightedIndex === index,
                                        isSelected: selectedItem === item
                                    })}
                                >
                                    {itemToString(item)}
                                </Item>
                            )}
                        </Menu>}
                </div>}
        </Downshift>
    );
}

class AppContainer extends React.Component {
    handleChange = (selectedItem, downshiftState) => {
        const { addItem, removeItem } = this.props;

        if (!selectedItem) {
            removeItem(selectedItem);
        } else {
            addItem(selectedItem);
        }
    };
    getItems = value => {
        const { items } = this.props;

        return value
            ? matchSorter(items, value, {
                keys: ['name']
            })
            : items;
    };
    itemToString(i) {
        return i ? i.name : '';
    }
    render() {
        const { selectedItem } = this.props;

        return (
            <Div
                css={{
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: 'sans-serif',
                    justifyContent: 'center',
                    textAlign: 'center'
                }}
            >
                <h2>Redux example</h2>
                <ExampleDownshift
                    selectedItem={selectedItem}
                    onStateChange={this.handleStateChange}
                    onChange={this.handleChange}
                    getItems={this.getItems}
                    itemToString={this.itemToString}
                />
            </Div>
        );
    }
}

function mapStateToProps({ select }) {
    return {
        items: select.items,
        selectedItem: select.selectedItem
    };
}
const App = connect(mapStateToProps, {
    ...Actions
})(AppContainer);

function Root({ store }) {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

render(<Root store={downshiftStore} />, document.getElementById('root'));
