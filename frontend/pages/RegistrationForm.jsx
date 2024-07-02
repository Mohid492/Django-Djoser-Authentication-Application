import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

const RegistrationForm = () => {
  const [registrationError, setRegistrationError] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    name: Yup.string().required('Required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
    re_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:8000/auth/users/', values, {
        withCredentials: true,
      });

      console.log('Registration successful:', response.data);
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Registration error:', error.response?.data || error);
      if (error.response && error.response.data) {
        if (error.response.data.email) {
          setRegistrationError(error.response.data.email[0]);
        } else if (error.response.data.non_field_errors) {
          setRegistrationError(error.response.data.non_field_errors[0]);
        } else {
          setRegistrationError('Registration failed.');
        }
      } else {
        setRegistrationError('Network Error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAlertClose = (error = false) => {
    if (error) {
      setRegistrationError(null); // Clear the error
    } else {
      setShowSuccessAlert(false);
      window.location.href = '/login'; // Redirect to login
    }
  };

  return (
    <Formik
      initialValues={{ email: '', name: '', password: '', re_password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <div>
          {/* Alerts at the top */}
          <div className="d-flex justify-content-center">
            {showSuccessAlert && (
              <Alert variant="success" dismissible onClose={() => handleAlertClose()}>
                <Alert.Heading>Registration Successful!</Alert.Heading>
                <p>Please check your email for account activation.</p>
                {/* Close button with custom text */}
                <Button variant="outline-success" onClick={() => handleAlertClose()}>
                  Close
                </Button>
              </Alert>
            )}
            <div>
              <p>Already have an account? <a href="/login">Login</a></p>
            </div>
            {registrationError && (
              <Alert variant="danger" dismissible onClose={() => handleAlertClose(true)}>
                <Alert.Heading>Registration Error!</Alert.Heading>
                <p>{registrationError}</p>
                <Button variant="outline-danger" onClick={() => handleAlertClose(true)}>
                  Close
                </Button>
              </Alert>
            )}
          </div>

          <Form>
            <div>
              <label htmlFor="email">Email:</label>
              <Field type="email" id="email" name="email" />
              <ErrorMessage name="email" component="div" />
            </div>

            <div>
              <label htmlFor="name">Name:</label>
              <Field type="text" id="name" name="name" />
              <ErrorMessage name="name" component="div" />
            </div>

            <div>
              <label htmlFor="password">Password:</label>
              <Field type="password" id="password" name="password" />
              <ErrorMessage name="password" component="div" />
            </div>

            <div>
              <label htmlFor="re_password">Confirm Password:</label>
              <Field type="password" id="re_password" name="re_password" />
              <ErrorMessage name="re_password" component="div" />
            </div>
            
            <Button type="submit" disabled={isSubmitting} variant="primary">
              Register
            </Button>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default RegistrationForm;