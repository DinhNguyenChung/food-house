import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
// Kiểm tra xem global có được định nghĩa hay không
window.global = window;

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.subscriptions = {};
    this.connected = false;
    this.connectionPromise = null;
  }

  // Kết nối tới WebSocket server
  connect() {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      const socket = new SockJS('http://localhost:8080/ws');
      this.stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.stompClient.onConnect = () => {
        console.log('Connected to WebSocket');
        console.log('Subscribing to topics:', Object.keys(this.subscriptions));
        this.connected = true;
        resolve(true);
      };

      this.stompClient.onStompError = (frame) => {
        console.error('WebSocket error:', frame);
        reject(frame);
      };

      this.stompClient.activate();
    });

    return this.connectionPromise;
  }

  // Đăng ký nhận thông báo từ một topic
  subscribeToTopic(topic, callback) {
    return this.connect().then(() => {
      if (!this.subscriptions[topic]) {
        this.subscriptions[topic] = this.stompClient.subscribe(
          `/topic/${topic}`,
          (message) => {
            const notification = JSON.parse(message.body);
            callback(notification);
          }
        );
      }
      return true;
    });
  }

  // Đăng ký nhận thông báo theo role
  subscribeToRole(role, callback) {
    return this.connect().then(() => {
      if (!this.subscriptions[`role_${role}`]) {
        this.subscriptions[`role_${role}`] = this.stompClient.subscribe(
          `/queue/role/${role}`,
          (message) => {
            const notification = JSON.parse(message.body);
            callback(notification);
          }
        );
      }
      return true;
    });
  }

  // Đăng ký nhận thông báo cá nhân
  subscribeToUser(userId, callback) {
    return this.connect().then(() => {
      if (!this.subscriptions[`user_${userId}`]) {
        this.subscriptions[`user_${userId}`] = this.stompClient.subscribe(
          `/user/${userId}/queue/notifications`,
          (message) => {
            const notification = JSON.parse(message.body);
            callback(notification);
          }
        );
      }
      return true;
    });
  }

  // Hủy đăng ký một topic
  unsubscribe(topic) {
    if (this.subscriptions[topic]) {
      this.subscriptions[topic].unsubscribe();
      delete this.subscriptions[topic];
    }
  }

  // Gửi thông báo đến server
  sendNotification(notification) {
    return this.connect().then(() => {
      this.stompClient.publish({
        destination: '/app/notification',
        body: JSON.stringify(notification)
      });
      return true;
    });
  }

  // Đóng kết nối WebSocket
  disconnect() {
    if (this.stompClient !== null && this.connected) {
      Object.keys(this.subscriptions).forEach(topic => {
        this.unsubscribe(topic);
      });
      
      this.stompClient.deactivate();
      this.connected = false;
      this.connectionPromise = null;
      console.log('Disconnected from WebSocket');
    }
  }
}

// Tạo một instance duy nhất
const websocketService = new WebSocketService();
export default websocketService;