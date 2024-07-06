import axios from 'axios';

export const axiosErrorHandler = error => {
  console.log('axiosErrorHandler', error);
  if (axios.isCancel(error)) {
    return {message: `Request cancelled ${error.message}`};
  }

  const {request, response} = error;
  if (response) {
    let message = '';
    if (isObject(response.data)) {
      if (hasProp(response.data, 'message')) {
        message = response.data.message;
      } else {
        message = Object.values(response.data)
          .map(value => value)
          .join(',');
      }
    } else {
      message = response.data;
    }
    return {
      message: message,
    };
  } else if (request) {
    return {
      message: request.message,
    };
  } else {
    console.log('error', error);
    return {message: 'opps! something went wrong while setting up request'};
  }
};
function isObject(data) {
  return data && typeof data === 'object' && data.constructor === Object;
}
function hasProp(object, key) {
  return object ? hasOwnProperty.call(object, key) : false;
}

// const { request, response } = error;
// if (response) {
//   const { message } = response.data;
//   const status = response.status;
//   return {
//     message,
//     status,
//   };
// } else if (request) {
//   //request sent but no response received
//   return {
//     message: "server time out ${error.message}",
//     status: 503,
//   };
// } else {
//   // Something happened in setting up the request that triggered an Error
//   return {
//     message:
//       "opps! something went wrong while setting up request ${error.message}",
//   };
// }

// if (axios.isCancel(error)) {
//   return { message: `Request cancelled ${error.message}` };
// }
// if (response) {
//   let message = "";
//   if (isObject(response.data)) {
//     if (hasProp(response.data, "message")) {
//       message = response.data.message;
//     } else {
//       message = Object.values(response.data)
//         .map((value) => value)
//         .join(",");
//     }
//   } else {
//     message = response.data;
//   }
//   return {
//     message: message,
//   };
// } else if (request) {
//   return {
//     message: request.message,
//   };
// } else {
//   return { message: "opps! something went wrong while setting up request" };
// }

// function isObject(data) {
//   return data && typeof data === "object" && data.constructor === Object;
// }
// function hasProp(object, key) {
//   return object ? hasOwnProperty.call(object, key) : false;
// }
