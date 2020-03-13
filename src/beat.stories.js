import React from 'react';
import { Button } from '@storybook/react/demo';
import Beat from './Beat.jsx';

export default { title: 'Button' };

export const withText = () => <Button>Hello Button</Button>;

export const withEmoji = () => (
  <Button>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);

export const diagram = () => {
    return (
        <div style={{position: 'fixed', top:0, left: 0, right: 0, bottom: 0}}>
            <Beat/>
        </div>
    );
}