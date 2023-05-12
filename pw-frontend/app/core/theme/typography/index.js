const Typography = theme => {
  return {
    h1: {
      fontWeight: 'bold',
      letterSpacing: '-1.9px',
      color: theme.palette.text.primary,
      fontSize: '3rem',
      [theme.breakpoints.up('md')]: {
        fontSize: '3.75rem', // Maximum font size for screens larger than 'lg' breakpoint
      }
    },
    h2: {
      fontWeight: 500,
      letterSpacing: '-0.5px',
      color: theme.palette.text.primary
    },
    h3: {
      fontWeight: 500,
      letterSpacing: 0,
      color: theme.palette.text.primary
    },
    h4: {
      fontWeight: 500,
      letterSpacing: '0.25px',
      color: theme.palette.text.primary
    },
    h5: {
      fontWeight: 500,
      letterSpacing: 0,
      color: theme.palette.text.primary
    },
    h6: {
      letterSpacing: '0.15px',
      color: theme.palette.text.primary,
      fontSize: '.8rem',
      [theme.breakpoints.up('md')]: {
        fontSize: '1rem', // Maximum font size for screens larger than 'lg' breakpoint
      }
    },
    subtitle1: {
      letterSpacing: '0.15px',
      color: theme.palette.text.secondPrimary
    },
    logoStyle: {
      fontWeight: 600,
      color: theme.palette.text.primary,
      fontSize: '20px',
      [theme.breakpoints.up('md')]: {
        fontSize: '28px', // Maximum font size for screens larger than 'lg' breakpoint
      }
    },
    subtitle2: {
      letterSpacing: '0.1px',
      fontSize: '0.8rem',
      color: theme.palette.text.secondPrimary
    },
    body1: {
      letterSpacing: '0.15px',
      color: theme.palette.text.primary
    },
    body2: {
      lineHeight: 1.429,
      letterSpacing: '0.15px',
      color: theme.palette.text.secondary
    },
    button: {
      letterSpacing: '0.4px',
      color: theme.palette.text.primary
    },
    caption: {
      lineHeight: 1.25,
      letterSpacing: '0.4px',
      color: theme.palette.text.secondary
    },
    overline: {
      letterSpacing: '1px',
      color: theme.palette.text.secondary
    }
  }
}

export default Typography
