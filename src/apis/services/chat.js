import axios from '../axios/axios';
import { handleHttpError } from '../errorHandle/errorHandle';
// Example function to make a request

const getChatApi = async (orderId) => {
  console.log("orderId id===>", orderId)
  try {

    const response = await axios.get(`Chat/get-chats/${orderId} `);
    console.log('response chat get api:', response.data);
    return response;

  } catch (error) {
    console.log('Error in  chat get api:', error);
    handleHttpError(error);
  }
};
const sendChat = async (body) => {
  console.log("body response send chat", body);
  try {
    const response = await axios.post('Chat', body); // Replace with your API endpoint
    console.log('response send chat=>', response.data);
    return response;
  } catch (error) {
    console.log('Error in send chat:', error);
    handleHttpError(error);
  }
};
const getChatService = async () => {
  try {
    const response = await axios.get('ChatTopic'); // Replace with your API endpoint
    console.log('Chat Topic====================>:', response.data);
    return response;
  } catch (error) {
    console.log('Error in Chat Topic: ', error);
    handleHttpError(error);
  }
};

const startSessionChat = async (body) => {
  console.log("body id===>", body)
  try {

    const response = await axios.post(`Chat/chat-session`, body);
    console.log('response chat startSessionChat api:', response.data);
    return response;

  } catch (error) {
    console.log('Error in  chat startSessionChat api:', error);
    handleHttpError(error);
  }
};
const getChatArray = async (chatSessionId) => {
  try {
    const response = await axios.get(`Chat/get-chat-session/${chatSessionId}`); // Replace with your API endpoint
    console.log('response Chat get ====================>:', response.data);
    return response;
  } catch (error) {
    console.log('Error in Chat get : ', error);
    handleHttpError(error);
  }
};
// const getConfiguration = async () => {
//   try {
//     const response = await axios.get(`Chat/get-chat-session/${chatSessionId}`); // Replace with your API endpoint
//     console.log('response Chat get ====================>:', response.data);
//     return response;
//   } catch (error) {
//     console.log('Error in Chat get : ', error);
//     handleHttpError(error);
//   }
// };
export const ChatService = {
  getChatApi,
  sendChat,
  getChatService,
  startSessionChat,
  getChatArray,
  // getConfiguration
}

