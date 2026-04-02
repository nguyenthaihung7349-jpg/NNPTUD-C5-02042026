const axios = require('axios');

// Base URL
const BASE_URL = 'http://localhost:3000/api/v1';

// Test script for Message API
async function testMessageAPI() {
    try {
        console.log('🚀 Bắt đầu test Message API...\n');

        // 1. Register User 1
        console.log('1. Đăng ký User 1...');
        const user1Username = 'testuser1' + Math.floor(Math.random() * 10000);
        const user1Email = 'test1' + Math.floor(Math.random() * 10000) + '@example.com';
        const user1Register = await axios.post(`${BASE_URL}/auth/register`, {
            username: user1Username,
            password: 'Password123!',
            email: user1Email
        });
        const user1Id = user1Register.data.user._id;
        console.log('✅ User 1 đã tạo:', user1Register.data);
        console.log('✅ User 1 đã tạo:', user1Register.data);

        // 2. Register User 2
        console.log('\n2. Đăng ký User 2...');
        const user2Username = 'testuser2' + Math.floor(Math.random() * 10000);
        const user2Email = 'test2' + Math.floor(Math.random() * 10000) + '@example.com';
        const user2Register = await axios.post(`${BASE_URL}/auth/register`, {
            username: user2Username,
            password: 'Password123!',
            email: user2Email
        });
        const user2Id = user2Register.data.user._id;
        console.log('✅ User 2 đã tạo:', user2Register.data);
        console.log('✅ User 2 ID:', user2Id);

        // 3. Login User 1
        console.log('\n3. Đăng nhập User 1...');
        const user1Login = await axios.post(`${BASE_URL}/auth/login`, {
            username: user1Username,
            password: 'Password123!'
        });
        const user1Token = user1Login.data;
        console.log('✅ User 1 token:', user1Token);

        // 4. Login User 2
        console.log('\n4. Đăng nhập User 2...');
        const user2Login = await axios.post(`${BASE_URL}/auth/login`, {
            username: user2Username,
            password: 'Password123!'
        });
        const user2Token = user2Login.data;
        console.log('✅ User 2 token:', user2Token);

        // 5. User IDs đã có
        console.log('\n5. User IDs - User1:', user1Id, 'User2:', user2Id);

        // 6. Send Text Message (User 1 to User 2)
        console.log('\n6. Gửi tin nhắn text từ User 1 đến User 2...');
        const message1 = await axios.post(`${BASE_URL}/messages`, {
            to: user2Id,
            type: 'text',
            text: 'Xin chào User 2! Đây là tin nhắn từ User 1.'
        }, {
            headers: { Authorization: `Bearer ${user1Token}` }
        });
        console.log('✅ Message đã gửi:', message1.data);

        // 7. Send Text Message (User 2 to User 1)
        console.log('\n7. Gửi tin nhắn text từ User 2 đến User 1...');
        const message2 = await axios.post(`${BASE_URL}/messages`, {
            to: user1Id,
            type: 'text',
            text: 'Chào User 1! Cảm ơn tin nhắn của bạn.'
        }, {
            headers: { Authorization: `Bearer ${user2Token}` }
        });
        console.log('✅ Message đã gửi:', message2.data);

        // 8. Get Messages between User 1 and User 2
        console.log('\n8. Lấy toàn bộ tin nhắn giữa User 1 và User 2 (GET /:userID)...');
        const messagesBetween = await axios.get(`${BASE_URL}/messages/${user2Id}`, {
            headers: { Authorization: `Bearer ${user1Token}` }
        });
        console.log('✅ Messages giữa 2 user:', JSON.stringify(messagesBetween.data, null, 2));

        // 9. Get Last Messages for User 1
        console.log('\n9. Lấy tin nhắn cuối cùng với mỗi user cho User 1 (GET /)...');
        const lastMessages = await axios.get(`${BASE_URL}/messages`, {
            headers: { Authorization: `Bearer ${user1Token}` }
        });
        console.log('✅ Last messages cho User 1:', JSON.stringify(lastMessages.data, null, 2));

        // 10. Upload File (optional)
        console.log('\n10. Upload file...');
        const fs = require('fs');
        const FormData = require('form-data');
        const form = new FormData();
        form.append('file', fs.createReadStream('./test-file.txt')); // Tạo file test

        const uploadResponse = await axios.post(`${BASE_URL}/upload/one_file`, form, {
            headers: {
                ...form.getHeaders()
            }
        });
        const filePath = uploadResponse.data.path;
        console.log('✅ File uploaded:', uploadResponse.data);

        // 11. Send File Message
        console.log('\n11. Gửi tin nhắn file...');
        const fileMessage = await axios.post(`${BASE_URL}/messages`, {
            to: user2Id,
            type: 'file',
            text: filePath
        }, {
            headers: { Authorization: `Bearer ${user1Token}` }
        });
        console.log('✅ File message đã gửi:', fileMessage.data);

        console.log('\n🎉 Tất cả test đã hoàn thành thành công!');

    } catch (error) {
        console.error('❌ Lỗi:', error.response ? error.response.data : error.message);
    }
}

// Tạo file test để upload
const fs = require('fs');
if (!fs.existsSync('./test-file.txt')) {
    fs.writeFileSync('./test-file.txt', 'Đây là nội dung file test để upload.');
}

// Chạy test
testMessageAPI();