const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

// Test từng API một
async function testIndividualAPIs() {
    try {
        console.log('🧪 Test từng API Message...\n');

        // 1. Login để lấy token
        console.log('1. Login để lấy token...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            username: 'testuser12330',
            password: 'Password123!'
        });
        const user1Token = loginResponse.data;
        console.log('✅ Token:', user1Token);

        const user1Id = '69ce17df2b860062847b1545'; // từ output trước
        const user2Id = '69ce17df2b860062847b154a';

        // 2. Test POST /messages - Gửi message
        console.log('\n2. Test POST /messages (gửi text message)');
        const sendMessage = await axios.post(`${BASE_URL}/messages`, {
            to: user2Id,
            type: 'text',
            text: 'Test message từ script!'
        }, {
            headers: { Authorization: `Bearer ${user1Token}` }
        });
        console.log('✅ Message sent:', sendMessage.data);

        // 3. Test GET /messages/:userID - Lấy messages giữa 2 user
        console.log('\n3. Test GET /messages/:userID (lấy messages giữa 2 user)');
        const getMessages = await axios.get(`${BASE_URL}/messages/${user2Id}`, {
            headers: { Authorization: `Bearer ${user1Token}` }
        });
        console.log('✅ Messages:', JSON.stringify(getMessages.data, null, 2));

        // 4. Test GET /messages - Lấy last messages
        console.log('\n4. Test GET /messages (lấy last messages với mỗi user)');
        const getLastMessages = await axios.get(`${BASE_URL}/messages`, {
            headers: { Authorization: `Bearer ${user1Token}` }
        });
        console.log('✅ Last messages:', JSON.stringify(getLastMessages.data, null, 2));

        console.log('\n🎉 Tất cả API đã test thành công!');

    } catch (error) {
        console.error('❌ Lỗi:', error.response ? error.response.data : error.message);
    }
}

testIndividualAPIs();