import { AxiosError } from 'axios';
import { ToastAndroid, Alert } from 'react-native';

// Global error handling function
export const handleHttpError = (error: AxiosError) => {
  try {
    if (error.response) {
      try {
        // The request was made, but the server responded with a status code other than 2xx.
        // You can access error.response.data and error.response.status for details.

        // Use type assertion to specify the type of error.response.data if you are certain about its structure
        const responseData = error.response.data as { message: string }; // Replace with the actual structure

        console.log('Error response data:', "Bad Request----" + responseData);
        const errorMessage = responseData.message || 'Bad Request';

        switch (error.response.status) {
          case 400:
            // Handle a 400 Bad Request
            const errorMessage400 = responseData.message || 'Bad Request';
            ToastAndroid.show(errorMessage400, ToastAndroid.LONG);
            break;
          case 401:
            // Handle a 401 Unauthorized
            ToastAndroid.show(
              `Unauthorized: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 500:
            // Handle a 401 Unauthorized
            ToastAndroid.show(
              `500: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 402:
            // Handle a 402 Payment Required
            ToastAndroid.show(
              `Payment Required: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 403:
            // Handle a 403 Forbidden
            ToastAndroid.show(`Forbidden: ${errorMessage} `, ToastAndroid.LONG);
            break;
          case 404:
            // Handle a 404 Not Found
            ToastAndroid.show(`Not Found: ${errorMessage} `, ToastAndroid.LONG);
            break;
          case 405:
            // Handle a 405 Method Not Allowed
            ToastAndroid.show(
              `Method Not Allowed: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 406:
            // Handle a 406 Not Acceptable
            ToastAndroid.show(
              `Not Acceptable: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 407:
            // Handle a 407 Proxy Authentication Required
            ToastAndroid.show(
              `Proxy Authentication Required: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 408:
            // Handle a 408 Request Timeout
            ToastAndroid.show(
              `Request Timeout: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 409:
            // Handle a 409 Conflict
            ToastAndroid.show(`Conflict: ${errorMessage} `, ToastAndroid.LONG);
            break;
          case 410:
            // Handle a 410 Gone
            ToastAndroid.show(`Gone: ${errorMessage} `, ToastAndroid.LONG);
            break;
          case 411:
            // Handle a 411 Length Required
            ToastAndroid.show(
              `Length Required: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 412:
            // Handle a 412 Precondition Failed
            ToastAndroid.show(
              `Precondition Failed: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 413:
            // Handle a 413 Payload Too Large
            ToastAndroid.show(
              `Payload Too Large: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 414:
            // Handle a 414 URI Too Long
            ToastAndroid.show(
              `URI Too Long: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 415:
            // Handle a 415 Unsupported Media Type
            ToastAndroid.show(
              `Unsupported Media Type: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 416:
            // Handle a 416 Range Not Satisfiable
            ToastAndroid.show(
              `Range Not Satisfiable: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 417:
            // Handle a 417 Expectation Failed
            ToastAndroid.show(
              `Expectation Failed: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 418:
            // Handle a 418 I'm a teapot
            ToastAndroid.show("I'm a teapot", ToastAndroid.LONG);
            break;
          case 421:
            // Handle a 421 Misdirected Request
            ToastAndroid.show(
              `Misdirected Request: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 422:
            // Handle a 422 Unprocessable Entity
            ToastAndroid.show(
              `Unprocessable Entity: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 423:
            // Handle a 423 Locked
            ToastAndroid.show(`Locked: ${errorMessage} `, ToastAndroid.LONG);
            break;
          case 424:
            // Handle a 424 Failed Dependency
            ToastAndroid.show(
              `Failed Dependency: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 425:
            // Handle a 425 Too Early
            ToastAndroid.show(`Too Early: ${errorMessage} `, ToastAndroid.LONG);
            break;
          case 426:
            // Handle a 426 Upgrade Required
            ToastAndroid.show(
              `Upgrade Required: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 428:
            // Handle a 428 Precondition Required
            ToastAndroid.show(
              `Precondition Required: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 429:
            // Handle a 429 Too Many Requests
            ToastAndroid.show(
              `Too Many Requests: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 431:
            // Handle a 431 Request Header Fields Too Large
            ToastAndroid.show(
              `Request Header Fields Too Large: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;
          case 451:
            // Handle a 451 Unavailable For Legal Reasons
            ToastAndroid.show(
              `Unavailable For Legal Reasons: ${errorMessage} `,
              ToastAndroid.LONG,
            );
            break;

          // Add more cases for other status codes as needed
          default:
            ToastAndroid.show(
              `An error occurred during the request: ${errorMessage} `,
              ToastAndroid.LONG,
            );
        }
      } catch (error) {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      }
    } else if (error.request) {
      try {
        // The request was made, but there was no response from the server.
        console.log('No response received from the server.');
        // ToastAndroid.show(
        //   `something went wrong please try again..`,
        //   ToastAndroid.LONG,
        // );

        // Alert.alert(
        //   'Server issue',
        //   'something went wrong please try again..',
        //   [
        //     {
        //       text: 'Retry',
        //       onPress: () => {

        //         //dispatch(clearProducts());
        //       },
        //     },
        //   ],
        // );

      } catch (error) {
        ToastAndroid.show(
          'No response received from the server' + error,
          ToastAndroid.SHORT,
        );
      }
    } else {
      try {
        // Something happened in setting up the request that triggered an error.
        console.log('Error:', error.message);
        ToastAndroid.show(
          'An error occurred: ' + error.message,
          ToastAndroid.LONG,
        );
      } catch (error) {
        console.log('Error:', error);
      }
    }
  } catch (error) {
    ToastAndroid.show('An error occurred: ' + error, ToastAndroid.LONG);
  }
};
