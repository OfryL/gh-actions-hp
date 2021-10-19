import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import actions from './actions.json';
import Workflows from './components/workflows';

const App = () => (<Workflows data={actions}/>);

ReactDOM.render(<App />, document.getElementById('root'));
