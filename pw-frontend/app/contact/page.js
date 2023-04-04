'use client'

import React from 'react';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Link,
} from '@mui/material';

const ContactForm = () => {
  return (
    <div>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1">
          Get in Touch
        </Typography>
        <Typography variant="subtitle1">
          We want to hear from you. Let us know how we can help.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Full Name"
              placeholder="ex. John Doe"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Store Link"
              placeholder="ex. John Doe"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Email"
              placeholder="ex. john@mail.com"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              required
              label="Select Option"
              placeholder="Select one..."
              SelectProps={{ native: true }}
            >
              <option value="">Select one...</option>
              <option value="First">First Choice</option>
              <option value="Second">Second Choice</option>
              <option value="Third">Third Choice</option>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              required
              label="Message"
              placeholder="Describe your task or list of tasks for us."
              rows={4}
            />
            <Typography variant="body2">
              By submitting this form you consent to us emailing you
              occasionally about our products and services. You can
              unsubscribe from emails at any time, and we will never pass your
              email onto third parties.{' '}
              <Link href="https://blaze-template.webflow.io/" underline="hover">
                Privacy Policy
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ContactForm;
