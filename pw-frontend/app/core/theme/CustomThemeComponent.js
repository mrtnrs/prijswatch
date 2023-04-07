import * as React from 'react';
import { ThemeComponent } from './ThemeComponent';

export default function CustomThemeComponent(props) {
  return (
    <React.ClientComponent>
      <ThemeComponent settings={props.settings} />
    </React.ClientComponent>
  );
}
